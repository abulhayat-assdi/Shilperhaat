import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const jwt = require("jsonwebtoken");
import { prisma } from "./prisma";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "fallback-secret-change-me";
const COOKIE_NAME = "sh_admin_token";

export interface AdminSession {
  id: string;
  name: string;
  email: string;
  role: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function createToken(payload: AdminSession): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): AdminSession | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AdminSession;
  } catch {
    return null;
  }
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function requireAdminSession(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }
  return session;
}

export async function adminLogin(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const admin = await prisma.adminUser.findUnique({ where: { email } });
    if (!admin) {
      return { success: false, error: "Invalid credentials" };
    }

    const valid = await verifyPassword(password, admin.passwordHash);
    if (!valid) {
      return { success: false, error: "Invalid credentials" };
    }

    const session: AdminSession = {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    };

    const token = createToken(session);
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return { success: true };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "Something went wrong" };
  }
}

export async function adminLogout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function seedAdminUser(): Promise<void> {
  const email = process.env.ADMIN_EMAIL || "admin@shilperhaat.com";
  const password = process.env.ADMIN_PASSWORD || "admin123";

  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (!existing) {
    const passwordHash = await hashPassword(password);
    await prisma.adminUser.create({
      data: {
        name: "Admin",
        email,
        passwordHash,
        role: "admin",
      },
    });
    console.log("Admin user seeded successfully");
  }
}
