import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// El proxy redirige /wp-json/* al servidor de WordPress en desarrollo.
// Esto evita errores CORS en local: el navegador ve una petición same-origin
// y Vite la reenvía a sumoreishi.com de forma transparente.
// En producción no es necesario porque React y WordPress comparten dominio.
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ["078eeafe260678.lhr.life", ".lhr.life"],
    proxy: {
      "/wp-json": {
        target: "https://sumoreishi.com",
        changeOrigin: true,
        secure: true,
      },
    },
  },
})