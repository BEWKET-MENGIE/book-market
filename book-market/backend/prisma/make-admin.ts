
import "dotenv/config";
import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2]?.trim().toLowerCase();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error(
      "Provide the email of an existing account: npm run db:make-admin -- your@email.com",
    );
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
    },
  });

  if (!user) {
    throw new Error(
      "Account not found. Register this account first, then run the script again.",
    );
  }

  if (user.role === UserRole.ADMIN) {
    console.log(`${user.email} is already an administrator.`);
    return;
  }

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { role: UserRole.ADMIN },
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
    },
  });

  console.log("Administrator role assigned successfully:");
  console.log(updatedUser);
}

main()
  .catch((error) => {
    console.error("Administrator setup failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
