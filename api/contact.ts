import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';
import { setCors } from './_lib/cors.js';
import { prisma } from './_lib/prisma.js';

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'gabriela.riestra.lucas@gmail.com';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, email, message } = req.body as { name?: string; email?: string; message?: string };

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const safeMessage = message?.trim() || '(sin mensaje)';

  try {
    await prisma.contact.create({ data: { name, email, message: safeMessage } });

    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: 'Sumo Reishi <onboarding@resend.dev>',
        to: ADMIN_EMAIL,
        subject: `Nuevo mensaje de contacto de ${name}`,
        html: `
          <h2>Nuevo mensaje de contacto</h2>
          <p><strong>Nombre:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Mensaje:</strong></p>
          <p>${safeMessage.replace(/\n/g, '<br>')}</p>
        `
      });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({ error: 'Failed to send message' });
  }
}
