# Sadu online: plan for the owner

This page explains, in plain language, how Sadu can go online, how accounts and syncing would work,
and what each step needs from you. Nothing here is set up yet. Each step starts only when you say yes.

## 1. Put the website online (free)

| Option | Cost | Code public? | Automatic updates | What you do |
|---|---|---|---|---|
| **GitHub Pages** (recommended to start) | Free | Yes | Yes, every saved version | Create a GitHub account (done: `yalbalushi192-max`), install the GitHub tool, log in once |
| Netlify or Cloudflare Pages | Free | No (private code is fine) | Yes | Same as GitHub, plus connect the site on their website (a few clicks) |
| Your own web address (for example `sadu.app`) | About 10 to 15 USD a year | — | — | Buy the name; we point it at the site |

**Your web address with GitHub Pages:** `https://yalbalushi192-max.github.io/sadu-website/`

**What I do after you log in:** create the `sadu-website` repository, upload the site, turn on GitHub
Pages, and from then on every saved version goes live within about a minute. Once it is online over
https, phones offer to **install Sadu like an app**, and it works offline.

**Privacy:** the website's code is public on GitHub Pages; that is normal. No child's name, photo or
progress is ever in the code. Until accounts exist, progress stays only on each device.

## 2. Accounts and syncing across devices

**Recommended service:** Supabase (a database with sign-in). Free plan: up to 50,000 monthly users and
500 MB of data, which is far more than a small school or family needs. A paid plan starts at about
25 USD a month if Sadu grows a lot.

**How it would work for families:**
1. A **parent** signs in with their email (a sign-in link is emailed; no password to remember).
2. The parent's children appear on "Who is learning today?" on any phone, tablet or computer.
3. Progress, stickers, photos (optional) and settings sync automatically. Without internet, Sadu keeps
   working and syncs later.
4. Lessons made in the **lesson editor** can be saved to the account and, if you choose, shared with
   every family using Sadu.

**Children never sign in themselves and never type an email.** Only parents (and teachers) have accounts.

**What is stored:** the parent's email; for each child a first name (or nickname), age, progress and
settings; the photo only if the parent adds one. Nothing is sold, and there are no adverts.

**What you would need to do (about 10 minutes):**
1. Create a free account at supabase.com and a new project (choose a region near you, for example
   Frankfurt or Mumbai).
2. In the project's settings, copy two values and send them to me: the **Project URL** and the
   **anon public key**. (The anon key is designed to be public; I will never ask for the secret
   "service role" key.)
3. I set up the tables and the safety rules (each family can only ever see its own data), add the
   sign-in screen, and test everything before anything changes for families.

## 3. Teacher classes (after accounts)

- A teacher signs in and creates a **class**; Sadu gives the class a short **class code**.
- Parents enter the code to join their child to the class (the parent stays in control).
- The teacher sees each child's progress and mastery, prints weekly summaries and certificates,
  and can **assign lessons** (including lessons made in the editor).

## 4. Rules for children's data (please read)

Because Sadu is for children, a few rules matter wherever you are:
- Only a parent creates an account and agrees to the privacy notice for their child.
- Collect as little as possible (first name, age, progress). Photos are optional.
- A parent can see, download and delete their child's data at any time (Sadu will have buttons for this).
- No adverts and no tracking tools.
- Write a short privacy notice (I can draft it for you to check). If Sadu is used by schools or sold,
  it is worth asking a local lawyer to review it.

## Order I suggest

1. Go online with GitHub Pages (you: install the GitHub tool and log in).
2. Accounts and syncing with Supabase (you: create the project, send the two values).
3. Lesson editor saves online and can share lessons.
4. Teacher classes.
5. Optional: your own web address.
