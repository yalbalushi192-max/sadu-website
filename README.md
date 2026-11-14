# Sadu website

Landing page for Sadu, a playful learning platform for children aged 2 to 14.
Plain HTML, CSS and JavaScript. No build step and nothing to install.

## Open it

Double-click `index.html` (English) or `ar.html` (Arabic, right to left).
The language link in the top menu switches between the two.

## Courses and family report

`learn.html` is the learning page (Arabic: `learn.html?lang=ar`). It has seven courses: English
phonics, Arabic phonics, maths, science, English, Arabic and art; each lesson is a
short idea to learn followed by four questions. A lesson earns 1 to 3 stars, depending on how
many questions were right on the first try.

The page opens on a **dashboard**: a "continue learning" card, this week's activity and streak,
totals, the learning plan and the five courses. A lesson plays full screen: learn the idea, then
answer four questions (keys 1, 2, 3 and Enter work too), then see the stars won.

**Ages:** on the first visit the dashboard asks how old the child is (3 to 12, or "show all").
Each course has `ages` in `js/courses.js` (phonics 3–7, Arabic 3–8, art 3–10, English 5–9, maths and
science 6–10). Courses for the child's age are shown first; the rest are listed under "Courses for
other ages". The "continue learning" card and the learning plan only suggest courses for that age.
Above age 10 every course is shown, because the lessons go up to age 10 for now. The age can be
changed on the dashboard or in the Family report.

**Activities:** besides three-answer questions, a lesson question can be an activity (`kind`):
- `count`: drag (or tap) dates into the basket, then Check. Maths lesson 6.
- `trace`: draw over a grey letter or shape with a finger or the mouse, then Check. It passes when
  most of the guide is covered without drawing far outside it. Arabic lesson 6 (letters), art lesson 6 (shapes).
- `match`: tap an item, then its partner. English lesson 6 (words and pictures), science lesson 6 (animals).

**Phonics:** two courses, English Phonics and Arabic Phonics. Saqr says a word and the child picks the sound it starts (or ends)
with, using the letters s a t p i n m d g o c k; then the child blends sounds to read words
(c · a · t → 🐱). Two lessons do the same in Arabic (hear بيت → ب; ق · م · ر → 🌙). A question with
`say` in `js/courses.js` is a listening question; on a device with no voice the word is shown instead.

**Story time:** three short illustrated stories in `js/stories.js` (Saqr Learns to Fly, Nouf Finds
Water, The Pearl Boat). Saqr reads each page aloud, and three questions follow each story. Story
stars are saved separately from lessons. The pictures are made from small drawings in `learn.html`
(dunes, palm, camel, boat and so on), placed by each page's `props`.

**Saqr, the guide:** an original young falcon in a Sadu scarf (drawn in `learn.html`, symbol `saqr`).
He greets the child on the dashboard, introduces each lesson, cheers right answers and gives a
**hint** after a wrong one. Hints are the `hint` of each lesson in `js/courses.js`; the maths
lessons make a hint for each sum ("Start at 12 and count on 5 more").

**Read aloud:** the lesson, each question (with its word and answers) and Saqr's hints and cheers
are spoken with the voices installed on the device, so children who cannot read yet can play
alone. It is on by default; the speaker button at the top of a lesson turns it off, and the small
speaker buttons replay any part. English words on the Arabic page are read with an English voice.
Devices with no voice for the page's language simply show no speaker buttons.

The **learning plan** (dashboard and Family report) finds where the child is weak. Each subject
gets a score from the share of questions answered right first time on each lesson's latest play:
85% and up is Strong, 60% and up is Building, below that is Needs practice. The plan then lists
up to four next steps: redo the weakest lessons (showing the exact questions that were missed),
learn the next lesson in the weakest subject, and try subjects not started yet. For weak subjects
it also shows an activity to do at home (the `tip` of each course in `js/courses.js`).

The **Family report** (side menu, or `learn.html#report`) shows the child's photo and name, the
learning plan, lessons done, stars, minutes spent, progress by subject, lessons worth practising
again and recent activity. It can be printed.

**Child's photo:** in the Family report, or by tapping the circle next to "Welcome", a parent can
take or choose a photo. It is cropped to a small square and appears in the greeting, the side
menu and the "Well done!" screen after each lesson. It is kept in this browser only and is never
uploaded; "Remove photo" or "Reset progress" deletes it.

Progress is saved in the browser on that device only (`localStorage`). There are no accounts:
another device, another browser, or clearing the browser data starts from zero, and there is
one child per browser.

**Lesson podcasts:** put an audio file named after the lesson in the `audio` folder (for
example `audio/math-1-en.m4a`) and a player appears on that lesson's Learn card. The full
list of names is in `audio/README.md`. No audio files are included yet.

To add or change a lesson, edit `js/courses.js`. The top of that file explains the format.
To change the page's wording, edit the `T` list in `js/learn.js`.

## Files

| File | What it is |
|---|---|
| `index.html` | English page. The markup is inside `<template id="page">`. |
| `ar.html` | Arabic page, same structure. |
| `learn.html` | Courses, lessons and family report. One page for both languages. |
| `css/learn.css` | Styles for `learn.html`. |
| `js/courses.js` | The six courses: lesson texts, questions and hints in English and Arabic. |
| `js/stories.js` | The stories: pages, pictures and questions in English and Arabic. |
| `js/learn.js` | Logic for `learn.html`: dashboard, playing a lesson, stars, saving progress, the learning plan, the child's photo, the report. |
| `css/site.css` | Page basics: hover, press, keyboard focus, reduced motion. |
| `js/runtime.js` | Small template engine that draws the page and redraws it after each click. |
| `js/falcon-flight.js` | Falcon Flight game, shared by both pages: sums, wind timer, feathers. Settings (`GOAL`, `LIVES`, `WIND`) are at the top. |
| `js/letter-catch.js` | Letter Catch game, shared by both pages: falling letter tiles, spoken word, stars. Uses the phonics `PH` list. |
| `js/souq-dash.js` | Souq Dash game, shared by both pages: orders, change counting, 90-second timer. |
| `js/page-en.js` | English page logic: course filter, progress demo, phonics, games, enroll form. |
| `js/page-ar.js` | Arabic page logic, same features with Arabic text. |

To change text, edit it in `index.html` and `ar.html`.
To change phonics letters or words, edit the `PH` list in `js/page-en.js` and `js/page-ar.js`.
To change the Souq Dash goods, prices or wording, edit the `souqDash(...)` line in the same two files. The game length is `SECONDS` in `js/souq-dash.js`.

## What is a demo only

- **Enroll form:** checks the email and shows a message. It does not send or save anything.
- **Parent notification:** shows how the message will read. It does not send anything to a phone.
- **Progress demo, points and stars on the landing page:** reset when the page is reloaded, and are separate from the real progress saved by `learn.html`.
- **Course cards on the landing page** (Souq Maths, Desert Lab and so on): sample names that do not match the five courses in `learn.html` yet.
- **Hear the word:** uses the voices installed on the device (Saudi Arabic and British English when available).
- **Testimonials:** sample quotes with placeholder names. Replace them with real ones before publishing.
- **Falcon Flight:** playable. Nothing is saved between rounds, and its points are not added to the progress bar.
- **Letter Catch:** playable in English and Arabic letters. It speaks the word with the voices installed on the device; with no voice, the word is still shown on screen. Stars reset when the page is reloaded.
- **Souq Dash:** playable. The score and best score reset when the page is reloaded, and its points are not added to the progress bar.

## Needs an internet connection

The fonts load from Google Fonts. Offline, the page still works with the device's default fonts.

## Credits

- English phonics order follows the Phase 2 sequence used in `hellodeborahuk/buzzphonics` (MIT licence).
- Arabic mouth-position facts were checked against `harufkids/haruf-tahajji-kids` (MIT licence). The wording of all tips is original and should be reviewed by a teacher.
