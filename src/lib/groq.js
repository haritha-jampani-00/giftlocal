/**
 * groq.js
 *
 * Handles communication with the Groq API.
 * On Vercel: uses /api/suggest proxy (key hidden server-side).
 * Locally: uses direct Groq API with key from config.
 */

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

function isDeployed() {
  return location.hostname !== 'localhost' && location.hostname !== '127.0.0.1' && location.protocol !== 'file:';
}

/**
 * Get gift suggestions from Groq.
 */
export async function getGroqSuggestions(apiKey, messages, systemPrompt) {
  if (isDeployed()) {
    return fetchViaProxy(messages, systemPrompt);
  }
  return fetchDirect(apiKey, messages, systemPrompt);
}

async function fetchViaProxy(messages, systemPrompt) {
  const response = await fetch('/api/suggest', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, systemPrompt })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error || `API error (${response.status}).`);
  }

  const data = await response.json();
  const rawText = data?.choices?.[0]?.message?.content || '';
  if (!rawText) throw new Error('Empty response from AI.');
  const parsed = parseGiftJSON(rawText);
  return { rawText, parsed };
}

async function fetchDirect(apiKey, messages, systemPrompt) {
  const response = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
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
    const msg = err?.error?.message || '';
    if (response.status === 401) throw new Error('Invalid Groq API key.');
    if (response.status === 429) throw new Error('Rate limit hit. Wait a moment and try again.');
    throw new Error(msg || `API error (${response.status}).`);
  }

  const data = await response.json();
  const rawText = data?.choices?.[0]?.message?.content || '';
  if (!rawText) throw new Error('Empty response from AI.');
  const parsed = parseGiftJSON(rawText);
  return { rawText, parsed };
}

function parseGiftJSON(text) {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Could not parse suggestions.');
  try {
    return JSON.parse(jsonMatch[0]);
  } catch {
    throw new Error('Malformed response.');
  }
}
