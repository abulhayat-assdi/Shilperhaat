import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

const ALLOWED_KEYS = ["site-layout", "contact-widget"];

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { key } = await params;
  if (!ALLOWED_KEYS.includes(key)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  try {
    const body = await req.json();
    if (body.value === undefined || body.value === null) {
      return NextResponse.json({ error: "value is required" }, { status: 400 });
    }
    const value = body.value as Prisma.InputJsonValue;
    const row = await prisma.siteContent.upsert({
      where: { key },
      create: { key, value },
      update: { value },
    });
    return NextResponse.json({ value: row.value });
  } catch (error) {
    console.error("PUT /api/admin/site-content/[key] error:", error);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { key } = await params;
  if (!ALLOWED_KEYS.includes(key)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  try {
    await prisma.siteContent.deleteMany({ where: { key } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/admin/site-content/[key] error:", error);
    return NextResponse.json({ error: "Failed to reset" }, { status: 500 });
  }
}
