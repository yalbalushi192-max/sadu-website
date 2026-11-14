# Sadu: work in progress

This file is updated after each finished item. Each item is also saved as a git version
(see "How to undo" below).

## Rules for unattended work

- Work on one item at a time: build it, test it in a browser (English and Arabic, desktop and phone width), then save a version.
- Never publish or upload the site, connect online services, or delete the owner's files.
- Keep saved progress working: lesson ids stay the same, and new data fields are optional.
- Arabic text written here should still be reviewed by a teacher before publishing.

## To do (in order)

0. [x] Make it interactive for kids (owner's request, first): (a) sound effects, confetti, tappable Saqr with fun facts, bouncy answers; (b) sticker book: a sticker for every finished lesson. Part (a) done: sound effects (switch in the lesson bar), confetti, tap Saqr for fun facts, bouncy answers. Part (b) done: sticker book page (menu: Stickers), a sticker per lesson and story, gold for 3 stars, "New sticker!" on the result screen, latest stickers on the dashboard.
1. [x] More phonics: English digraphs (sh, ch, th, ck), more first-sound sets, and Arabic short vowels (fatha, kasra, damma). Done: phonics-8 (r h b f), phonics-9 (sh ch th ck), phonics-10 (fatha, kasra, damma); missed words now show in the plan; single letters shown large.
A. Ideas from the best children's learning apps (owner's request; Sadu's own look and content, nothing copied):
   - [x] Split Phonics into English Phonics and Arabic Phonics (lesson ids and stickers kept).
   - [x] Daily goal (like Duolingo ABC, Lingokids): pick 1, 2 or 3 lessons a day; a goal ring on the dashboard; a celebration when it is reached. Done: in the This week card.
   - [ ] Quick review (spaced practice, like Duolingo): a short lesson built from recently missed questions, offered by Saqr.
   - [ ] Adaptive maths (like Khan Academy Kids, Prodigy): numbers get bigger or smaller with the child's recent accuracy.
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
