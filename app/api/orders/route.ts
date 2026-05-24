import { NextRequest, NextResponse } from "next/server";

// POST /api/orders — create a new order
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // TODO: Replace with Prisma once DB is connected
    // const order = await prisma.order.create({
    //   data: {
    //     orderNumber: body.orderNumber,
    //     customerName: body.customerName,
    //     phone: body.phone,
    //     address: body.address,
    //     notes: body.notes,
    //     subtotal: body.subtotal,
    //     deliveryCharge: body.deliveryCharge,
    //     total: body.total,
    //     paymentMethod: body.paymentMethod,
    //     status: 'PENDING',
    //     items: {
    //       create: body.items.map((item: any) => ({
    //         productId: item.productId,
    //         productTitle: item.productTitle,
    //         productImage: item.productImage,
    //         price: item.price,
    //         quantity: item.quantity,
    //         lineTotal: item.lineTotal,
    //       })),
    //     },
    //   },
    // });
    // return NextResponse.json({ success: true, orderId: order.id });

    // Simulate successful order creation
    console.log("New order received:", body.orderNumber, body.customerName);

    return NextResponse.json({
      success: true,
      orderId: "demo-" + Date.now(),
      orderNumber: body.orderNumber,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create order" },
      { status: 500 }
    );
  }
}

// GET /api/orders — list orders (admin)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  // TODO: Replace with Prisma query + auth check
  return NextResponse.json({ orders: [], total: 0, page, limit });
}
