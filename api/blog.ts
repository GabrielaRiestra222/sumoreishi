import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from './_lib/prisma.js';
import { setCors, handlePreflight } from './_lib/cors.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (handlePreflight(req, res)) return;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const requestUrl = new URL(req.url ?? '/api/blog', `https://${req.headers.host ?? 'localhost'}`);
  const path = requestUrl.pathname.replace(/^\/api\/blog/, '') || '/';

  // Lista de posts: /api/blog/posts
  if (path === '/posts' || path === '/posts/') {
    const posts = await prisma.blogPost.findMany({
      where: { status: 'published' },
      orderBy: { publishedAt: 'desc' },
      select: {
        id: true, title: true, slug: true, excerpt: true,
        category: true, imageUrl: true, publishedAt: true,
      },
    });
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
    return res.status(200).json(posts);
  }

  // Post individual: /api/blog/:slug
  const slug = path.replace(/^\//, '').replace(/\/$/, '');
  if (slug && slug !== 'posts') {
    const post = await prisma.blogPost.findFirst({
      where: { slug, status: 'published' },
    });
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
    return res.status(200).json(post);
  }

  return res.status(404).json({ error: 'Not found' });
}
