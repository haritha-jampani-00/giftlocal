/**
 * Vercel Serverless Function — /api/suggest
 *
 * Proxies gift suggestion requests to Groq API.
 * Includes rate limiting and basic bot protection.
 */

// Simple in-memory rate limiter (resets on cold start, ~5min)
const ipRequests = new Map();
const RATE_LIMIT = 10;       // max requests per IP
const RATE_WINDOW = 60_000;  // per 1 minute

function isRateLimited(ip) {
  const now = Date.now();
  const record = ipRequests.get(ip);

  if (!record || now - record.start > RATE_WINDOW) {
    ipRequests.set(ip, { start: now, count: 1 });
    return false;
  }

  record.count++;
  if (record.count > RATE_LIMIT) return true;
  return false;
}

export default async function handler(req, res) {
  // CORS — only allow your own domain
  const allowedOrigins = [
    'https://giftlocal.vercel.app',
    'http://localhost:3001',
    'http://localhost:3000'
  ];
  const origin = req.headers.origin || '';
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rate limit by IP
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 'unknown';
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Too many requests. Please wait a minute.' });
  }

  // Block empty or suspicious requests
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const { messages, systemPrompt } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    // Reject if message content is too long (prevent abuse)
    const totalLength = messages.reduce((sum, m) => sum + (m.content?.length || 0), 0);
    if (totalLength > 5000) {
      return res.status(400).json({ error: 'Request too large' });
    }

    // Reject if system prompt is tampered (not ours)
    if (!systemPrompt || !systemPrompt.includes('GiftLocal')) {
      return res.status(400).json({ error: 'Invalid request' });
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        max_tokens: 2000,
        temperature: 0.8
      })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return res.status(response.status).json({
        error: err?.error?.message || `API error (${response.status})`
      });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
