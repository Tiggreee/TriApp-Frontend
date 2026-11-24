# TriApp Backend (Español)

API para Renata's Finder / Renatown. Vive en este monorepo junto con el frontend (`web/`).

- App en vivo: https://tri-app-frontend.vercel.app/
- API en Render: https://triapp-backend.onrender.com

## Funcionalidades

- Registro e inicio de sesión con JWT (ambos devuelven `token`, `name`, `email`, `premium`)
- Perfil del usuario (`GET /users/me`)
- Favoritos por usuario: música, colores, avatares, maquillaje, consejos y juegos
- Premium con Stripe Checkout (`POST /billing/checkout`) confirmado por webhook firmado (`POST /billing/webhook`)
- Seguridad: Helmet, CORS configurable, límite de peticiones, validación con Zod, límite de tamaño del body

## Tecnologías

Node 22, Express 5, TypeScript, MongoDB (Mongoose 9), Zod, bcryptjs, jsonwebtoken, pino, Stripe.

## Variables de entorno

Ver `.env.example`. En producción `JWT_SECRET` es obligatorio; Stripe es opcional y, sin configurar, los endpoints de pago responden `503`.

## Comandos

```bash
pnpm --filter @triapp/server dev     # desarrollo con recarga
pnpm --filter @triapp/server test    # pruebas (usa MongoDB en memoria)
pnpm --filter @triapp/server build   # compila a dist/
```

## Endpoints

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/signup` | no | Crear cuenta |
| POST | `/signin` | no | Iniciar sesión |
| GET | `/users/me` | sí | Perfil |
| GET/POST | `/favorites` | sí | Listar / crear favoritos |
| DELETE | `/favorites/:id` | sí | Borrar un favorito propio |
| POST | `/billing/checkout` | sí | Crear sesión de pago |
| POST | `/billing/webhook` | firma Stripe | Activar Premium |
| GET | `/health` | no | Estado del servicio |
