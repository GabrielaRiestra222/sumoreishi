# SumoReishi — Guía de activación en producción

## Arquitectura

```
Frontend React/Vite  →  desplegado en Vercel (static)
API serverless       →  desplegado en Vercel (api/*.ts)
Base de datos        →  PostgreSQL (Neon, Supabase, Railway o Render)
Pagos                →  Stripe Checkout hosted
Emails               →  Resend (opcional, se activa con RESEND_API_KEY)
```

---

## 1. Variables de entorno

Añadir en Vercel → Settings → Environment Variables:

| Variable | Descripción | Requerida |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | Sí |
| `STRIPE_SECRET_KEY` | Clave secreta de Stripe (sk_live_...) | Sí |
| `STRIPE_WEBHOOK_SECRET` | Secret del webhook de Stripe (whsec_...) | Sí |
| `ADMIN_PASSWORD` | Contraseña del panel /admin | Sí |
| `ADMIN_JWT_SECRET` | String aleatorio ≥32 chars para firmar tokens | Sí |
| `ADMIN_EMAIL` | Emails que reciben notificaciones internas, separados por comas | Sí |
| `RESEND_API_KEY` | API key de Resend (re_...) | No* |
| `RESEND_FROM` | Remitente verificado, ej. `Sumo Reishi <pedidos@sumoreishi.com>` | Sí para enviar a clientes |
| `SITE_URL` | URL pública del sitio, ej. `https://sumoreishi.com` | Recomendado |
| `EMAIL_HERO_IMAGE_URL` | Imagen hero para las plantillas HTML de email | No |

*Sin RESEND_API_KEY los emails se omiten sin error. La tienda funciona igualmente.

Generar ADMIN_JWT_SECRET:
```bash
openssl rand -base64 32
```

---

## 2. Base de datos PostgreSQL

### Opciones recomendadas (plan gratuito disponible)
- **Neon** — neon.tech (integración nativa con Vercel)
- **Supabase** — supabase.com
- **Railway** — railway.app
- **Render** — render.com

### Migraciones

Primera vez (crear tablas):
```bash
DATABASE_URL="postgresql://..." npx prisma migrate deploy
```

En local con `.env`:
```bash
npx prisma migrate dev --name init
```

Ver datos en interfaz visual:
```bash
npm run db:studio
```

### Seed inicial de productos

Ejecutar una vez para poblar la tabla Product:
```sql
INSERT INTO "Product" (id, slug, name, format, "priceEurCents", active, "createdAt")
VALUES
  (gen_random_uuid(), '1-unit',  'Sumo Reishi Original',            '1 ud · 60 cápsulas',  3200, true, NOW()),
  (gen_random_uuid(), '3-pack',  'Sumo Reishi — Opción más elegida', '3 unidades · 180 cápsulas', 8200, true, NOW()),
  (gen_random_uuid(), '10-pack', 'Sumo Reishi Combo Vita',           '10 + 1 unidades',    27200, true, NOW());
```

O en Prisma Studio: http://localhost:5555 tras ejecutar `npm run db:studio`.

---

## 3. Stripe

### Activar modo live

1. Crear cuenta en stripe.com
2. Activar negocio (datos empresa/autónoma + cuenta bancaria)
3. En el Dashboard → Developers → API keys:
   - Copiar `sk_live_...` → `STRIPE_SECRET_KEY`
   - Copiar `pk_live_...` (no se usa en este proyecto, Stripe Checkout es server-side)

### Configurar webhook live

1. Stripe Dashboard → Developers → Webhooks → Add endpoint
2. URL: `https://sumoreishi.com/api/webhook`
3. Eventos a escuchar:
   - `checkout.session.completed`
   - `payment_intent.payment_failed`
   - `charge.refunded`
4. Copiar el Signing secret (`whsec_...`) → `STRIPE_WEBHOOK_SECRET`

### Apple Pay

1. En Stripe Dashboard → Settings → Payment methods → Apple Pay
2. Añadir dominio: `sumoreishi.com`
3. Stripe te pedirá verificar el dominio (archivo `.well-known/apple-developer-merchantid-domain-association`)
4. En Vercel, añadir el archivo en `public/.well-known/` (Stripe te da el contenido)
5. Apple Pay aparece automáticamente en Stripe Checkout si el navegador/dispositivo lo soporta

---

## 4. Panel de administración

URL: `https://sumoreishi.com/admin`

- Login con `ADMIN_PASSWORD`
- Token JWT en sessionStorage (expira en 24h, no persiste al cerrar el navegador)
- Rutas:
  - `/admin/login` — login
  - `/admin/orders` — listado de pedidos con filtros y paginación
  - `/admin/orders/:id` — detalle del pedido

### Gestión manual de envíos

En el detalle de cada pedido puedes:
- Cambiar el estado: `PENDING → PAID → PREPARING → SHIPPED → DELIVERED`
- Añadir transportista (Correos, MRW, GLS, SEUR…)
- Añadir número de tracking (se envía email al cliente automáticamente si Resend está configurado)
- Añadir notas internas

### Exportar pedidos a CSV

Botón "Exportar CSV" en `/admin/orders`. Incluye:
ID, fecha, estado, email, nombre, productos, total, dirección completa, transportista, tracking, estado envío, notas internas.

Compatible con Excel (incluye BOM UTF-8).

---

## 5. Emails (Resend)

1. Crear cuenta en resend.com
2. Verificar dominio: `sumoreishi.com`
3. Crear API key → copiar a `RESEND_API_KEY`
4. Configura `RESEND_FROM=Sumo Reishi <pedidos@sumoreishi.com>` o el remitente verificado que prefieras.
5. Configura `ADMIN_EMAIL=gabriela.riestra.lucas@gmail.com,tsmeragdina@gmail.com` para que las notificaciones internas lleguen a ambas cuentas.

Importante: si usas `onboarding@resend.dev`, Resend solo permite enviar al email de prueba de la cuenta. Para enviar a clientes y a varias direcciones internas hay que verificar `sumoreishi.com` en Resend y usar un remitente del dominio.

Emails implementados:
- **Confirmación al cliente** — tras `checkout.session.completed`
- **Notificación interna** — mismo evento, al `ADMIN_EMAIL`
- **Tracking** — cuando se añade `trackingNumber` en el panel
- **Cancelación/reembolso** — stub preparado, llamar `sendOrderCancelledToCustomer()`
- **Plantilla corporativa HTML** — cabecera Sumo Reishi, imagen hero pública (`/email-hero.png`), tipografía limpia y colores corporativos.

---

## 6. Integración futura de proveedor de envíos

El modelo `Shipment` incluye campos preparados para integración externa:
- `externalShipmentId` — ID del envío en el proveedor
- `externalProvider` — `"sendcloud"` | `"packlink"` | `"correos"`
- `externalData` — respuesta JSON cruda del proveedor

Para integrar (ejemplo con Sendcloud):
1. Crear cuenta comercial en sendcloud.es
2. Obtener credenciales API
3. Crear `api/admin/ship.ts` que llame a la API de Sendcloud con los datos del pedido
4. Guardar respuesta en `Shipment.externalData`

---

## 7. Despliegue en Vercel

```bash
# Conectar repositorio
vercel link

# Desplegar
vercel --prod
```

Variables de entorno: añadir en Vercel Dashboard antes del primer deploy de producción.

Migraciones de base de datos: ejecutar `prisma migrate deploy` antes o después del deploy:
```bash
DATABASE_URL="..." npx prisma migrate deploy
```

---

## 8. Migración del frontend a Dinahosting (si el backend se separa)

Si en el futuro quieres alojar el frontend estático en Dinahosting y el backend (API) en otro servidor:

### Frontend en Dinahosting
1. `npm run build` → genera `dist/`
2. Subir contenido de `dist/` por FTP a `public_html/`
3. Crear `.htaccess` en `public_html/`:
```apache
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]
```

### Backend separado
- Las funciones `api/*.ts` necesitan un servidor Node.js (Railway, Render, Fly.io)
- Actualizar las URLs en el frontend: en `CartDrawer.tsx` cambiar `/api/checkout` por `https://api.sumoreishi.com/checkout`
- Configurar CORS en `api/_lib/cors.ts` para permitir el origen del frontend

### Stripe webhook con backend separado
- Actualizar la URL del webhook en Stripe Dashboard a la nueva URL del backend

---

## 9. Checklist de activación

- [ ] Cuenta Stripe verificada con cuenta bancaria
- [ ] `STRIPE_SECRET_KEY` (live) en Vercel
- [ ] Webhook configurado en Stripe Dashboard
- [ ] `STRIPE_WEBHOOK_SECRET` en Vercel
- [ ] PostgreSQL creado y `DATABASE_URL` en Vercel
- [ ] `prisma migrate deploy` ejecutado
- [ ] Productos insertados en la tabla `Product`
- [ ] `ADMIN_PASSWORD` y `ADMIN_JWT_SECRET` en Vercel
- [ ] `ADMIN_EMAIL` en Vercel
- [ ] Dominio en HTTPS (Vercel lo gestiona automáticamente)
- [ ] Apple Pay: archivo de verificación de dominio en `public/.well-known/`
- [ ] (Opcional) `RESEND_API_KEY` y dominio verificado en Resend
- [ ] Test de compra en modo live con tarjeta real (importe mínimo)
- [ ] Verificar que el pedido aparece en `/admin/orders`
- [ ] Verificar que llega el email de confirmación
