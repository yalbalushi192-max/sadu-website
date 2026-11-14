# Sadu: work in progress

This file is updated after each finished item. Each item is also saved as a git version
(see "How to undo" below).

## Rules for unattended work

- Work on one item at a time: build it, test it in a browser (English and Arabic, desktop and phone width), then save a version.
- Never publish or upload the site, connect online services, or delete the owner's files.
- Keep saved progress working: lesson ids stay the same, and new data fields are optional.
- Arabic text written here should still be reviewed by a teacher before publishing.

## To do (in order)

1. [ ] More phonics: English digraphs (sh, ch, th, ck), more first-sound sets, and Arabic short vowels (fatha, kasra, damma).
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
