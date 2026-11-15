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
