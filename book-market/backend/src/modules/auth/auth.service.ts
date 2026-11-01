
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Prisma, UserRole } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { env } from "../../config/env";
import type { LoginInput, RegisterInput } from "./auth.schemas";

export class AuthError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
  ) {
    super(message);
    this.name = "AuthError";
  }
}

function createToken(user: {
  id: string;
  email: string;
  role: UserRole;
}) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
    },
    env.JWT_SECRET,
    { expiresIn: "1h" },
  );
}

function publicUser(user: {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}) {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
}

export async function registerUser(input: RegisterInput) {
  const passwordHash = await bcrypt.hash(input.password, 12);

  try {
    const user = await prisma.user.create({
      data: {
        fullName: input.fullName,
        email: input.email,
        passwordHash,
        role: UserRole.CUSTOMER,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return {
      user,
      token: createToken(user),
    };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new AuthError(
        "An account with this email already exists",
        409,
      );
    }

    throw error;
  }
}

export async function loginUser(input: LoginInput) {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  // Use the same message for an unknown email and a wrong password.
  if (!user) {
    throw new AuthError("Invalid email or password", 401);
  }

  const passwordMatches = await bcrypt.compare(
    input.password,
    user.passwordHash,
  );

  if (!passwordMatches) {
    throw new AuthError("Invalid email or password", 401);
  }

  return {
    user: publicUser(user),
    token: createToken(user),
  };
}
