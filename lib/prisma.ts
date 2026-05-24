// Prisma client — requires 'npx prisma generate' to be run first
// and a valid DATABASE_URL in your .env file.
//
// Run: npx prisma generate && npx prisma db push
// to initialize the database schema.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let prisma: any;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaClient } = require("@prisma/client");

  const globalForPrisma = globalThis as unknown as { prisma: typeof PrismaClient | undefined };

  prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
      log:
        process.env.NODE_ENV === "development"
          ? ["query", "error", "warn"]
          : ["error"],
    });

  if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
} catch {
  console.warn(
    "Prisma client not generated yet. Run: npx prisma generate"
  );
  prisma = null;
}

export { prisma };
export default prisma;

