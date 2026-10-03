import type { Unit } from '../types'

export const potetoMode: Unit = {
  id: 'poteto-mode',
  index: 3,
  title: '/poteto-mode: the front door',
  tagline: 'One command that reads your goal and picks the right playbook.',
  icon: '🚪',
  hue: 45,
  image: '/guide/router.jpg',
  goals: [
    'Explain what a playbook is and how /poteto-mode picks one',
    'Write prompts that give a goal and a way to check it',
    'Know when to say "new task", ask for a worktree, or step away',
  ],
  lessons: [
    {
      id: 'one-door',
      title: 'One door, 23 playbooks',
      kind: 'learn',
      minutes: 5,
      summary: 'How your prompt gets routed to the right recipe.',
      steps: [
        {
          kind: 'read',
          title: 'The front door',
          body: `\`/poteto-mode\` is the **main entry point** of pstack. You give it a goal in plain words. It:

1. **Matches** your task to one of **23 playbooks** and opens a todo list whose first items are that playbook's steps, copied in word for word.
2. **Routes** to the other skills as each step needs them.
3. **Writes a clean reply** framed for whoever uses the work and whoever maintains it next.

A **playbook** is a short, numbered checklist for one type of job: a Bug fix, a Feature, a Refactoring, an Investigation, and so on.`,
          image: { src: '/guide/router.jpg', alt: 'A dispatcher routes robots on rail handcars toward lit gates labeled BUG FIX, FEATURE and INVESTIGATION.', credit: 'Illustration from the pstack guide (MIT)' },
          callout: { tone: 'analogy', text: 'A train dispatcher. Your prompt is the train. The dispatcher reads where it needs to go and throws the switch to the right track.' },
        },
        {
          kind: 'widget',
          title: 'Route a prompt',
          intro: 'Pick a sample prompt, or type your own. Watch which playbook lights up and why.',
          widget: 'router',
        },
        {
          kind: 'read',
          title: 'When nothing fits',
          body: `Two special routes:

- **figure-it-out** is for big or cross-cutting work (like a migration across many files), work you will review later after stepping away, or anything no playbook fits. It **designs a custom playbook** for the task and keeps a decision log.
- **Orchestrate** is for a multi-day program with many PRs and lots of subagents under one coordinator chat.

And one playbook runs at the **end of almost every other one**: **Opening a PR**.`,
        },
        {
          kind: 'mcq',
          q: 'You ask: "why was the retry limit set to five? don\'t change anything." Which playbook fits?',
          options: ['Bug fix', 'Feature', 'Investigation', 'Refactoring'],
          answer: 2,
          explain: 'A read-only "why" question with "don\'t change anything" is an Investigation. The output is a cited answer, not code. The other three all change code.',
          hint: 'Will this task change any code?',
        },
        {
          kind: 'mcq',
          q: 'You want to migrate 300 call sites to a new API, and review the result tomorrow. Where does poteto-mode route it?',
          options: ['Feature', 'figure-it-out', 'Investigation', 'Refactoring'],
          answer: 1,
          explain: 'A migration is structural, so Refactoring is tempting. But Refactoring is for focused-to-medium changes. Large cross-cutting work, or work you review after stepping away, goes to figure-it-out, which designs a playbook for the job.',
          hint: 'Two details matter: 300 call sites, and "review tomorrow".',
        },
        {
          kind: 'recap',
          title: 'Front door',
          points: [
            'Playbook = numbered checklist for one type of job. There are 23.',
            'poteto-mode matches, copies the steps into a todo list, and routes to skills.',
            'figure-it-out designs a custom playbook when nothing fits or the work is big.',
            'Opening a PR runs at the end of almost every playbook.',
          ],
        },
      ],
    },
    {
      id: 'todo-list',
      title: 'Read the todo list',
      kind: 'learn',
      minutes: 4,
      summary: "The todo list is your window into the agent's plan.",
      steps: [
        {
          kind: 'widget',
          title: 'Watch a Bug fix todo list fill up',
          intro: 'This replays what you would see after a bug prompt. Watch for the skipped step.',
          widget: 'todo-fill',
        },
        {
          kind: 'read',
          title: 'What the Bug fix playbook demands',
          body: `Notice how strict the Bug fix playbook is:

1. **Reproduce it yourself** first, on the same surface the user saw (the real UI, the real CLI). Asking the user to reproduce is a last resort.
2. **Binary-search the cause.** Make hypotheses, then eliminate them with runtime evidence. No guessing.
3. **Plan the fix.** If it crosses a function boundary, run \`/architect\` first. Then hand the code-writing to a subagent while the main agent stays in the lead.
4. **Verify on the same surface.** "Unit tests pass" is not the same as "the bug is gone".
5. **Tidy the history** so the failing repro commit sits *before* the fix. A reviewer can then check out the first commit, watch it fail, and watch the next one pass. This happens after verifying, when the commits get arranged for review.
6. **Open the PR.**

The reply then states what was broken, the root cause, the fix, and the proof.`,
          callout: { tone: 'key', text: 'Every shipped line must trace back to runtime evidence. A change that "might help" is a hypothesis, not a fix.' },
        },
        {
          kind: 'order',
          q: 'Put the Bug fix playbook steps in order.',
          items: [
            'Reproduce the bug yourself',
            'Binary-search the cause with runtime evidence',
            'Plan the fix and delegate it to a subagent',
            'Verify the original repro now passes',
            'Arrange commits so the failing repro comes first in history',
            'Run Opening a PR',
          ],
          explain: 'Reproduce, find the cause, fix, verify, then arrange the commits for review, then open the PR. Arranging commits is about what the reviewer sees in history, so it happens once the fix is proven.',
          hint: 'You cannot find a cause for a bug you have not seen, and you cannot arrange commits that do not exist yet.',
        },
        {
          kind: 'mcq',
          q: 'The agent added a null check "just in case" and the crash stopped. What would the Bug fix playbook say?',
          options: [
            'Ship it. The crash is gone, which is the evidence.',
            'It is a hypothesis. Find why the value is null.',
            'Keep it, and add null checks nearby to be safe',
            'Ask the user to confirm the crash is gone for them',
          ],
          answer: 1,
          explain: 'The crash stopping is not evidence the cause is gone. The null came from somewhere, and that somewhere may still corrupt data quietly. The playbook calls a "might help" change a hypothesis, and hypotheses do not ship.',
          hint: 'The crash is gone. Is the reason the value was null gone too?',
        },
      ],
    },
    {
      id: 'good-prompts',
      title: 'Say the goal, not the ceremony',
      kind: 'learn',
      minutes: 6,
      summary: 'The anatomy of a great pstack prompt.',
      steps: [
        {
          kind: 'read',
          title: 'Goal + a way to check it',
          body: `You do not write a spec. You say **what is wrong or what you want**, plus **how you will know it is done**, plus anything you already know that saves time.

\`\`\`
/poteto-mode users get two notifications after a retry. repro first, then fix and verify.
\`\`\`

"repro first" is a real constraint, not politeness. The playbook honors it.

When the chat already has the context, prompts can shrink to almost nothing: \`/poteto-mode do it\`, \`continue\`, or \`keep going until done\`. Your words carry the **intent**. The skill carries the **rigor**.`,
        },
        {
          kind: 'widget',
          title: 'Build a better prompt',
          intro: 'Start from a weak prompt and add ingredients. Watch the score climb.',
          widget: 'prompt-grader',
        },
        {
          kind: 'spot',
          q: 'This prompt has a classic pitfall. Tap the part that should be cut.',
          segments: [
            { text: '/poteto-mode ' },
            { text: 'the export writes duplicate rows when a retry lands mid-run. ' },
            { text: 'use /how, then /architect, then /arena, then /tdd. ', target: true, why: 'Listing skills by hand overrides the playbook\'s own order and often drops steps it would have kept.' },
            { text: 'repro first, then fix and verify.' },
          ],
          explain: 'Do not enumerate skills. The playbook already sequences them, and a hand-written list overrides it and often drops steps. Name a skill only to override one specific choice. "repro first" stays: it is a constraint about *what* you want, not a list of tools.',
          hint: 'One part tells the agent how to do its job, step by step.',
        },
        {
          kind: 'multi',
          q: 'Which of these prompts include a checkable finish condition? Select all.',
          options: [
            '"make the dashboard better"',
            '"startup takes 1.8s on this fixture. fix it and show before and after."',
            '"add a --json flag. text output stays byte-identical. verify both."',
            '"work on the parser for a while"',
          ],
          answers: [1, 2],
          explain: '"Before and after" and "byte-identical" can pass or fail. "Better" and "for a while" give the agent nothing to check, so it will stop whenever it feels done.',
          hint: 'For each one, ask: could the agent prove it is finished?',
        },
        {
          kind: 'recap',
          title: 'Prompt recipe',
          points: [
            'Say the goal in your own words.',
            'Add a check that can pass or fail.',
            'Add constraints that matter, like "repro first" or "don\'t change code yet".',
            'Do not list skills. The playbook already orders them.',
          ],
        },
      ],
    },
    {
      id: 'switching-and-stepping-away',
      title: 'New tasks, worktrees & stepping away',
      kind: 'learn',
      minutes: 5,
      summary: 'Three phrases that keep long sessions sane.',
      steps: [
        {
          kind: 'read',
          title: '"new task"',
          body: `A long chat collects context from the last task. When you change subjects, say so:

\`\`\`
/poteto-mode new task. figure out why the cache entry survives logout. don't change any code yet.
\`\`\`

"new task" makes poteto-mode **re-match** a playbook instead of continuing the old one. "don't change any code yet" pins this to **Investigation**. Without these, a mode in the middle of a Feature tends to treat your question as the next feature step.`,
        },
        {
          kind: 'read',
          title: 'Give parallel work its own worktree',
          body: `A **git worktree** is a second checkout of the same repo in a different folder, on its own branch. If several agents share one folder, they overwrite each other. So ask for isolation:

\`\`\`
/poteto-mode new task. branch off main in a fresh worktree, then port the parser change there.
\`\`\`

Worktrees pile up. When disk gets tight: "what's eating my disk? prune the worktrees that are safe to prune." The **Worktree cleanup** playbook only deletes what the evidence clears, and pauses on anything with uncommitted work.`,
          callout: { tone: 'analogy', text: 'Worktrees are like giving each chef their own cutting board, instead of five chefs chopping on one.' },
        },
        {
          kind: 'read',
          title: 'Autonomy: just do it, but pause for the irreversible',
          body: `poteto-mode is built to keep moving:

- **Just do it.** Reversible work (writing code, posting in team chat, updating tickets) proceeds without asking.
- **Always pause** for irreversible actions: force-pushing shared branches, deploys, deleting data, messaging customers.
- **Session overrides.** "don't stop", "going to bed", "run until done" mean keep going.
- **No is an acceptable answer.** If you propose something weak, it should push back. Candor over agreeing.`,
        },
        {
          kind: 'sort',
          q: 'Would poteto-mode just do it, or pause for you first?',
          buckets: ['Just do it', 'Pause first'],
          items: [
            { text: 'Write the fix on a branch', bucket: 0 },
            { text: 'Deploy to production', bucket: 1 },
            { text: 'Split a task into smaller todos', bucket: 0 },
            { text: 'Force-push a shared branch', bucket: 1 },
            { text: 'Delete customer data', bucket: 1 },
            { text: 'Post a status update in team chat', bucket: 0 },
          ],
          explain: 'The test is "can this be undone?". A branch, a todo, or a team-chat post can be fixed after the fact. A deploy, a force-push over teammates\' work, or deleted data cannot. Those always pause.',
          hint: 'For each one, ask: if this is wrong, can it be cleanly undone?',
        },
        {
          kind: 'mcq',
          q: 'You are mid-Feature and ask "why does the cache survive logout?". The agent starts editing cache code. What should you have said?',
          options: [
            'Nothing. The agent misread a clear question.',
            '"new task" and "don\'t change any code yet"',
            '"use /how then /why then /teach"',
            '"/poteto-mode" again before the question',
          ],
          answer: 1,
          explain: '"new task" forces a re-match, and "don\'t change any code yet" pins Investigation. Retyping /poteto-mode does not help: the mode is already on, and it is still mid-Feature. Listing skills is the pitfall from the last lesson.',
          hint: 'The agent thought this was the next step of the feature. What tells it otherwise?',
        },
      ],
    },
    {
      id: 'which-playbook',
      title: 'Practice: which playbook?',
      kind: 'practice',
      minutes: 5,
      summary: 'Match real prompts to the playbook they trigger.',
      steps: [
        {
          kind: 'read',
          title: 'The playbook menu',
          body: `You have met Bug fix, Feature and Investigation. Here are the others you will use most, grouped by what they are for. You do not need to memorize them: /poteto-mode does the matching. Knowing the menu helps you notice when it picked the wrong one.

**Build**
- **Refactoring**: change structure, not behavior. Pins current behavior first.
- **Prototype**: throwaway sketches to make a design decision cheaply.

**Diagnose**
- **Perf issue**: a measured slowness, fixed against a before/after.
- **Hillclimb**: push one number toward a target over many attempts.
- **Runtime forensics**: a live symptom, like a memory leak or a CPU that never idles.

**Ship**
- **Babysit**: drive an open PR to merge-ready. It never merges.
- **Shipping**: verify a stack independently, then land it.

**Run**
- **Session pickup**: take over work another chat left mid-flight.
- **Worktree cleanup**: free disk by pruning old worktrees safely.`,
          callout: { tone: 'tip', text: 'The Toolbox page lists all 23 playbooks with example prompts.' },
        },
        {
          kind: 'match',
          q: 'Match each prompt to its playbook.',
          pairs: [
            ['"startup takes 1.8s. trace it, show before and after."', 'Perf issue'],
            ['"move parsing into one module, zero behavior change."', 'Refactoring'],
            ['"babysit this pr. get it green."', 'Babysit'],
            ['"take over this branch. read the decision log and continue."', 'Session pickup'],
          ],
          explain: 'Measured slowness is Perf issue, structure-only is Refactoring, getting a PR green is Babysit, resuming prior work is Session pickup.',
          hint: 'Look for the signal words: "before and after", "zero behavior change", "green", "take over".',
        },
        {
          kind: 'match',
          q: 'One more round.',
          pairs: [
            ['"prototype three settings layouts so we can pick."', 'Prototype'],
            ['"land the stack."', 'Shipping'],
            ['"the app idles at 30% cpu. find out why."', 'Runtime forensics'],
            ['"what\'s eating my disk?"', 'Worktree cleanup'],
          ],
          explain: 'Throwaway design sketches are Prototype. Landing is Shipping. A live symptom is Runtime forensics. Disk is Worktree cleanup.',
          hint: '"land" is a shipping word. "idles at 30%" is a symptom you watch live.',
        },
        {
          kind: 'mcq',
          q: 'What is the difference between Babysit and Shipping?',
          options: [
            'Babysit handles one PR, Shipping handles a stack',
            'Babysit stops at merge-ready. Shipping verifies and lands.',
            'Babysit merges, Shipping deploys to production',
            'Babysit fixes CI, Shipping fixes review comments',
          ],
          answer: 1,
          explain: 'Babysit stops at merge-ready because merging is a separate decision that belongs to you. Shipping begins where Babysit ends: it re-verifies with fresh agents, then lands. Both can work on single PRs or stacks.',
          hint: 'Which of the two is allowed to merge?',
        },
        {
          kind: 'mcq',
          q: '"Improve the p95 search latency again and again until it\'s under 120ms, at least 10 attempts." Which playbook?',
          options: ['Perf issue', 'Hillclimb', 'Feature', 'Eval'],
          answer: 1,
          explain: 'Perf issue is tempting because it is about speed. But "again and again", a target, and a minimum number of attempts describe Hillclimb: many measured tries at one number. Perf issue is one traced fix.',
          hint: 'Notice "again and again" and "at least 10 attempts".',
        },
      ],
    },
    {
      id: 'poteto-mode-quiz',
      title: 'Unit quiz: /poteto-mode',
      kind: 'quiz',
      minutes: 4,
      summary: 'Six questions on routing and prompting.',
      steps: [
        {
          kind: 'mcq',
          q: 'What is the first thing /poteto-mode does with your prompt?',
          options: [
            'Runs /how to understand the code it will touch',
            'Matches a playbook and copies its steps into a todo list',
            'Asks you clarifying questions about the goal',
            'Picks which model should handle the whole task',
          ],
          answer: 1,
          explain: 'Match first, then copy the playbook\'s steps in word for word. /how may well run next, but only because the playbook says so.',
          hint: 'Everything else happens because of the step that comes first.',
        },
        {
          kind: 'mcq',
          q: 'Why can a prompt as short as "continue" work?',
          options: [
            'The agent remembers your last long prompt and repeats it',
            'The mode is sticky and the playbook already holds the structure',
            'Short prompts make the agent work faster',
            'It only works right after a new chat starts',
          ],
          answer: 1,
          explain: 'Your words carry intent. The playbook carries the rigor. Once the todo list exists, "continue" just means "do the next item".',
          hint: 'Where do the steps live, if not in your message?',
        },
        {
          kind: 'mcq',
          q: 'Which phrase makes poteto-mode re-match instead of continuing the last playbook?',
          options: ['"stop"', '"new task"', '"/poteto-mode" again', '"reset"'],
          answer: 1,
          explain: '"new task" signals a subject change, so it matches a playbook from scratch. Retyping /poteto-mode keeps the old playbook going, because the mode is already on.',
          hint: 'It is the exact phrase from the "New tasks" lesson.',
        },
        {
          kind: 'mcq',
          q: 'Two agents work in the same folder and keep overwriting each other. The fix?',
          options: [
            'Put each agent on its own branch in the same folder',
            'Give each its own git worktree',
            'Make them take turns editing',
            'Add a lock file so only one writes at a time',
          ],
          answer: 1,
          explain: 'Separate branches in **one folder** still share one set of files on disk, so they still collide. A worktree is a separate folder. Taking turns and locks work, but they make parallel agents wait for each other. Separate the shared thing first.',
          hint: 'A branch is a label. What do two agents physically write to?',
        },
        {
          kind: 'mcq',
          q: 'Which of these would poteto-mode always pause for?',
          options: ['Writing a test', 'Posting a status update in team chat', 'A production deploy', 'Rewriting a module on a branch'],
          answer: 2,
          explain: 'Deploys reach real users and cannot be cleanly taken back. A team-chat post feels public, but it is internal and easy to correct, so it proceeds. A big rewrite on a branch is still just a branch.',
          hint: 'Big or public is not the test. Can it be undone?',
        },
        {
          kind: 'mcq',
          q: 'You propose a feature the agent thinks is a bad idea. What does poteto-mode do?',
          options: [
            'Builds it, since you are the one in charge',
            'Says plainly that it doesn\'t earn its place, and why',
            'Builds a smaller version without telling you',
            'Asks you a few questions until you change your mind',
          ],
          answer: 1,
          explain: '"No is an acceptable answer." Candor over agreeing. Quietly shrinking it is worse than either building it or pushing back, because you do not find out.',
          hint: 'One of the autonomy rules was about honesty.',
        },
      ],
    },
  ],
}
