import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ensurePagesSeeded, serializePage } from "@/lib/pages";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await ensurePagesSeeded();
    const pages = await prisma.page.findMany({ orderBy: { slug: "asc" } });
    return NextResponse.json({ pages: pages.map(serializePage) });
  } catch (error) {
    console.error("GET /api/admin/pages error:", error);
    const message = error instanceof Error ? error.message : "";
    const tableMissing = message.includes("does not exist") || message.includes("P2021");
    return NextResponse.json(
      {
        error: tableMissing
          ? "Database table not found — the migration has not run yet. Redeploy the app so `prisma migrate deploy` creates the new tables."
          : "Internal server error",
      },
      { status: 500 }
    );
  }
}
