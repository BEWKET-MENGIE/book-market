
import { Router } from "express";
import { prisma } from "../lib/prisma";
import catalogRouter from "../modules/catalog/catalog.routes";
import authRouter from "../modules/auth/auth.routes";
import usersRouter from "../modules/users/users.routes";
import orderRouter from "../modules/orders/order.routes";
import paymentRouter from "../modules/payments/payment.routes";

const router = Router();
router.get("/health", async (_req, res, next) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      success: true,
      message: "Book-market API is running",
      database: "connected",
    });
  } catch (error) {
    next(error);
  }
})

router.use("/", catalogRouter);
router.use("/auth", authRouter);
router.use("/users", usersRouter);
router.use("/orders", orderRouter);
router.use("/payments", paymentRouter);
export default router;
