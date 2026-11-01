
import { randomUUID } from "node:crypto";
import { PaymentStatus, Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { env } from "../../config/env";

export class PaymentError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = "PaymentError";
  }
}

interface ChapaInitializeResponse {
  status?: string;
  message?: string;
  data?: {
    checkout_url?: string;
  };
}

export async function initializeOrderPayment(
  userId: string,
  orderNumber: string,
) {
  // Find only an order belonging to this customer.
  const order = await prisma.order.findFirst({
    where: {
      orderNumber,
      userId,
    },
    include: {
      user: {
        select: {
          fullName: true,
          email: true,
        },
      },
    },
  });

  if (!order) {
    throw new PaymentError(404, "Order not found.");
  }

  if (order.status !== "PENDING") {
    throw new PaymentError(
      409,
      "Only pending orders can start payment.",
    );
  }

  if (order.total.lessThanOrEqualTo(0)) {
    throw new PaymentError(400, "Invalid order total.");
  }

  // Chapa v2 uses an integer amount in minor currency units.
  const amountInMinorUnits = new Prisma.Decimal(order.total)
    .mul(100)
    .toDecimalPlaces(0);

  if (
    !amountInMinorUnits.isInteger() ||
    amountInMinorUnits.lessThan(100)
  ) {
    throw new PaymentError(
      400,
      "The order total is below Chapa's minimum payment amount.",
    );
  }

  // Chapa v2 merchant references have a maximum length of 20.
  const merchantReference =
    `E${Date.now()}${randomUUID().replace(/-/g, "").slice(0, 6)}`;

  const idempotencyKey = randomUUID();

  // Create the pending payment record before contacting Chapa.
  const payment = await prisma.payment.create({
    data: {
      orderId: order.id,
      provider: "CHAPA",
      providerReference: merchantReference,
      status: PaymentStatus.PENDING,
      amount: order.total,
      currency: order.currency,
    },
  });

  try {
    const nameParts = order.user.fullName.trim().split(/\s+/);
    const firstName = nameParts[0] || "Customer";
    const lastName = nameParts.slice(1).join(" ") || firstName;

    const response = await fetch(
      "https://api.chapa.global/v2/payments/hosted",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.CHAPA_PRIVATE_KEY}`,
          "Content-Type": "application/json",
          "Idempotency-Key": idempotencyKey,
        },
        body: JSON.stringify({
          amount: Number(amountInMinorUnits.toFixed(0)),
          currency: order.currency,
          merchant_reference: merchantReference,
          customer: {
            first_name: firstName,
            last_name: lastName,
            email: order.user.email,
          },
          meta: {
            order_number: order.orderNumber,
            payment_id: payment.id,
          },
        }),
        signal: AbortSignal.timeout(15000),
      },
    );

    const result =
      (await response.json()) as ChapaInitializeResponse;

    if (
      !response.ok ||
      result.status?.toLowerCase() !== "success" ||
      !result.data?.checkout_url
    ) {
      throw new Error(
        `Chapa initialization failed: ${result.message ?? "Unknown provider response"}`,
      );
    }

    return {
      paymentId: payment.id,
      orderNumber: order.orderNumber,
      amount: order.total,
      currency: order.currency,
      checkoutUrl: result.data.checkout_url,
      merchantReference,
    };
  } catch (error) {
    // Keep a failed initialization from looking like a successful payment.
    await prisma.payment.update({
      where: {
        id: payment.id,
      },
      data: {
        status: PaymentStatus.FAILED,
      },
    });

    console.error("Chapa payment initialization failed.");

    throw new PaymentError(
      502,
      "Could not initialize payment. Please try again.",
    );
  }
}
