import jwt from "jsonwebtoken";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const JWT_SECRET = process.env.ADMIN_JWT_SECRET!;

export interface AdminTokenPayload {
  role: "admin";
  iat: number;
  exp: number;
}

export function signAdminToken(): string {
  return jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: "24h" });
}

export function verifyAdminToken(token: string): AdminTokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AdminTokenPayload;
  } catch {
    return null;
  }
}

export function requireAdmin(
  req: VercelRequest,
  res: VercelResponse
): boolean {
  const auth = req.headers.authorization ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;

  if (!token || !verifyAdminToken(token)) {
    res.status(401).json({ error: "No autorizado" });
    return false;
  }
  return true;
}
