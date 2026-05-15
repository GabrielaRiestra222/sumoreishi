import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../../_lib/prisma.js';
import { verifyAdminToken } from '../../_lib/auth.js';
import { setCors } from '../../_lib/cors.js';

function getRouteId(req: VercelRequest): string {
  const queryId = req.query.id;
  if (typeof queryId === 'string' && queryId) return queryId;
  if (Array.isArray(queryId) && queryId[0]) return queryId[0];

  const requestUrl = new URL(req.url ?? '/api/admin/blog', `https://${req.headers.host ?? 'localhost'}`);
  const path = requestUrl.pathname.replace(/^\/api\/admin/, '');
  const idFromPath = path.match(/^\/blog\/([^/]+)$/)?.[1];
  return idFromPath ? decodeURIComponent(idFromPath) : '';
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token || !verifyAdminToken(token)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const id = getRouteId(req);
  if (!id) return res.status(400).json({ error: 'Post id requerido' });

  // GET
  if (req.method === 'GET') {
    const post = await prisma.blogPost.findUnique({ where: { id } });
    if (!post) return res.status(404).json({ error: 'Post not found' });
    return res.status(200).json(post);
  }

  // PATCH — editar
  if (req.method === 'PATCH') {
    const { title, slug, content, excerpt, imageUrl, category, status } = req.body as {
      title?: string; slug?: string; content?: string;
      excerpt?: string; imageUrl?: string; category?: string; status?: string;
    };

    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(slug && { slug }),
        ...(content && { content }),
        ...(excerpt !== undefined && { excerpt }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(category !== undefined && { category }),
        ...(status && {
          status,
          publishedAt: status === 'published' ? new Date() : null,
        }),
      },
    });
    return res.status(200).json(post);
  }

  // DELETE
  if (req.method === 'DELETE') {
    await prisma.blogPost.delete({ where: { id } });
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
