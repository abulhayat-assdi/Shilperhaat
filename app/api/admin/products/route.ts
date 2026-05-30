import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";

// GET /api/admin/products
export async function GET(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // TODO: Replace with Prisma query
  // const products = await prisma.product.findMany({
  //   include: { category: true, images: { orderBy: { sortOrder: 'asc' } } },
  //   orderBy: { createdAt: 'desc' },
  // });

  return NextResponse.json({ products: [] });
}

// POST /api/admin/products
export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    // TODO: Replace with Prisma create
    // const product = await prisma.product.create({
    //   data: {
    //     title: body.title,
    //     slug: body.slug,
    //     description: body.description,
    //     price: body.price,
    //     compareAtPrice: body.compareAtPrice,
    //     stock: body.stock,
    //     categoryId: body.categoryId || null,
    //     isFeatured: body.isFeatured,
    //     isBestSelling: body.isBestSelling,
    //     status: body.status,
    //     tags: body.tags || [],
    //     images: {
    //       create: (body.images || []).map((url: string, i: number) => ({
    //         imageUrl: url,
    //         sortOrder: i,
    //       })),
    //     },
    //   },
    // });
    // return NextResponse.json({ success: true, product });

    return NextResponse.json({ success: true, productId: "new-" + Date.now() });
  } catch (error) {
    console.error("Product create error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
