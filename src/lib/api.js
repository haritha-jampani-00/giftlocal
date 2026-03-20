/**
 * api.js
 *
 * Handles all communication with the Anthropic API.
 * Web search is enabled by default — Claude uses it to find
 * real local experiences and current information.
 *
 * To use a backend proxy instead of direct browser access:
 * Change API_ENDPOINT to your proxy URL (e.g. '/api/gift')
 * and remove the 'anthropic-dangerous-direct-browser-access' header.
 */

const ANTHROPIC_API = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-haiku-4-5-20251001';
const MAX_TOKENS = 2000;

/**
 * Get gift suggestions from Claude.
 *
 * @param {string} apiKey - Anthropic API key
 * @param {Array}  messages - conversation history [{role, content}]
 * @param {string} systemPrompt - the system prompt
 * @returns {Promise<{rawText: string, parsed: object}>}
 */
export async function getGiftSuggestions(apiKey, messages, systemPrompt) {
  const response = await fetch(ANTHROPIC_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: systemPrompt,
      tools: [
        {
          // Web search: lets Claude find real local experiences + current info
          // Cost: $10 per 1000 searches — at low volume, nearly free
          type: 'web_search_20250305',
          name: 'web_search'
        }
      ],
      messages
    })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    const msg = err?.error?.message || '';

    // Friendly error messages for common cases
    if (response.status === 401) throw new Error('Invalid API key. Check your key at platform.anthropic.com');
    if (response.status === 429) throw new Error('Rate limit hit. Wait a moment and try again.');
    if (response.status === 402) throw new Error('API credits exhausted. Top up at platform.anthropic.com');
    throw new Error(msg || `API error (${response.status}). Please try again.`);
  }

  const data = await response.json();

  // Extract text — response may include tool_use blocks (web search) + text
  const rawText = extractText(data.content || []);
  if (!rawText) throw new Error('Empty response from AI. Please try again.');

  // Parse the JSON gift data
  const parsed = parseGiftJSON(rawText);

  return { rawText, parsed };
}

/**
 * Extract text blocks from Claude's response content array.
 * Skips tool_use and tool_result blocks (web search internals).
 */
function extractText(contentBlocks) {
  return contentBlocks
    .filter(block => block.type === 'text')
    .map(block => block.text)
    .join('');
}

/**
 * Parse the JSON gift object from Claude's response.
 * Claude occasionally wraps JSON in markdown code fences — we strip those.
 */
function parseGiftJSON(text) {
  // Try to find a JSON object in the text
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Could not parse suggestions. Please try again.');
  }

  try {
    return JSON.parse(jsonMatch[0]);
  } catch {
    throw new Error('Malformed response. Please try again.');
  }
}
