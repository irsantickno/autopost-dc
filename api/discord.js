export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Discord-Token');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const rawPath = req.query.path;
  if (!rawPath) return res.status(400).json({ error: 'Missing path' });
  const path = Array.isArray(rawPath) ? rawPath.join('/') : rawPath;

  const token = req.headers['x-discord-token'];
  if (!token) return res.status(400).json({ error: 'Missing token' });

  try {
    const discordRes = await fetch(`https://discord.com/api/v9/${path}`, {
      method: req.method,
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      body: req.method === 'POST' || req.method === 'PATCH' ? JSON.stringify(req.body) : undefined,
    });

    const data = await discordRes.json();
    res.status(discordRes.status).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
