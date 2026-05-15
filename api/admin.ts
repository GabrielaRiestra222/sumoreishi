import type { VercelRequest, VercelResponse } from '@vercel/node';
import { setCors, handlePreflight } from './_lib/cors.js';
import { verifyAdminToken } from './_lib/auth.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (handlePreflight(req, res)) return;

  const token = (req.headers.authorization ?? '').replace('Bearer ', '');
  const requestUrl = new URL(req.url ?? '/api/admin', `https://${req.headers.host ?? 'localhost'}`);
  const path = requestUrl.pathname.replace(/^\/api\/admin/, '') || '/';
  const isLoginRequest = path === '/login';
  const setRouteId = (id: string | undefined) => {
    if (id) {
      (req.query as Record<string, string>).id = decodeURIComponent(id);
    }
  };

  if (!isLoginRequest && !verifyAdminToken(token)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Login
  if (isLoginRequest) {
    const { default: h } = await import('./_admin/login.js');
    return h(req, res);
  }

  // Orders list
  if (path === '/orders' || path === '/orders/') {
    const { default: h } = await import('./_admin/orders.js');
    return h(req, res);
  }

  // Order detail /orders/:id
  if (path.match(/^\/orders\/[^/]+\/email$/)) {
    setRouteId(path.split('/')[2]);
    const { default: h } = await import('./_admin/orders/email.js');
    return h(req, res);
  }

  // Order detail /orders/:id
  if (path.match(/^\/orders\/[^/]+$/)) {
    setRouteId(path.split('/')[2]);
    const { default: h } = await import('./_admin/orders/[id].js');
    return h(req, res);
  }

  // Export CSV
  if (path === '/export' || path === '/export/') {
    const { default: h } = await import('./_admin/export.js');
    return h(req, res);
  }

  // Contacts
  if (path === '/contacts' || path === '/contacts/') {
    const { default: h } = await import('./_admin/contacts.js');
    return h(req, res);
  }

  // Blog list/create/update/delete
  if (path === '/blog' || path === '/blog/') {
    const { default: h } = await import('./_admin/blog.js');
    return h(req, res);
  }

  // Blog post detail /blog/:id
  if (path.match(/^\/blog\/[^/]+$/)) {
    setRouteId(path.split('/')[2]);
    const { default: h } = await import('./_admin/blog/[id].js');
    return h(req, res);
  }

  // Products
  if (path === '/products' || path === '/products/') {
    const { default: h } = await import('./_admin/products.js');
    return h(req, res);
  }

  // Shipping rates
  if (path === '/shipping-rates' || path === '/shipping-rates/') {
    const { default: h } = await import('./_admin/shipping-rates.js');
    return h(req, res);
  }

  // Email diagnostics / test
  if (path === '/email-test' || path === '/email-test/') {
    const { default: h } = await import('./_admin/email-test.js');
    return h(req, res);
  }

  return res.status(404).json({ error: 'Admin endpoint not found' });
}
