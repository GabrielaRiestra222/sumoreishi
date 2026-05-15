import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../_lib/prisma.js';
import { verifyAdminToken } from '../_lib/auth.js';
import { setCors } from '../_lib/cors.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token || !verifyAdminToken(token)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // GET — lista de posts
  if (req.method === 'GET') {
    const { status } = req.query as { status?: string };
    const where = status ? { status } : {};
    const posts = await prisma.blogPost.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: { id: true, title: true, slug: true, category: true, status: true, publishedAt: true, createdAt: true, excerpt: true, imageUrl: true },
    });
    return res.status(200).json(posts);
  }

  // POST — crear post
  if (req.method === 'POST') {
    const { title, slug, content, excerpt, imageUrl, category, status } = req.body as {
      title: string; slug: string; content: string;
      excerpt?: string; imageUrl?: string; category?: string; status?: string;
    };

    if (!title || !slug || !content) {
      return res.status(400).json({ error: 'title, slug y content son obligatorios' });
    }

    const post = await prisma.blogPost.create({
      data: {
        title, slug, content,
        excerpt: excerpt ?? null,
        imageUrl: imageUrl ?? null,
        category: category ?? null,
        status: status ?? 'draft',
        publishedAt: status === 'published' ? new Date() : null,
      },
    });
    return res.status(201).json(post);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
