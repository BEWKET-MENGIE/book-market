
import { randomUUID } from "node:crypto";
import {
  BookType,
  Prisma,
  PurchaseFormat,
} from "@prisma/client";
import { prisma } from "../../lib/prisma";
import type { CheckoutInput } from "./order.schemas";

export class CheckoutError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number = 400,
  ) {
    super(message);
    this.name = "CheckoutError";
  }
}

export async function createCheckoutOrder(
  userId: string,
  input: CheckoutInput,
) {
  return prisma.$transaction(
    async (tx) => {
      const requestedIds = input.items.map((item) => item.bookId);

      const books = await tx.book.findMany({
        where: {
          id: { in: requestedIds },
          isPublished: true,
        },
        select: {
          id: true,
          title: true,
          bookType: true,
          digitalPrice: true,
          physicalPrice: true,
          stockQuantity: true,
        },
      });

      const bookMap = new Map(books.map((book) => [book.id, book]));

      const orderItems: {
        bookId: string;
        titleSnapshot: string;
        format: PurchaseFormat;
        quantity: number;
        unitPrice: Prisma.Decimal;
        lineTotal: Prisma.Decimal;
      }[] = [];

      let subtotal = new Prisma.Decimal(0);
      let containsPhysicalBook = false;

      for (const item of input.items) {
        const book = bookMap.get(item.bookId);

        if (!book) {
          throw new CheckoutError(
            "One or more books are unavailable or unpublished",
            404,
          );
        }

        const isDigital = item.format === "DIGITAL";
        const isPhysical = item.format === "PHYSICAL";

        if (
          (book.bookType === BookType.DIGITAL && isPhysical) ||
          (book.bookType === BookType.PHYSICAL && isDigital)
        ) {
          throw new CheckoutError(
            `The selected format is unavailable for "${book.title}"`,
            400,
          );
        }

        const unitPrice = isDigital
          ? book.digitalPrice
          : book.physicalPrice;

        if (unitPrice === null) {
          throw new CheckoutError(
            `The selected format has no price for "${book.title}"`,
            400,
          );
        }

        if (isPhysical) {
          containsPhysicalBook = true;

          // Atomically reserve stock to reduce overselling risk.
          const reservation = await tx.book.updateMany({
            where: {
              id: book.id,
              isPublished: true,
              stockQuantity: { gte: item.quantity },
            },
            data: {
              stockQuantity: { decrement: item.quantity },
            },
          });

          if (reservation.count !== 1) {
            throw new CheckoutError(
              `Insufficient stock for "${book.title}"`,
              409,
            );
          }
        }

        const lineTotal = unitPrice.mul(item.quantity);
        subtotal = subtotal.add(lineTotal);

        orderItems.push({
          bookId: book.id,
          titleSnapshot: book.title,
          format: item.format as PurchaseFormat,
          quantity: item.quantity,
          unitPrice,
          lineTotal,
        });
      }

      // Shipping is temporarily zero. Configure real delivery pricing
      // before accepting production orders.
      const shippingFee = new Prisma.Decimal(0);
      const total = subtotal.add(shippingFee);

      const orderNumber =
        `EVG-${Date.now()}-${randomUUID().slice(0, 8).toUpperCase()}`;

      const order = await tx.order.create({
        data: {
          orderNumber,
          userId,
          status: "PENDING",
          currency: "ETB",
          subtotal,
          shippingFee,
          total,

          recipientName: containsPhysicalBook
            ? input.recipientName
            : null,
          recipientPhone: containsPhysicalBook
            ? input.recipientPhone
            : null,
          deliveryAddress: containsPhysicalBook
            ? input.deliveryAddress
            : null,
          deliveryCity: containsPhysicalBook
            ? input.deliveryCity
            : null,
          deliveryRegion: containsPhysicalBook
            ? input.deliveryRegion
            : null,
          deliveryNotes: containsPhysicalBook
            ? input.deliveryNotes
            : null,

          items: {
            create: orderItems,
          },
        },
        include: {
          items: {
            select: {
              id: true,
              bookId: true,
              titleSnapshot: true,
              format: true,
              quantity: true,
              unitPrice: true,
              lineTotal: true,
            },
          },
        },
      });

      return order;
    },
    {
      maxWait: 5000,
      timeout: 10000,
    },
  );
}
