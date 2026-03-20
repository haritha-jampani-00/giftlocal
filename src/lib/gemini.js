/**
 * gemini.js
 *
 * Handles communication with the Google Gemini API.
 * Tries multiple models as fallback if one is rate-limited.
 *
 * Get a free API key at: https://aistudio.google.com/apikey
 */

const GEMINI_MODELS = [
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-2.0-flash-lite'
];

const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

/**
 * Get gift suggestions from Gemini — tries multiple models.
 */
export async function getGeminiSuggestions(apiKey, messages, systemPrompt) {
  const contents = messages.map(msg => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }]
  }));

  const body = JSON.stringify({
    system_instruction: { parts: [{ text: systemPrompt }] },
    contents,
    generationConfig: {
      temperature: 0.8,
      maxOutputTokens: 2000
    }
  });

  let lastError = null;

  for (const model of GEMINI_MODELS) {
    try {
      const url = `${GEMINI_BASE}/${model}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body
      });

      if (response.status === 429) {
        console.warn(`${model} rate limited, trying next model...`);
        lastError = new Error('Rate limit hit on all models.');
        continue;
      }

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        const msg = err?.error?.message || '';
        if (response.status === 403 || response.status === 400) {
          throw new Error(msg || 'Invalid API key or bad request.');
        }
        throw new Error(msg || `API error (${response.status}).`);
      }

      const data = await response.json();
      const rawText = extractText(data);
      if (!rawText) throw new Error('Empty response from AI.');
      const parsed = parseGiftJSON(rawText);
      return { rawText, parsed };
    } catch (err) {
      if (err.message.includes('Rate limit') || err.message.includes('rate limited')) {
        lastError = err;
        continue;
      }
      throw err;
    }
  }

  throw lastError || new Error('All models rate limited. Using local results.');
}

function extractText(data) {
  const parts = data?.candidates?.[0]?.content?.parts;
  if (!parts || !Array.isArray(parts)) return '';
  return parts.filter(p => p.text).map(p => p.text).join('');
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
