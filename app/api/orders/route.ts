import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const order = await prisma.order.create({
      data: {
        orderNumber: body.orderNumber,
        customerName: body.customerName,
        phone: body.phone,
        address: body.address,
        notes: body.notes || null,
        subtotal: body.subtotal,
        deliveryCharge: body.deliveryCharge ?? 0,
        total: body.total,
        paymentMethod: body.paymentMethod || "COD",
        status: "PENDING",
        items: {
          create: (body.items || []).map((item: any) => ({
            productId: item.productId || null,
            productTitle: item.productTitle,
            productImage: item.productImage || null,
            price: item.price,
            quantity: item.quantity,
            lineTotal: item.lineTotal,
          })),
        },
      },
    });

    return NextResponse.json({ success: true, orderId: order.id, orderNumber: order.orderNumber });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json({ success: false, error: "Failed to create order" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(100, parseInt(searchParams.get("limit") || "20"));

  try {
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        include: { items: true },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.order.count(),
    ]);
    return NextResponse.json({ orders, total, page, limit });
  } catch (error) {
    console.error("GET /api/orders error:", error);
    return NextResponse.json({ orders: [], total: 0, page, limit });
  }
}
