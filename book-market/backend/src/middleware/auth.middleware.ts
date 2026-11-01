
import type { RequestHandler } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { UserRole } from "@prisma/client";
import { env } from "../config/env";

interface TokenPayload extends JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
}

function isTokenPayload(payload: string | JwtPayload): payload is TokenPayload {
  if (typeof payload === "string") return false;

  return (
    typeof payload.sub === "string" &&
    typeof payload.email === "string" &&
    (payload.role === UserRole.CUSTOMER ||
      payload.role === UserRole.ADMIN)
  );
}

export const authenticate: RequestHandler = (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    res.status(401).json({
      success: false,
      message: "Authentication required",
    });
    return;
  }

  const token = authorization.slice("Bearer ".length).trim();

  if (!token) {
    res.status(401).json({
      success: false,
      message: "Authentication required",
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);

    if (!isTokenPayload(decoded)) {
      res.status(401).json({
        success: false,
        message: "Invalid authentication token",
      });
      return;
    }

    req.user = {
      id: decoded.sub,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch {
    res.status(401).json({
      success: false,
      message: "Invalid or expired authentication token",
    });
  }
};

export function authorize(...allowedRoles: UserRole[]): RequestHandler {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: "You do not have permission to access this resource",
      });
      return;
    }

    next();
  };
}
