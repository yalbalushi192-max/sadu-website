# Sadu Video Studio helper (Seedance 2.5)

The Video Studio in Sadu (Family report → Video Studio, for grown-ups) makes short videos with
**Seedance 2.5** from BytePlus. The Seedance **API key must stay secret**, so it lives in this small
helper, not in the website. The helper also checks every prompt and adds child-safe wording.

## What you need

1. **A BytePlus account** with **ModelArk** turned on, and an **API key** (ModelArk → API keys).
   BytePlus asks for an account balance of **at least USD 30** before video models can be used;
   each video then costs a little from that balance.
2. **A free Cloudflare account** (cloudflare.com).

## Set up the helper (about 10 minutes)

1. In Cloudflare: **Workers & Pages → Create → Create Worker**. Name it `sadu-video`. Press **Deploy**.
2. Press **Edit code**, delete what is there, paste everything from `seedance-worker.js`, press **Deploy**.
3. Open the worker's **Settings → Variables and Secrets** and add:
   - `ARK_API_KEY` (type **Secret**): your BytePlus ModelArk API key
   - `STUDIO_PIN` (type **Secret**): a code only parents and teachers know, for example `4827`
   - `ALLOWED_ORIGIN`: your website address, `https://yalbalushi192-max.github.io`
4. Copy the worker's address (it looks like `https://sadu-video.YOURNAME.workers.dev`).
5. In Sadu: **Family report → Video Studio → Connect**, paste the address and the PIN. Done.

## Safety

- Only grown-ups reach the Video Studio (it is behind the grown-ups question), and the helper also
  needs the PIN.
- Prompts with unsuitable words are refused, both in the website and in the helper.
- Every prompt starts with: "A gentle, child-friendly educational cartoon for young children…
  no violence, nothing scary, no adult content".
- Videos carry the Seedance watermark. Always watch a video before showing it to children.
- Seedance's video links expire after some time: press **Save** to keep a copy of a video you like.

## Costs

To spend less, set the optional variable `SEEDANCE_MODEL` to `dreamina-seedance-2-5-flash-261115`
(the faster, cheaper version) and keep videos at 5 seconds.

---

# Sadu Vibe Studio helper (Claude Fable 5.2)

**Make a game** (in the side menu) lets a child describe a game in their own words; **Claude Fable 5.2**
builds it as a small web page, and the child plays it right away and can ask for changes ("make it
faster"). The Claude API key stays secret in this second small helper, `vibe-worker.js`.

## What you need

1. **A Claude API account** at **console.anthropic.com**: add some credit (Billing) and create an
   **API key** (API keys → Create key). Each game costs roughly **10 to 30 US cents**
   (Claude Fable 5.2 costs USD 8 per million words-pieces read and USD 40 per million written).
   Set a **monthly spend limit** in the Console (Limits) so it can never cost more than you want.
2. The same free **Cloudflare** account as above.

## Set up the helper (about 10 minutes)

1. In Cloudflare: **Workers & Pages → Create → Create Worker**. Name it `sadu-vibe`. Press **Deploy**.
2. Press **Edit code**, delete what is there, paste everything from `vibe-worker.js`, press **Deploy**.
3. In the worker's **Settings → Variables and Secrets** add:
   - `ANTHROPIC_API_KEY` (type **Secret**): your Claude API key
   - `STUDIO_PIN` (type **Secret**): a code only grown-ups know
   - `ALLOWED_ORIGIN`: `https://yalbalushi192-max.github.io`
4. Copy the worker's address (like `https://sadu-vibe.YOURNAME.workers.dev`).
5. In Sadu: **Make a game → For grown-ups: connect**, answer the grown-ups question, paste the address
   and the PIN, press **Connect**. Do this once on each device your child uses.

## Safety

- Ideas with unsuitable words are refused (in the website and in the helper), and Claude is told to
  make only gentle, child-safe games with no links, no ads and no questions about personal details.
- Every game runs in a **locked box**: it cannot use the internet, cannot read Sadu's saved progress or
  photos, and cannot change the Sadu page. (This was tested.)
- Games are saved only on that device (the last 8).
