const { randomUUID } = require('node:crypto');
module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ ok: false }); }
  if (process.env.GPC_LEADS_ENABLED !== 'true' || !process.env.GPC_LEAD_WEBHOOK_URL) return res.status(503).json({ ok: false, reason: 'not_configured' });
  const expected = process.env.GPC_ALLOWED_ORIGIN;
  if (!expected || req.headers.origin !== expected) return res.status(403).json({ ok: false });
  if (!req.headers['content-type']?.includes('application/json')) return res.status(415).json({ ok: false });
  let data = req.body;
  if (typeof data === 'string') { try { data = JSON.parse(data); } catch (_) { return res.status(400).json({ ok: false }); } }
  if (!data || typeof data !== 'object' || Array.isArray(data) || Buffer.byteLength(JSON.stringify(data)) > 12000) return res.status(400).json({ ok: false });
  const text = (key, max = 200) => typeof data[key] === 'string' ? data[key].trim().slice(0, max) : '';
  const services = ['eventos', 'viandas', 'bar', 'padel'];
  if (text('website') || !text('name',100) || !/^[+0-9() .-]{8,30}$/.test(text('phone',31)) || !services.includes(data.service) || data.consent !== true) return res.status(400).json({ ok: false });
  if (text('email') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text('email'))) return res.status(400).json({ ok: false });
  const eventTypes = ['Cumpleaños', 'Corporativo', 'After office', 'Torneo privado', 'Reunión', 'Otro'];
  if (data.service === 'eventos' && ('eventType' in data || 'guests' in data) && (!eventTypes.includes(data.eventType) || !Number.isInteger(Number(data.guests)) || +data.guests < 1 || +data.guests > 10000 || !/^\d{4}-\d{2}-\d{2}$/.test(text('date')) || !/^\d{2}:\d{2}$/.test(text('time')) || !['Sí','No','Quiero asesoramiento'].includes(data.food))) return res.status(400).json({ ok: false });
  let destination;
  try { destination = new URL(process.env.GPC_LEAD_WEBHOOK_URL); if (destination.protocol !== 'https:') throw new Error(); } catch (_) { return res.status(503).json({ ok: false }); }
  const receiptId = randomUUID();
  const fields = ['name','phone','email','service','eventType','guests','date','time','food','padel','message','page'];
  const lead = Object.fromEntries(fields.map(key => [key, text(key,key === 'message' ? 2000 : 200)]));
  lead.attribution = {};
  for (const key of ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','gclid','gbraid','wbraid','fbclid']) if (typeof data.attribution?.[key] === 'string') lead.attribution[key] = data.attribution[key].slice(0,250);
  try {
    const response = await fetch(destination, { method: 'POST', redirect: 'error', headers: { 'Content-Type': 'application/json', ...(process.env.GPC_LEAD_WEBHOOK_SECRET ? { Authorization: `Bearer ${process.env.GPC_LEAD_WEBHOOK_SECRET}` } : {}) }, body: JSON.stringify({ receiptId, receivedAt: new Date().toISOString(), consent: true, ...lead }), signal: AbortSignal.timeout(8000) });
    if (!response.ok) throw new Error();
    return res.status(200).json({ ok: true, receiptId });
  } catch (_) { return res.status(502).json({ ok: false }); }
};
