# TriApp Backend (Español)

## 🚀 [Ver Proyecto en Vivo](https://tri-app-frontend.vercel.app/music)

**Proyecto Full-Stack**
Frontend: https://github.com/Tiggreee/TriApp-Frontend
Backend: https://github.com/Tiggreee/Triapp-Backend

---

API backend para la app Renata's Finder. Proporciona autenticación, gestión de usuarios y favoritos.

**Backend en Render:** https://triapp-backend.onrender.com

## Funcionalidades

- Autenticación JWT (registro/inicio de sesión)
- Gestión de perfil de usuario
- CRUD de favoritos (música, colores, avatares)
- Registro de solicitudes y errores
- Seguridad: rate limiting, headers seguros
- MongoDB + Mongoose

## Tecnologías

- Node.js + Express
- MongoDB (Mongoose)
- JWT para autenticación
- bcryptjs para contraseñas
- winston para logs
- celebrate (Joi) para validación
- helmet, cors, express-rate-limit para seguridad

## Estructura del Proyecto

```
app.js
models/
routes/
controllers/
middleware/
utils/
.env.example
.gitignore
.editorconfig
.eslintrc.json
package.json
```

## Instalación Rápida

1. Node.js 16+ y MongoDB
2. Clona el repo y entra a la carpeta
3. Instala dependencias:
   ```bash
   npm install
   ```
4. Copia .env.example a .env y edítalo con tus datos
5. Ejecuta en desarrollo:
   ```bash
   npm run dev
   ```

## Endpoints Principales

- POST /signup — Crear usuario
- POST /signin — Iniciar sesión (devuelve JWT)
- GET /users/me — Info usuario (requiere token)
- GET /favorites — Favoritos del usuario (token)
- POST /favorites — Crear favorito (token)
- DELETE /favorites/:id — Eliminar favorito (token)

## Variables de Entorno

- NODE_ENV=production
- PORT=3000
- MONGODB_URI=tu_uri_mongodb
- JWT_SECRET=tu_clave_secreta

## Producción

- API: https://triapp-backend.onrender.com
- Base de datos: MongoDB Atlas
- Hosting: Render.com

## Notas

- El backend puede dormir tras 15 min de inactividad (Render free)
- Todos los datos sensibles van en variables de entorno

## Hotfix Frontend

En Vercel, agrega la variable:

VITE_API_BASE_URL=https://triapp-backend.onrender.com

No la marques como Sensitive. Redeploya para que funcione login y favoritos.

---

Desarrollado por Victor para TripleTen Web Development Final Project.
