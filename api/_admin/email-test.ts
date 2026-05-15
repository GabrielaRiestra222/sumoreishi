import type { VercelRequest, VercelResponse } from '@vercel/node';
import { setCors, handlePreflight } from '../_lib/cors.js';
import { verifyAdminToken } from '../_lib/auth.js';
import { sendContactNotificationToAdmin } from '../../src/services/email.js';

function maskEmail(email: string): string {
  const [name, domain] = email.split('@');
  if (!name || !domain) return email;
  return `${name.slice(0, 2)}***@${domain}`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (handlePreflight(req, res)) return;

  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token || !verifyAdminToken(token)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const adminEmail = process.env.ADMIN_EMAIL ?? 'hola@sumoreishi.com';
  const status = {
    hasResendApiKey: Boolean(process.env.RESEND_API_KEY),
    adminEmail: maskEmail(adminEmail),
    resendFrom: process.env.RESEND_FROM ?? 'Sumo Reishi <onboarding@resend.dev>',
  };

  if (req.method === 'GET') {
    return res.status(200).json(status);
  }

  if (req.method === 'POST') {
    try {
      await sendContactNotificationToAdmin({
        name: 'Prueba admin',
        email: adminEmail,
        message: `Email de prueba enviado desde el panel admin (${new Date().toISOString()}).`,
      });
      return res.status(200).json({ ...status, sent: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown email error';
      console.error('[admin/email-test]', message);
      return res.status(500).json({ ...status, sent: false, error: message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
