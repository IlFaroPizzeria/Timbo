# La Timba

App de apuestas privadas para el grupo. Hecha con React + Vite, desplegable en Vercel,
con Vercel KV como base de datos compartida.

## Desarrollo local

```bash
npm install
npm run dev
```

Nota: en local, sin variables de entorno de Vercel KV, la app carga pero no
podrá guardar datos (las llamadas a `/api/storage` fallarán). Para probar el
guardado en local, usa `vercel dev` con el proyecto ya enlazado (ver abajo).

## Desplegar en Vercel

1. Sube este proyecto a un repositorio de GitHub.
2. Entra en [vercel.com](https://vercel.com) → **Add New → Project** → importa el repo.
3. Despliega (los valores por defecto de Vite están bien).
4. En el proyecto ya creado: **Storage → Create Database → KV** (o Upstash Redis).
   Conéctala al proyecto — Vercel añade solas las variables de entorno que
   necesita `@vercel/kv`.
5. Vuelve a desplegar (Vercel suele redeployar solo al conectar la base de datos;
   si no, hazlo a mano desde **Deployments → Redeploy**).
6. Abre la URL que te da Vercel. Cuenta de organizador de prueba:
   revisa `CONFIG.seedAdmin` en `src/App.jsx`.

## Estructura

- `src/App.jsx` — toda la aplicación (React).
- `api/storage.js` — función serverless que lee/escribe en Vercel KV.
- `src/main.jsx` — punto de entrada de React.
