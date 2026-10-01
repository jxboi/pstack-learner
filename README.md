# pstack Academy

An interactive, Khan Academy–style course that teaches [pstack](https://github.com/cursor/plugins/tree/main/pstack) to someone who has never seen it. pstack is Lauren Tan's (poteto's) Cursor plugin of skills, playbooks and principles for rigorous agent work.

## What's inside

- **11 units, 52 lessons, 151 practice questions.** The course follows the pstack guide's arc: agents, skills and plugins, then the repo tour and setup, `/poteto-mode`, understanding code, design, build and clean, verify and ship, overnight runs, the 23 principles, making it yours, and a capstone.
- **21 interactive widgets.** These include an agent-loop animation, a SKILL.md dissector, a prompt router, an arena you coordinate, a swarm, Comment Sicko, a PR-stack lander, a Babysit triage drill, an overnight-contract builder, a night-run decision log, a blind-eval leak hunt, and a prompt workbench for your own project.
- **Six question types.** Multiple choice, select-all, ordering, matching, sorting into groups, and spot-the-mistake. Each gives instant feedback, hints, retries and explanations.
- **Learner profiles and progress.** You get multiple local profiles with avatars, XP, levels, a daily goal, streaks, an activity heatmap, 11 badges, and Khan-style mastery per lesson (Attempted, Familiar, Proficient, Mastered). Export and import let you move progress between browsers.
- **Toolbox.** It holds the prompt workbench, every simulation, a cheat sheet, all 23 playbooks, and the principle flashcards. A searchable glossary has 56 terms.

## Run it

```bash
npm install
npm run dev
```

## Check it

```bash
npm run validate
```

`validate` checks every lesson: answer keys in range, widgets that exist, images present, no duplicate lessons. It also checks that the multiple-choice answer letters learners see are evenly spread. `npm run build` runs it before type-checking and bundling.

## Where things live

- `src/content/units/*.ts` holds one file per unit. Lessons are arrays of typed steps (`read`, `widget`, `mcq`, `multi`, `order`, `match`, `sort`, `spot`, `recap`). Add a lesson by adding steps. The player handles the rest.
- `src/widgets/` holds the interactive simulations, registered by id in `src/widgets/index.ts`.
- `src/player/` holds the lesson player and question components.
- `src/lib/store.ts` holds profiles, progress, XP, mastery, streaks and badges. It persists to `localStorage`.

## Deploying

This is a static single-page app (Vite + React). `vercel.json` rewrites every path to `index.html` so deep links like `/unit/design` work.

## Credits

Course content is adapted from the pstack README, guide, skills and playbooks in [cursor/plugins](https://github.com/cursor/plugins) (MIT). The guide illustrations and logo come from that repo. This project is an unofficial learning companion.
