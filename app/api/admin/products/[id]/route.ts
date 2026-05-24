import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";

// PUT /api/admin/products/:id
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await req.json();

    // TODO: Prisma update
    // await prisma.product.update({
    //   where: { id },
    //   data: {
    //     title: body.title,
    //     ...etc
    //   },
    // });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

// DELETE /api/admin/products/:id
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  // TODO: Prisma delete
  // await prisma.product.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
