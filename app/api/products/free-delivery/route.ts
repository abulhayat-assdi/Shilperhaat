import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Returns which of the given product IDs currently have free delivery.
// The cart calls this so stale flags saved in localStorage are refreshed.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const ids: string[] = Array.isArray(body?.ids)
      ? body.ids.filter((id: unknown): id is string => typeof id === "string").slice(0, 100)
      : [];
    if (ids.length === 0) return NextResponse.json({ freeDeliveryIds: [] });

    const products: { id: string }[] = await prisma.product.findMany({
      where: { id: { in: ids }, freeDelivery: true },
      select: { id: true },
    });
    return NextResponse.json({ freeDeliveryIds: products.map((p) => p.id) });
  } catch {
    return NextResponse.json({ error: "Failed to load delivery info" }, { status: 500 });
  }
}
