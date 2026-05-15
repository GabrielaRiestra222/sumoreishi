import type { VercelRequest, VercelResponse } from '@vercel/node';
import { setCors } from './_lib/cors.js';
import { prisma } from './_lib/prisma.js';
import { sendContactNotificationToAdmin } from '../src/services/email.js';

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

    const emailResult = await sendContactNotificationToAdmin({
      name,
      email,
      message: safeMessage,
    }).then(
      () => ({ sent: true }),
      (error) => {
        console.error('Contact email error:', error);
        return { sent: false };
      }
    );

    return res.status(200).json({ success: true, emailSent: emailResult.sent });
  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({ error: 'Failed to send message' });
  }
}
