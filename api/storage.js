import { createClient } from 'redis';

// Reutilizamos la conexión entre invocaciones "calientes" de la función
// serverless en vez de abrir una conexión nueva en cada petición.
let clientPromise;
function getClient() {
  if (!clientPromise) {
    const client = createClient({ url: process.env.REDIS_URL });
    client.on('error', (err) => console.error('Redis error', err));
    clientPromise = client.connect().then(() => client);
  }
  return clientPromise;
}

// Endpoint único que hace de "base de datos" de la web.
// El frontend nunca habla directamente con Redis: siempre pasa por aquí,
// así las credenciales de la base de datos se quedan en el servidor.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método no permitido' });
    return;
  }

  const { action, key, value } = req.body || {};

  if (!key || typeof key !== 'string') {
    res.status(400).json({ error: 'Falta la clave (key)' });
    return;
  }

  try {
    const redis = await getClient();

    if (action === 'get') {
      const raw = await redis.get(key);
      res.status(200).json({ value: raw ? JSON.parse(raw) : null });
      return;
    }

    if (action === 'set') {
      await redis.set(key, JSON.stringify(value));
      res.status(200).json({ ok: true });
      return;
    }

    res.status(400).json({ error: 'Acción desconocida' });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Error de almacenamiento' });
  }
}