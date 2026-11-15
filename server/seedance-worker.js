// Sadu Video Studio helper (a Cloudflare Worker).
// It keeps the Seedance (BytePlus ModelArk) API key secret: the website never sees it.
// The website sends a prompt; this helper checks it, adds child-safe wording, asks Seedance to make
// a video, and then reports when the video is ready.
//
// Secrets to set in Cloudflare (Settings → Variables and Secrets):
//   ARK_API_KEY     the BytePlus ModelArk API key (keep it secret)
//   STUDIO_PIN      a code the parent types in the Video Studio, so strangers cannot spend your credit
//   ALLOWED_ORIGIN  the website address, for example https://yousufalbalushi192-max.github.io
// Optional:
//   SEEDANCE_MODEL  defaults to dreamina-seedance-2-5-260628 (use the "flash" model to spend less)
//
// Routes:
//   POST /video        body { prompt, duration, ratio }  →  { id }
//   GET  /video/<id>                                     →  { status, videoUrl, error }

const ARK_BASE = 'https://ark.ap-southeast.bytepluses.com/api/v3';

// words that are never allowed in a children's video prompt (checked in any letter case)
const BLOCKED = [
  'kill', 'blood', 'gun', 'weapon', 'knife', 'war', 'fight', 'violence', 'dead', 'death', 'scary', 'horror',
  'monster attack', 'nude', 'naked', 'sexy', 'kiss', 'drug', 'alcohol', 'beer', 'smoke', 'cigarette', 'bomb',
  'قتل', 'دم', 'سلاح', 'مسدس', 'سكين', 'حرب', 'عنف', 'موت', 'رعب', 'مخيف', 'عاري', 'مخدرات', 'خمر', 'تدخين', 'قنبلة'
];

// added in front of every prompt
const SAFE_STYLE = 'A gentle, child-friendly educational cartoon for young children aged 3 to 10. Bright, warm colours, ' +
  'soft shapes, friendly characters, calm movement. No violence, nothing scary, no adult content, no text on screen. Scene: ';

function cors(env) {
  return {
    'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN || '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Sadu-Pin',
    'Content-Type': 'application/json'
  };
}
function reply(env, status, data) { return new Response(JSON.stringify(data), { status, headers: cors(env) }); }

// whole words only, so "warm" is fine but "war" is not; Arabic words may carry ال or و in front
export function hasBlockedWord(text) {
  const tokens = String(text).toLowerCase().split(/[^a-z\u0600-\u06FF]+/).filter(Boolean);
  const bare = tokens.map((t) => t.replace(/^(و|ف|ب)?(ال)?/, ''));
  const joined = ' ' + tokens.join(' ') + ' ';
  return BLOCKED.some((w) => w.includes(' ') ? joined.includes(' ' + w + ' ')
    : tokens.some((t, i) => t === w || t === w + 's' || bare[i] === w));
}

export function checkPrompt(prompt) {
  const p = String(prompt || '').trim();
  if (p.length < 5) return { ok: false, error: 'too-short' };
  if (p.length > 500) return { ok: false, error: 'too-long' };
  if (hasBlockedWord(p)) return { ok: false, error: 'not-allowed' };
  return { ok: true, prompt: p };
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors(env) });
    if (!env.ARK_API_KEY) return reply(env, 500, { error: 'not-configured' });
    if (!env.STUDIO_PIN || request.headers.get('X-Sadu-Pin') !== env.STUDIO_PIN) return reply(env, 401, { error: 'wrong-pin' });

    const url = new URL(request.url);
    const auth = { 'Authorization': 'Bearer ' + env.ARK_API_KEY, 'Content-Type': 'application/json' };

    // start a video
    if (request.method === 'POST' && url.pathname === '/video') {
      let body;
      try { body = await request.json(); } catch (e) { return reply(env, 400, { error: 'bad-request' }); }
      const check = checkPrompt(body.prompt);
      if (!check.ok) return reply(env, 400, { error: check.error });
      const duration = [5, 8, 10].includes(Number(body.duration)) ? Number(body.duration) : 5;
      const ratio = ['16:9', '9:16', '1:1'].includes(body.ratio) ? body.ratio : '16:9';
      const res = await fetch(ARK_BASE + '/contents/generations/tasks', {
        method: 'POST', headers: auth,
        body: JSON.stringify({
          model: env.SEEDANCE_MODEL || 'dreamina-seedance-2-5-260628',
          content: [{ type: 'text', text: SAFE_STYLE + check.prompt }],
          ratio, duration, generate_audio: false, watermark: true
        })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.id) return reply(env, 502, { error: (data.error && data.error.code) || 'seedance-error' });
      return reply(env, 200, { id: data.id });
    }

    // check a video
    const m = url.pathname.match(/^\/video\/([\w-]+)$/);
    if (request.method === 'GET' && m) {
      const res = await fetch(ARK_BASE + '/contents/generations/tasks/' + m[1], { headers: auth });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) return reply(env, 502, { error: (data.error && data.error.code) || 'seedance-error' });
      return reply(env, 200, {
        status: data.status,                                    // queued, running, succeeded, failed
        videoUrl: data.content && data.content.video_url ? data.content.video_url : null,
        error: data.error ? data.error.message || data.error.code : null
      });
    }
    return reply(env, 404, { error: 'not-found' });
  }
};
