
import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import {
  initializeOrderPayment,
  PaymentError,
} from "./payment.service";

const paymentRouter = Router();

// POST /api/payments/orders/:orderNumber/initialize
paymentRouter.post(
  "/orders/:orderNumber/initialize",
  authenticate,
  async (req, res, next) => {
    try {
      const orderNumber = req.params.orderNumber;

      if (
        typeof orderNumber !== "string" ||
        !orderNumber.trim()
      ) {
        res.status(400).json({
          success: false,
          message: "A valid order number is required.",
        });
        return;
      }

      const result = await initializeOrderPayment(
        req.user!.id,
        orderNumber,
      );

      res.status(200).json({
        success: true,
        message: "Payment initialized successfully.",
        data: result,
      });
    } catch (error) {
      if (error instanceof PaymentError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
        return;
      }

      next(error);
    }
  },
);

export default paymentRouter;
