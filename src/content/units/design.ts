import type { Unit } from '../types'

export const design: Unit = {
  id: 'design',
  index: 5,
  title: 'Design before you code',
  tagline: '/architect, /arena, /swarm and /interrogate: many minds before one shape.',
  icon: '🏗️',
  hue: 15,
  image: '/guide/design.jpg',
  goals: [
    'Explain why one attempt at a hard design is risky',
    'Tell /arena and /swarm apart instantly',
    'Read an /interrogate report and its four buckets',
  ],
  lessons: [
    {
      id: 'architect',
      title: '/architect: settle the shape',
      kind: 'learn',
      minutes: 4,
      summary: 'Types, signatures and module boundaries before implementation.',
      steps: [
        {
          kind: 'read',
          title: 'First shapes stick',
          body: `One attempt at a hard design **locks in the first shape the model thought of**. Changing that shape later is expensive.

\`\`\`
/architect design the import pipeline before writing any code. i care most about how callers use it.
\`\`\`

\`/architect\`:
1. **Grounds itself** with \`/how\` over the code the design touches (and \`/why\` when ownership moves).
2. Runs \`/arena\` to produce **competing design sketches**. Each sketch writes the **caller's usage first**, then types, signatures and a module map.
3. By default it **proceeds straight into implementation** from the merged design.

Want to look first? Say: \`/architect with checkpoint. stop and show me before implementing.\``,
          image: { src: '/guide/design.jpg', alt: 'Three robots draft competing bridge models while a judge robot inspects them skeptically.', credit: 'Illustration from the pstack guide (MIT)' },
          callout: { tone: 'analogy', text: 'Like an architect sketching how people will walk through a house before pouring the foundation.' },
        },
        {
          kind: 'mcq',
          q: 'In each /architect design sketch, what gets written first?',
          options: ['The tests', "The caller's usage", 'The database schema', 'The README'],
          answer: 1,
          explain: 'Starting from how callers use it keeps the design honest about the experience of whoever imports it.',
        },
        {
          kind: 'mcq',
          q: 'When does poteto-mode trigger /architect on its own?',
          options: [
            'For every single change',
            'When code crosses a function boundary or moves ownership',
            'Only when you type /architect',
            'Never',
          ],
          answer: 1,
          explain: 'Boundary-crossing work triggers /architect automatically.',
        },
      ],
    },
    {
      id: 'arena',
      title: '/arena: many attempts, one winner',
      kind: 'learn',
      minutes: 5,
      summary: 'Parallel candidates, a cross-judge, then grafting.',
      steps: [
        {
          kind: 'read',
          title: 'Same brief, N attempts',
          body: `\`/arena\` gives the **same task** to **N subagents in parallel**. Each writes in its **own worktree** so nobody collides.

Then:
1. A **read-only judge**, on a different model family when possible, scores every candidate against a rubric.
2. The coordinator **reads every candidate end to end** and **picks a base**.
3. It **grafts** the best ideas from the losers into the base.
4. It **verifies** the result.

The panel comes from your setup. Ask for more candidates when it matters: \`/arena this, 5 candidates. the cache key format is expensive to change later.\``,
        },
        {
          kind: 'widget',
          title: 'Run an arena',
          intro: 'Three candidates designed a cache key. You are the coordinator: read the judge\'s scores, pick a base, graft one idea.',
          widget: 'arena-sim',
        },
        {
          kind: 'order',
          q: 'Put the arena flow in order.',
          items: ['One task goes to the configured panel', 'Candidates work in parallel', 'Cross-judge scores them', 'Pick a base', 'Graft the best parts', 'Verify'],
          explain: 'Fan out, judge, pick, graft, verify.',
        },
        {
          kind: 'mcq',
          q: 'Why use a judge from a different model family?',
          options: [
            'It is cheaper',
            'A model tends to favor its own style. A different family has different blind spots.',
            'Cursor requires it',
            'It writes better code',
          ],
          answer: 1,
          explain: 'Model diversity is a recurring pstack idea: different models catch different things.',
        },
      ],
    },
    {
      id: 'swarm',
      title: '/swarm: divide and cover',
      kind: 'learn',
      minutes: 4,
      summary: 'Many workers, different slices, one report.',
      steps: [
        {
          kind: 'read',
          title: 'Coverage, not synthesis',
          body: `\`\`\`
/swarm check every package under packages/ against its check.sh. one worker per package. one report.
\`\`\`

\`/swarm\` sends **N workers across different slices**: packages, features, test lanes, or the arms of a race. Each gets its own scope and check, then reports **PASS**, **ISSUES**, or **BLOCKED**. The parent waits for all of them and returns **one compact report**, including any gaps or dropouts.

No base picking, no grafting. That is the arena ceremony, and swarm skips it.`,
          callout: { tone: 'key', text: '/arena = same brief, many attempts, merge the best. /swarm = different slices, one report.' },
        },
        {
          kind: 'widget',
          title: 'Release the swarm',
          intro: 'Each worker owns one package. Watch the verdicts arrive and the report assemble.',
          widget: 'swarm-sim',
        },
        {
          kind: 'sort',
          q: 'Arena or swarm?',
          buckets: ['/arena', '/swarm'],
          items: [
            { text: 'Three takes on the name and shape of a new API', bucket: 0 },
            { text: 'Run check.sh in each of 12 packages', bucket: 1 },
            { text: 'Verify every feature in the app\'s feature map', bucket: 1 },
            { text: 'Competing designs for the cache key format', bucket: 0 },
            { text: 'Race two install strategies with a rule declared up front', bucket: 1 },
          ],
          explain: 'Same design brief many times is arena. Partitioned coverage, or a race with a declared selection rule, is swarm.',
        },
      ],
    },
    {
      id: 'interrogate',
      title: '/interrogate: let other models break it',
      kind: 'learn',
      minutes: 5,
      summary: 'Adversarial multi-model review with four buckets.',
      steps: [
        {
          kind: 'read',
          title: 'Different models, different blind spots',
          body: `\`\`\`
/interrogate the whole branch, but skeptically. no nitpicks unless it's an actual bug or regression.
\`\`\`

\`/interrogate\` sends the **same diff, intent and rubric** to several reviewers on **different model families**, plus a strict code-quality lens. A finding that **two models raise independently** is high-confidence signal.

The lead reviewer sorts every finding into four buckets:
- **Act on**: real problems worth fixing.
- **Consider**: plausible, worth a look.
- **Noted**: true but minor.
- **Dismissed**: with a reason for each.

It **applies nothing automatically**. Read the dismissals too. The lead is a pragmatic senior engineer, not an oracle.`,
        },
        {
          kind: 'sort',
          q: 'You are the lead. Sort these review findings.',
          buckets: ['Act on', 'Consider', 'Noted', 'Dismissed'],
          items: [
            { text: 'Two models: retry can write a duplicate row (repro attached)', bucket: 0 },
            { text: 'One model: this loop might be slow for very large inputs', bucket: 1 },
            { text: 'Variable name `tmp` could be clearer', bucket: 2 },
            { text: '"Add a null check here" but the boundary already validates it', bucket: 3 },
          ],
          explain: 'A repro confirmed by two models is Act on. A plausible perf concern is Consider. A naming nit is Noted. A guard the boundary already makes redundant is Dismissed, with that reason.',
        },
        {
          kind: 'mcq',
          q: 'Why is a finding raised independently by two different models especially valuable?',
          options: [
            'Two is more than one',
            'Different models have different blind spots, so independent agreement is strong signal',
            'It means the code is broken beyond repair',
            'It is not more valuable',
          ],
          answer: 1,
          explain: 'Model diversity is the whole point of /interrogate.',
        },
      ],
    },
    {
      id: 'design-ladder',
      title: 'Practice: how much design?',
      kind: 'practice',
      minutes: 4,
      summary: 'Most changes need none of this. Some need all of it.',
      steps: [
        {
          kind: 'widget',
          title: 'Climb the design ladder',
          intro: 'Pick a situation and see how much design scrutiny it earns.',
          widget: 'design-ladder',
        },
        {
          kind: 'match',
          q: 'Match the situation to the right amount of design work.',
          pairs: [
            ['A small finished change you are unsure about', '/interrogate alone'],
            ['A change that crosses function boundaries', '/architect (brings /arena)'],
            ['A standalone naming or format decision', '/arena directly'],
            ['A matrix of parallel checks', '/swarm'],
            ['A contested design that is expensive to reverse', '/architect, then /interrogate'],
          ],
          explain: 'Scale scrutiny to the cost of being wrong.',
        },
        {
          kind: 'mcq',
          q: 'You are fixing a typo in an error message. How much design work?',
          options: ['/architect then /interrogate', '/arena with 5 candidates', 'None', '/swarm across all packages'],
          answer: 2,
          explain: 'Most changes need none of it. Laziness Protocol applies to process too.',
        },
      ],
    },
    {
      id: 'design-quiz',
      title: 'Unit quiz: Design',
      kind: 'quiz',
      minutes: 4,
      summary: 'Six questions.',
      steps: [
        {
          kind: 'mcq',
          q: 'What is the main risk of a single attempt at a hard design?',
          options: ['It costs too much', 'It locks in the first shape the model thought of', 'It is too slow', 'There is no risk'],
          answer: 1,
          explain: 'First shapes stick. Competing attempts surface alternatives.',
        },
        {
          kind: 'mcq',
          q: 'Where does each arena candidate write its work?',
          options: ['The same shared folder', 'Its own worktree or directory', 'A Google Doc', 'Nowhere, it only talks'],
          answer: 1,
          explain: 'Separate before serializing. Each candidate is isolated.',
        },
        {
          kind: 'mcq',
          q: 'What three verdicts can a /swarm worker report?',
          options: ['PASS, ISSUES, BLOCKED', 'Red, Yellow, Green', 'Act on, Consider, Dismissed', 'Merged, Open, Closed'],
          answer: 0,
          explain: 'PASS, ISSUES or BLOCKED, aggregated into one report.',
        },
        {
          kind: 'mcq',
          q: 'What does /interrogate apply automatically?',
          options: ['All Act on findings', 'Everything', 'Nothing', 'Only lint fixes'],
          answer: 2,
          explain: 'It sorts and explains. You decide.',
        },
        {
          kind: 'mcq',
          q: 'Pitfall check: using /arena to check 12 packages for errors is...',
          options: ['Correct', 'A mistake. That is coverage, so use /swarm', 'Fine if you use 12 candidates', 'Required'],
          answer: 1,
          explain: 'Arena repeats one brief and grafts. Coverage of slices is swarm.',
        },
        {
          kind: 'mcq',
          q: 'You want /architect to show you the design before writing code. What do you add?',
          options: ['"with checkpoint"', '"be careful"', '"no code"', '"/pause"'],
          answer: 0,
          explain: '"/architect with checkpoint. stop and show me before implementing."',
        },
      ],
    },
  ],
}
