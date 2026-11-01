
import type {
  ErrorRequestHandler,
  Request,
  Response,
  NextFunction,
} from "express";

import { AuthError } from "../modules/auth/auth.service";
import { CheckoutError } from "../modules/orders/order.service";

export function notFoundHandler(
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}

export const errorHandler: ErrorRequestHandler = (
  error,
  _req,
  res,
  _next,
) => {
  if (error instanceof AuthError || error instanceof CheckoutError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
    return;
  }

  console.error(error);

  res.status(500).json({
    success: false,
    message: "An unexpected server error occurred",
  });
};
