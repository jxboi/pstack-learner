import type { Unit } from '../types'

export const capstone: Unit = {
  id: 'capstone',
  index: 11,
  title: 'Capstone: use it on your project',
  tagline: 'Recipes to copy, pitfalls to dodge, and prompts written for your own code.',
  icon: '🎓',
  hue: 95,
  image: '/guide/recipes.jpg',
  goals: [
    'Reuse the most valuable prompt recipes',
    'Spot the eight classic pitfalls',
    'Write pstack prompts for your own project',
  ],
  lessons: [
    {
      id: 'recipes',
      title: 'Recipes worth copying',
      kind: 'learn',
      minutes: 5,
      summary: 'Short, informal prompts that do a lot.',
      steps: [
        {
          kind: 'read',
          title: 'Informal is fine',
          body: `The recipes are deliberately informal. That is how they get typed in practice, and the skills read intent fine.

\`\`\`
use /how first to understand how this initialization works. then use /why to figure out why it broke recently.
\`\`\`
\`\`\`
ask /arena for a second opinion on this thread and our approach
\`\`\`
\`\`\`
/interrogate the whole branch, but skeptically. don't change anything yet. no nitpicks unless it's an actual bug or regression in behavior.
\`\`\`
\`\`\`
/poteto-mode repro the duplicate write first. if there's a cheap test path, /tdd it. then fix and rerun.
\`\`\`
\`\`\`
i said the goal is to repro. i did not ask for a fix yet.
\`\`\`
\`\`\`
/bro
\`\`\`

That last one restates the previous reply in plain human language, no jargon. Use it when a reply is thorough and you still do not know what it said.`,
          image: { src: '/guide/recipes.jpg', alt: 'She tastes a finished dish while robots cook from a recipe box with cards for /how, /tdd and /loop.', credit: 'Illustration from the pstack guide (MIT)' },
        },
        {
          kind: 'match',
          q: 'Match each situation to its recipe.',
          pairs: [
            ['A reply full of jargon you cannot parse', '/bro'],
            ['Insurance before a costly design commitment', '"ask /arena for a second opinion..."'],
            ['A drifting run that started fixing when you asked for a repro', '"i said the goal is to repro..."'],
            ['Review without any edits yet', '"/interrogate ... don\'t change anything yet"'],
          ],
          explain: 'Steering prompts are one line. You need the right name, not more words.',
          hint: 'Start with /bro, which was explained on the last screen.',
        },
        {
          kind: 'mcq',
          q: 'In "/interrogate the whole branch, but skeptically. don\'t change anything yet. no nitpicks...", what does "don\'t change anything yet" do?',
          options: ['Nothing. /interrogate never changes code anyway.', 'It keeps the whole session read-only, not just the review', 'It skips the Act on bucket', 'It tells reviewers to report fewer findings'],
          answer: 1,
          explain: '/interrogate applies nothing by itself, but you are in a chat that can act on its findings. "don\'t change anything yet" tells the agent not to start fixing until you have read the report. Qualifiers do real work. "no nitpicks" pre-filters noise too.',
          hint: 'What might the agent do right after the report, if you did not say this?',
        },
      ],
    },
    {
      id: 'pitfalls',
      title: 'Pitfall patrol',
      kind: 'practice',
      minutes: 5,
      summary: 'The mistakes everyone makes once.',
      steps: [
        {
          kind: 'read',
          title: 'The eight pitfalls',
          body: `1. **Enumerating skills in the prompt.** The playbook already sequences them.
2. **A vague finish condition.** "make it better" gives /loop nothing to check.
3. **Parallel agents in one worktree.** They overwrite each other.
4. **Using /arena for coverage.** That is /swarm.
5. **Accepting every review comment.** Bots and humans file real catches and noise in one list.
6. **Treating \`auto\` as a model slug.** It means "inherit the parent chat model".
7. **Reporting success off a green build.** Ask for the real command, flow, value, or profile.
8. **Writing a SKILL.md freehand.** Route it through the Authoring playbook.`,
        },
        {
          kind: 'sort',
          q: 'Good practice or pitfall?',
          buckets: ['Good practice', 'Pitfall'],
          items: [
            { text: '"own worktree per attempt"', bucket: 0 },
            { text: '"work on this for 4 hours"', bucket: 1 },
            { text: '"use /how then /architect then /arena then /tdd"', bucket: 1 },
            { text: '"done means zero old callers and all fixtures pass"', bucket: 0 },
            { text: 'Accepting every bot review comment as-is', bucket: 1 },
            { text: '"show me the real output, not the build log"', bucket: 0 },
          ],
          explain: 'Isolation, checkable finish lines, and real evidence are good. Hand-listed skills, durations, and uncritical review acceptance are pitfalls.',
          hint: 'Check each one against the list of eight.',
        },
        {
          kind: 'spot',
          q: 'This overnight prompt has two problems. Tap both.',
          segments: [
            { text: '/poteto-mode im going to bed. ' },
            { text: 'work on the parser migration for 6 hours', target: true, why: 'A duration is not a finish condition. Say what done means.' },
            { text: ' in a fresh worktree off main. keep a decision log. ' },
            { text: 'use /how, then /architect, then /arena.', target: true, why: 'Enumerating skills overrides the playbook\'s own sequence.' },
            { text: ' /loop until done.' },
          ],
          explain: 'Better: "migrate every caller to the new parser in a fresh worktree off main. done means zero old callers, all parser fixtures pass, old api deleted. keep a decision log. /loop until done."',
          hint: 'One problem is about when it ends. The other is about how it works.',
        },
      ],
    },
    {
      id: 'workbench',
      title: 'Prompt workbench: your project',
      kind: 'learn',
      minutes: 6,
      summary: 'Generate real pstack prompts for your own code.',
      steps: [
        {
          kind: 'read',
          title: 'From course to practice',
          body: `Habits stick from use, not reading. The guide's last line is the right advice: **go back to setup and run one real task.**

Use the workbench below to draft prompts for your own project. Pick what you are trying to do, fill in your details, and copy the result into Cursor.`,
        },
        {
          kind: 'widget',
          title: 'Prompt workbench',
          intro: 'Your project, your words. The workbench adds the pstack ingredients.',
          widget: 'prompt-workbench',
        },
        {
          kind: 'recap',
          title: 'Your first week with pstack',
          points: [
            'Day 1: /add-plugin pstack, /setup-pstack, start a new chat.',
            'Day 1: one small real task through /poteto-mode with a checkable finish condition.',
            'Day 2: /how a subsystem you do not know. /interrogate your own branch.',
            'Day 3+: steer with principle names. Try an overnight contract on something low-risk.',
            'Later: /automate-me to grow your own mode.',
          ],
        },
      ],
    },
    {
      id: 'final-exam',
      title: 'Final exam',
      kind: 'quiz',
      minutes: 7,
      summary: 'Ten questions across the whole course.',
      steps: [
        {
          kind: 'mcq',
          q: 'pstack\'s motto is...',
          options: ['"Slow is smooth, smooth is fast"', '"If you want to go fast, go deep first"', '"Less code, more proof"', '"Measure twice, cut once"'],
          answer: 1,
          explain: 'Depth first. Speed follows. The others sound similar, which is the point: the motto is about where speed comes from.',
          hint: 'It mentions going fast.',
        },
        {
          kind: 'mcq',
          q: 'What two things should every /poteto-mode prompt contain?',
          options: ['A goal and a way to check it', 'A goal and the skills to use', 'A goal and a time limit', 'A goal and the files to change'],
          answer: 0,
          explain: 'Goal plus a checkable finish condition. Listing skills and setting a time limit are both on the pitfall list. Naming files can help, but it is optional.',
          hint: 'Two of these are pitfalls from the last lesson.',
        },
        {
          kind: 'mcq',
          q: 'Which tool digs up the history behind a decision, with citations?',
          options: ['/how', '/why', '/recall', '/teach'],
          answer: 1,
          explain: '/why, the cold-case detective. /how is what the code does now, /recall is your own recent context, and /teach combines /how and /why into one explanation.',
          hint: 'History is a "why" question.',
        },
        {
          kind: 'mcq',
          q: 'Same design brief, several candidates, a judge, pick a base, graft:',
          options: ['/swarm', '/arena', '/interrogate', '/architect'],
          answer: 1,
          explain: 'That is the arena ceremony. /architect *uses* arena for its sketches, but arena is the tool that does the fan-out, judge, pick and graft.',
          hint: '"pick a base, graft" is the giveaway.',
        },
        {
          kind: 'mcq',
          q: 'Which comment survives /no-comments?',
          options: ['// loop over users', '// MIT license header', '// Phase 2: cleanup', '// fixed race condition (see PR #812)'],
          answer: 1,
          explain: 'License headers are on the keep list. "fixed race condition" is history: it belongs in the commit message, where the PR link already lives.',
          hint: 'Where does the story of a fix belong?',
        },
        {
          kind: 'mcq',
          q: 'What does Babysit never do?',
          options: ['Batch fixes into one push', 'Reply to review threads', 'Merge', 'Retry a flaky build once'],
          answer: 2,
          explain: 'It stops at merge-ready. Merging is your decision, and landing is Shipping\'s job.',
          hint: 'Where does Babysit stop?',
        },
        {
          kind: 'mcq',
          q: 'A stack: PR1 ✓, PR2 ✗, PR3 ✓. What does Shipping land?',
          options: ['PR1 only', 'PR1 and PR3', 'All', 'None'],
          answer: 0,
          explain: 'Only the verified run from the bottom. PR3 sits on top of PR2, so landing it would bring PR2\'s unverified code in with it.',
          hint: 'What is underneath PR3?',
        },
        {
          kind: 'mcq',
          q: 'The overnight loop hits a plateau. It should...',
          options: ['Stop and write it up as a dead end', 'Pivot its approach', 'Relax the finish condition', 'Keep trying the same idea with small tweaks'],
          answer: 1,
          explain: 'Plateau means pivot. The idea has run out, not the task. Never relax the goal, and write up a dead end only after the alternatives are gone.',
          hint: 'A plateau is about the idea, not the goal.',
        },
        {
          kind: 'mcq',
          q: '"Make illegal states unrepresentable" is which principle?',
          options: ['Type System Discipline', 'Model the Domain', 'Boundary Discipline', 'Foundational Thinking'],
          answer: 0,
          explain: 'Let the compiler reject impossible states. Model the Domain puts the rules in one structure. Type System Discipline makes the compiler enforce them.',
          hint: 'Who does the "making unrepresentable"?',
        },
        {
          kind: 'mcq',
          q: 'Which command builds a personal mode skill from your history?',
          options: ['/setup-pstack', '/automate-me', '/reflect', '/recall'],
          answer: 1,
          explain: '/automate-me mines your transcripts for your style. /reflect improves skills after one session. /recall catches you up on your work. /setup-pstack picks models.',
          hint: 'It turns how you work into an automated mode.',
        },
      ],
    },
  ],
}
