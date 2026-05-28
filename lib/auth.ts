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
  const devEmail    = process.env.ADMIN_EMAIL    || "admin@shilperhaat.com";
  const devPassword = process.env.ADMIN_PASSWORD || "admin123";

  /* ── Dev / fallback: check hardcoded env credentials first ── */
  let session: AdminSession | null = null;

  if (email === devEmail && password === devPassword) {
    session = { id: "dev-admin", name: "Admin", email: devEmail, role: "admin" };
  } else {
    /* ── Production: check database ── */
    try {
      const admin = await prisma.adminUser.findUnique({ where: { email } });
      if (admin && (await verifyPassword(password, admin.passwordHash))) {
        session = { id: admin.id, name: admin.name, email: admin.email, role: admin.role };
      }
    } catch (dbError) {
      console.error("DB login error (falling back to env credentials):", dbError);
    }
  }

  if (!session) {
    return { success: false, error: "Invalid credentials" };
  }

  const token = createToken(session);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return { success: true };
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
