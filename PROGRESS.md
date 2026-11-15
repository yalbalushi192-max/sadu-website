# Sadu: work in progress

This file is updated after each finished item. Each item is also saved as a git version
(see "How to undo" below).

## Rules for unattended work

- Work on one item at a time: build it, test it in a browser (English and Arabic, desktop and phone width), then save a version.
- Never publish or upload the site, connect online services, or delete the owner's files, unless the owner has logged in to their own account in this session and said yes to that specific step (the owner asked on 2026-11-15 for the site to go online, with accounts).
- Keep saved progress working: lesson ids stay the same, and new data fields are optional.
- Arabic text written here should still be reviewed by a teacher before publishing.

## To do (in order)

0. [x] Make it interactive for kids (owner's request, first): (a) sound effects, confetti, tappable Saqr with fun facts, bouncy answers; (b) sticker book: a sticker for every finished lesson. Part (a) done: sound effects (switch in the lesson bar), confetti, tap Saqr for fun facts, bouncy answers. Part (b) done: sticker book page (menu: Stickers), a sticker per lesson and story, gold for 3 stars, "New sticker!" on the result screen, latest stickers on the dashboard.
1. [x] More phonics: English digraphs (sh, ch, th, ck), more first-sound sets, and Arabic short vowels (fatha, kasra, damma). Done: phonics-8 (r h b f), phonics-9 (sh ch th ck), phonics-10 (fatha, kasra, damma); missed words now show in the plan; single letters shown large.
C. Updatable website (owner's request, first):
   - [x] Install like an app: web app manifest, icons, offline cache (works once the site is online over https). Done: manifest.webmanifest, icons/ (192, 512, maskable, Apple), sw.js; Chrome reports it installable and all pages open offline. Raise VERSION in sw.js when files are added or removed.
   - [x] Lesson editor: a page to add or change lessons, questions and stories with a form (no code); saved on this device and exportable, until accounts exist. Done: Family report → Lesson editor; course and level, title, learn text, hint, 4 questions with a right and two wrong answers, English and Arabic; save and try; edit, delete, export and import a file; lessons appear in their course, on the journey, with a ✏️ sticker.
   - [ ] (waiting for the owner) Go online: GitHub Pages with automatic updates. Owner's GitHub username: yousufalbalushi192-max. The owner installs and logs in with `! sudo apt install -y gh` and `! gh auth login`, and confirms a public repository. NEEDS THE OWNER: a GitHub account and `gh auth login`; ask before making the repository public.
   - [ ] (waiting for the owner) Accounts and sync: parent sign-in and progress synced across devices (Supabase). NEEDS THE OWNER: a free Supabase project URL and public (anon) key.
   - [ ] (waiting for accounts) Editor saves online: lessons added in the editor reach every family (after accounts).

B. Full learning platform (owner's request; profiles first):
   - [x] Child profiles: several children on one device, each with their own name, photo, age, progress, stickers and settings; a "Who is learning?" screen; existing progress becomes the first profile. Done: "Switch child" in the side menu; add a child with name and age; remove a child from the Family report.
   - [x] Mastery levels (idea from Khan Academy): each lesson moves through Not started, Attempted, Familiar, Proficient, Mastered with good scores and can slip back; shown on the course path and in the report; a course mastery %. Done: practice reaches Proficient; Mastered waits for the course challenge.
   - [x] Course challenge (idea from Khan Academy unit tests): about 8 mixed questions from a whole course that can raise mastery levels. Done: card at the end of each course page, unlocks after 2 lessons, 8 mixed questions from played lessons; all right moves Proficient to Mastered, mistakes can slip a level; best score kept.
   - [x] Printable worksheets (idea from Khan Academy Kids printables): a print button that makes a worksheet for a lesson. Done: worksheet icon on each lesson row; circle-the-answer, colour the dates, dotted tracing with an empty box, draw-a-line matching; name and date lines; answers for grown-ups; prints on about 2 pages.
   - [x] Journey map led by the child (owner's choice, replaces the 30-day calendar): the child's photo moves along an adventure map of lessons; Saqr stands beside them, says what to do next out loud and a bouncing hand points at the button; after each lesson the child goes back to the map and moves on. Step 2: the pointing hand inside lessons too (Start, Next, Check). Done: My journey is the first menu item and the start page; stops mix the courses for the child's age, easiest levels first; Saqr reads the next stop aloud; hands point at Go, Start, Next question, Check, Next page and Back to my journey.
   - [-] 30-Day Adventure: dropped by the owner in favour of the journey map.
   - [x] Curriculum levels: every course organised into Level 1, 2 and 3 (units), with many more lessons per subject (target 15+ per course), keeping old lesson ids. Step 1 done: Level 1 Starter, 2 Explorer, 3 Champion on every course page (with level mastery %); lessons shown and played in level order; Maths now has 10 lessons (Doubles, Make 10, Times 3 and 4, Sharing equally). Step 2 done: Science 10 lessons (Weather, Healthy food, Float or sink, Magnets), English 10 lessons (Colours, Numbers one to ten, Action words, am is are). Step 3 done: Arabic 10 lessons (Colours, Animals, ال, Days of the week), Art 10 lessons (Lines, Sadu symbols, Symmetry, Opposite colours). Step 4 done: English Phonics 10 (l w y j, ee and oo, four-sound blending), Arabic Phonics 10 (dots, س ش ص, ح خ ع, ق or ك, long vowels, last sounds, more blending). All seven courses now have 10 lessons (70 in total). Growing every course to 15 lessons moves to its own item at the end of this list.
   - [x] Certificates: a printable certificate when a course or level is finished. Done: offered on the result screen when a level or course is finished; certificate buttons on finished levels and courses; Sadu border, child's name and photo, stars, date, Saqr seal, signature line; prints on one page.
   - [x] Weekly summary for parents: a "this week" page (lessons, minutes, strengths, what to practise), printable. Done: Family report → Weekly summary; last 7 days: lessons, minutes (kept per day from now on), active days, stories, day-by-day bars, what went well, practise next (with missed questions), Saqr's tip for next week; prints on one page.
   - [x] Grow every course to 15 lessons (keep ids stable; new lessons get a level, hint and sticker). Step 1 done: Maths 15 (Counting in 2s 5s 10s, Halves, Shapes and sides, Telling the time, Shopping sums) and Science 15 (Bones and muscles, Light and shadow, Life cycles, Recycling, Land and water). Step 2 done: English 15 (Fruit words, Body parts, Describing words, Question words, Yesterday words -ed) and Arabic 15 (Family, Body parts, ة feminine, plural, little sentences). Step 3 done: Art 15 (Drawing feelings, Textures, Geometric patterns, Colour feelings, Gulf crafts), English Phonics 15 (v z qu x, ai oa igh ar, listen and rhyme, count the sounds, tricky words), Arabic Phonics 15 (ط or ت, ذ ز ظ, shadda, count the letters, read short words). All seven courses have 15 lessons: 105 in total.
   - [x] Plan for accounts, syncing across devices, teacher classes with a class code, and putting the site online (a written plan with options and costs for the owner to decide; nothing set up without the owner). Done: ONLINE-PLAN.md.
A. Ideas from the best children's learning apps (owner's request; Sadu's own look and content, nothing copied):
   - [x] Split Phonics into English Phonics and Arabic Phonics (lesson ids and stickers kept).
   - [x] Daily goal (like Duolingo ABC, Lingokids): pick 1, 2 or 3 lessons a day; a goal ring on the dashboard; a celebration when it is reached. Done: in the This week card.
   - [x] Quick review (spaced practice, like Duolingo): a short lesson built from recently missed questions, offered by Saqr. Done: offer on the journey and the dashboard (up to 6 questions, newest lessons first; maths gives a fresh sum of the same kind); right answers clear them and lift the lesson's score.
   - [x] Adaptive maths (like Khan Academy Kids, Prodigy): numbers get bigger or smaller with the child's recent accuracy. Done: every maths lesson that makes its own questions has easier, normal and harder number ranges; all right moves up, under 60% moves down; age 5 and under starts easier; Saqr says when it changed.
   - [ ] (waiting for the owner) Unity game Falcon Dash: code and guide are in unity/ (FalconDash.cs and README.md). The owner installs Unity 6 with WebGL support, builds into games/falcon-dash/; then add a Falcon Dash button to the games, test it, and save.
   - [ ] Coding course (owner's idea, from coding-for-kids programmes such as CodaKid; Sadu's own content): guide Saqr across a grid with arrow blocks (sequences), then repeat blocks (loops) and if blocks (choices); ages 5 to 10; later a gentle 'What is AI?' lesson where children sort pictures to teach a pretend robot. Step 1 done: Coding course (coding-1 Move Saqr, coding-2 Up and down, coding-3 Around the rocks, coding-4 Repeat blocks): arrow and repeat blocks, Run animates Saqr on a grid, crash and short hints, block limits. Next: if-blocks (choices) and 'What is AI?'.
   - [ ] Animated blending (like Teach Your Monster to Read, Starfall): letters slide together as the sounds are spoken.
   - [ ] Watch, then trace (like letter-writing apps): a dotted demo moves along the shape first; a green start dot shows where to begin.
   - [ ] Parent gate and break timer (like Khan Academy Kids, ABCmouse): a grown-ups-only question before the Family report and settings; an optional daily time limit with Saqr suggesting a break.
   - [ ] Dress up Saqr (like avatar rewards in ABCmouse, Lingokids): spend stars on hats and scarves for Saqr.
2. [ ] More stories: 2 or 3 new illustrated stories with questions.
3. [ ] Polish and bug check: every lesson, story and activity on phone and desktop in both languages; accessibility (keyboard, labels, contrast).
4. [ ] Landing page refresh: index.html and ar.html in the new look, with Saqr, the real six courses, stories and ages.
5. [ ] Lessons for ages 10 to 14: harder courses (for example fractions, grammar, science topics, Arabic reading) so older children get their own lessons.

## Done

- Redesigned learn.html (dashboard, course path, lesson player, family report).
- Learning plan (strengths, weaknesses, next steps, at-home tips).
- Child's photo, kept on the device only.
- Saqr the guide, hints, read aloud.
- Story time (3 stories), Phonics course (7 lessons).
- Activities: count, trace, match. Courses by age.

## How to undo

Every finished item is a saved version. To see them, run `git log --oneline` in this folder.
To go back one version: `git revert HEAD` (this keeps history and is safe).
