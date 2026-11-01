
import { Router } from "express";
import { prisma } from "../../lib/prisma";
import { authenticate } from "../../middleware/auth.middleware";
import { checkoutSchema } from "./order.schemas";
import { createCheckoutOrder } from "./order.service";

const orderRouter = Router();

// POST /api/orders/checkout
// Create a new order for the authenticated customer.
orderRouter.post("/checkout", authenticate, async (req, res, next) => {
  const parsed = checkoutSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: "Invalid checkout information",
      errors: parsed.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
    return;
  }

  try {
    const order = await createCheckoutOrder(
      req.user!.id,
      parsed.data,
    );

    res.status(201).json({
      success: true,
      message: "Order created. Payment is still pending.",
      data: order,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/orders/my
// Retrieve orders belonging only to the authenticated customer.
orderRouter.get("/my", authenticate, async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        userId: req.user!.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        orderNumber: true,
        status: true,
        currency: true,
        subtotal: true,
        shippingFee: true,
        total: true,
        createdAt: true,
        items: {
          select: {
            id: true,
            titleSnapshot: true,
            format: true,
            quantity: true,
            unitPrice: true,
            lineTotal: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/orders/:orderNumber
// Retrieve one order, ensuring it belongs to the authenticated customer.
orderRouter.get(
  "/:orderNumber",
  authenticate,
  async (req, res, next) => {
    try {
      // Express may type route parameters as string | string[].
      // Validate the parameter before passing it to Prisma.
      const orderNumber = req.params.orderNumber;

      if (
        typeof orderNumber !== "string" ||
        orderNumber.trim().length === 0
      ) {
        res.status(400).json({
          success: false,
          message: "A valid order number is required.",
        });
        return;
      }

      const order = await prisma.order.findFirst({
        where: {
          orderNumber,
          userId: req.user!.id,
        },
        select: {
          id: true,
          orderNumber: true,
          status: true,
          currency: true,
          subtotal: true,
          shippingFee: true,
          total: true,
          recipientName: true,
          recipientPhone: true,
          deliveryAddress: true,
          deliveryCity: true,
          deliveryRegion: true,
          deliveryNotes: true,
          createdAt: true,
          updatedAt: true,
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

      if (!order) {
        res.status(404).json({
          success: false,
          message: "Order not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: order,
      });
    } catch (error) {
      next(error);
    }
  },
);

export default orderRouter;
