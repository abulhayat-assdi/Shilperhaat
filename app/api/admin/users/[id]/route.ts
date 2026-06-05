import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PUT /api/admin/users/[id] — update role and/or page access
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session || session.role !== "super_admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  // Prevent super admin from demoting themselves
  if (id === session.id) {
    return NextResponse.json({ error: "You cannot modify your own account" }, { status: 400 });
  }

  try {
    const { role, pageAccess } = await req.json();
    const adminRole = role === "super_admin" ? "super_admin" : "admin";

    // Delete existing page access and recreate
    await prisma.adminPageAccess.deleteMany({ where: { adminId: id } });

    const user = await prisma.adminUser.update({
      where: { id },
      data: {
        role: adminRole,
        ...(adminRole === "admin" && Array.isArray(pageAccess)
          ? {
              pageAccess: {
                create: pageAccess.map((key: string) => ({ pageKey: key })),
              },
            }
          : {}),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        pageAccess: { select: { pageKey: true } },
      },
    });

    return NextResponse.json({
      user: { ...user, pageAccess: user.pageAccess.map((p: { pageKey: string }) => p.pageKey) },
    });
  } catch (error) {
    console.error("PUT /api/admin/users/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/admin/users/[id] — delete an admin
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session || session.role !== "super_admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  if (id === session.id) {
    return NextResponse.json({ error: "You cannot delete your own account" }, { status: 400 });
  }

  try {
    await prisma.adminUser.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/admin/users/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
