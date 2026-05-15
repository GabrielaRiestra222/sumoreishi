import type { VercelRequest, VercelResponse } from "@vercel/node";
import { signAdminToken } from "../_lib/auth";
import { setCors, handlePreflight } from "../_lib/cors";

export default function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (handlePreflight(req, res)) return;

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { password } = req.body as { password?: string };

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Contraseña incorrecta" });
  }

  const token = signAdminToken();
  return res.status(200).json({ token });
}
