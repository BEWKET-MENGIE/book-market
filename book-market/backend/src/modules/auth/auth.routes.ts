
import { Router } from "express";
import { UserRole } from "@prisma/client";
import { registerSchema, loginSchema } from "./auth.schemas";
import { loginUser, registerUser } from "./auth.service";
import { authenticate, authorize } from "../../middleware/auth.middleware";

const authRouter = Router();

// POST /api/auth/register
authRouter.post("/register", async (req, res, next) => {
  const parsed = registerSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: "Invalid registration data",
      errors: parsed.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
    return;
  }

  try {
    const result = await registerUser(parsed.data);

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/login
authRouter.post("/login", async (req, res, next) => {
  const parsed = loginSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: "Invalid login data",
      errors: parsed.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
    return;
  }

  try {
    const result = await loginUser(parsed.data);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/auth/me
authRouter.get("/me", authenticate, (req, res) => {
  res.status(200).json({
    success: true,
    data: { user: req.user },
  });
});

// GET /api/auth/admin-check
// A temporary test route for role protection.
authRouter.get(
  "/admin-check",
  authenticate,
  authorize(UserRole.ADMIN),
  (_req, res) => {
    res.status(200).json({
      success: true,
      message: "Administrator access verified",
    });
  },
);

export default authRouter;
