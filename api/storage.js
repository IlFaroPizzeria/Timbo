import { kv } from '@vercel/kv';

// Endpoint único que hace de "base de datos" de la web.
// El frontend nunca habla directamente con Vercel KV: siempre pasa por aquí,
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
    if (action === 'get') {
      const stored = await kv.get(key);
      res.status(200).json({ value: stored ?? null });
      return;
    }

    if (action === 'set') {
      await kv.set(key, value);
      res.status(200).json({ ok: true });
      return;
    }

    res.status(400).json({ error: 'Acción desconocida' });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Error de almacenamiento' });
  }
}
