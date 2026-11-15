// Sadu Vibe Studio helper (a Cloudflare Worker).
// A child describes a game; this helper asks Claude Fable 5.2 to build it as one small HTML page
// and sends the page back to Sadu, which plays it in a locked box (no internet, no access to Sadu's data).
// The Claude API key stays here, never in the website.
//
// It uses plain fetch (raw HTTP) on purpose: the worker is pasted straight into the Cloudflare
// dashboard, which has no build step to bundle the Anthropic SDK.
//
// Secrets to set in Cloudflare (Settings → Variables and Secrets):
//   ANTHROPIC_API_KEY  your Claude API key from console.anthropic.com (keep it secret)
//   STUDIO_PIN         a code a grown-up types once when connecting, so strangers cannot spend your credit
//   ALLOWED_ORIGIN     the website address, for example https://yalbalushi192-max.github.io
//
// Routes:
//   POST /game   body { idea, lang, code? }  →  { html, title }   (code = the current game, to change it)

const MODEL = 'claude-fable-5-2';

const BLOCKED = [
  'kill', 'blood', 'gun', 'weapon', 'knife', 'war', 'fight', 'violence', 'dead', 'death', 'scary', 'horror',
  'monster attack', 'nude', 'naked', 'sexy', 'kiss', 'drug', 'alcohol', 'beer', 'smoke', 'cigarette', 'bomb',
  'قتل', 'دم', 'سلاح', 'مسدس', 'سكين', 'حرب', 'عنف', 'موت', 'رعب', 'مخيف', 'عاري', 'مخدرات', 'خمر', 'تدخين', 'قنبلة'
];

const SYSTEM = `You build tiny games for Sadu, a learning website for children aged 4 to 12, in English and Arabic.
A child describes a game idea in their own words. Turn it into a fun, working game they can play straight away.

What to return: one complete HTML document and nothing else (no explanation, no markdown fences).
- Everything inline in that one file: CSS in <style>, JavaScript in <script>. No external files, fonts, images,
  libraries or network requests of any kind: the game runs in a sandbox with the network blocked. Draw with
  emoji, CSS shapes, SVG or <canvas>.
- Put a short, fun name for the game in <title>.
- It must work with touch on a phone or tablet and with a mouse or keyboard on a computer, and fit a box
  about 360 to 900 pixels wide without scrolling sideways.
- Big, bright, friendly visuals; big buttons; a start or "play again" button; a score or a happy ending.
- Write all on-screen words in the child's language (given below); for Arabic set dir="rtl" on <html>.
- Where it fits naturally, add a little learning: counting, letters, sounds, shapes, colours, simple sums.
- Keep it small: under about 300 lines.
- Always child-safe: gentle and kind, no violence, nothing scary, no real people or brands, no links, no
  forms that ask for names or personal details, no ads. If the idea is not suitable for young children,
  make a gentle, cheerful game on a similar theme instead.

If you are given the current game code with a change request, return the whole updated document with the
change made, keeping everything else working.`;

function cors(env) {
  return {
    'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN || '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Sadu-Pin',
    'Content-Type': 'application/json'
  };
}
function reply(env, status, data) { return new Response(JSON.stringify(data), { status, headers: cors(env) }); }

export function hasBlockedWord(text) {
  const tokens = String(text).toLowerCase().split(/[^a-z؀-ۿ]+/).filter(Boolean);
  const bare = tokens.map((t) => t.replace(/^(و|ف|ب)?(ال)?/, ''));
  const joined = ' ' + tokens.join(' ') + ' ';
  return BLOCKED.some((w) => w.includes(' ') ? joined.includes(' ' + w + ' ')
    : tokens.some((t, i) => t === w || t === w + 's' || bare[i] === w));
}

// the request sent to Claude (exported so it can be tested without calling the API)
export function buildRequest(idea, lang, code) {
  const language = lang === 'ar' ? 'Arabic' : 'English';
  const text = code
    ? `The child's language: ${language}.\n\nCurrent game code:\n${code}\n\nThe child wants this change: ${idea}`
    : `The child's language: ${language}.\n\nThe child's game idea: ${idea}`;
  return {
    model: MODEL,
    max_tokens: 16000,
    output_config: { effort: 'medium' },          // fast enough for a child to wait for; raise to "high" for fancier games
    fallbacks: 'default',                          // if Fable declines a request, Claude retries it on a suitable model
    system: SYSTEM,
    messages: [{ role: 'user', content: text }]
  };
}

// pull the HTML page out of Claude's answer
export function extractHtml(data) {
  const text = (data.content || []).filter((b) => b.type === 'text').map((b) => b.text).join('');
  const start = text.search(/<!doctype html|<html/i), end = text.toLowerCase().lastIndexOf('</html>');
  if (start === -1 || end === -1) return null;
  const html = text.slice(start, end + 7);
  const m = html.match(/<title>([^<]{1,80})<\/title>/i);
  return { html, title: m ? m[1].trim() : '' };
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors(env) });
    if (!env.ANTHROPIC_API_KEY) return reply(env, 500, { error: 'not-configured' });
    if (!env.STUDIO_PIN || request.headers.get('X-Sadu-Pin') !== env.STUDIO_PIN) return reply(env, 401, { error: 'wrong-pin' });
    const url = new URL(request.url);
    if (request.method !== 'POST' || url.pathname !== '/game') return reply(env, 404, { error: 'not-found' });

    let body;
    try { body = await request.json(); } catch (e) { return reply(env, 400, { error: 'bad-request' }); }
    const idea = String(body.idea || '').trim();
    if (idea.length < 3) return reply(env, 400, { error: 'too-short' });
    if (idea.length > 400) return reply(env, 400, { error: 'too-long' });
    if (hasBlockedWord(idea)) return reply(env, 400, { error: 'not-allowed' });
    const code = typeof body.code === 'string' && body.code.length < 60000 ? body.code : '';

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2026-10-21',
        'anthropic-beta': 'server-side-fallback-2026-07-01'
      },
      body: JSON.stringify(buildRequest(idea, body.lang, code))
    });
    const data = await res.json().catch(() => ({}));
    if (res.status === 429) return reply(env, 429, { error: 'busy' });
    if (!res.ok) return reply(env, 502, { error: 'claude-error' });
    if (data.stop_reason === 'refusal') return reply(env, 400, { error: 'not-allowed' });
    if (data.stop_reason === 'max_tokens') return reply(env, 502, { error: 'too-big' });
    const game = extractHtml(data);
    if (!game) return reply(env, 502, { error: 'claude-error' });
    return reply(env, 200, game);
  }
};
