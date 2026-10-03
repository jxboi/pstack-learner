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

Want to look first? Say: \`/architect with checkpoint. stop and show me before implementing.\`

You will not always type it yourself. Playbooks call \`/architect\` when a change **crosses a function boundary** (it changes how pieces of code talk to each other) or **moves ownership** (code moves to a different module or team). A change inside one function skips it.`,
          image: { src: '/guide/design.jpg', alt: 'Three robots draft competing bridge models while a judge robot inspects them skeptically.', credit: 'Illustration from the pstack guide (MIT)' },
          callout: { tone: 'analogy', text: 'Like an architect sketching how people will walk through a house before pouring the foundation.' },
        },
        {
          kind: 'mcq',
          q: 'In each /architect design sketch, what gets written first?',
          options: ['The tests', "The caller's usage", 'The data types', 'The module map'],
          answer: 1,
          explain: 'Usage first, then types, signatures and the module map. Writing the call site first forces the design to be pleasant for whoever imports it. Start from the types and you tend to get an API shaped around the implementation.',
          hint: 'You told /architect what you "care most about".',
        },
        {
          kind: 'mcq',
          q: 'Which of these bug fixes would make the playbook run /architect first?',
          options: [
            'Fixing an off-by-one inside a single loop',
            'Changing what a shared function returns',
            'Correcting a typo in an error message',
            'Swapping a wrong constant for the right one',
          ],
          answer: 1,
          explain: 'Changing what a shared function returns crosses a function boundary: every caller is affected, so the shape is worth designing. The others stay inside one spot and skip /architect.',
          hint: 'Which change affects code outside the function you edited?',
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
          explain: 'Fan out, judge, pick, graft, verify. The judge scores first, but the coordinator still reads every candidate before picking. Scores inform the pick but do not make it.',
          hint: 'You cannot graft onto a base you have not picked yet.',
        },
        {
          kind: 'mcq',
          q: 'Why use a judge from a different model family?',
          options: [
            'A different family is usually cheaper to run',
            'A model tends to prefer work that looks like its own',
            'It hides which model wrote each candidate',
            'Judges must be stronger than the candidates',
          ],
          answer: 1,
          explain: 'A judge from the same family shares the candidates\' habits and blind spots, so it rates "looks like what I would write" highly. A different family judges more fairly. This idea of model diversity comes back in /interrogate.',
          hint: 'Think about grading your own homework.',
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
          explain: 'Same design brief many times is arena. Partitioned coverage, or a race with a declared selection rule, is swarm. The race is the tricky one: it has competing arms, but the winner is chosen by a rule you set up front, with no judging or grafting.',
          hint: 'Ask: is every worker doing the same task, or a different slice?',
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
          explain: 'A repro confirmed by two models is Act on. A plausible perf concern is Consider. A naming nit is Noted. A guard the boundary already makes redundant is Dismissed, with that reason written down so you can check it.',
          hint: 'How confident is each finding, and how much does it matter?',
        },
        {
          kind: 'mcq',
          q: 'Reviewers A and C, on different model families, each flag the same race condition without seeing each other\'s work. Reviewer B flags 14 style nits. What deserves your attention first?',
          options: [
            'The 14 nits, since B found the most',
            'The race condition both A and C raised',
            'Whatever the strongest model said',
            'Nothing until all three reviewers agree',
          ],
          answer: 1,
          explain: 'Different models have different blind spots. When two of them independently land on the same problem, it is unlikely to be one model\'s quirk. Number of findings is not a measure of importance.',
          hint: 'Count the reviewers that agreed, not the findings.',
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
          explain: 'Scale scrutiny to the cost of being wrong. A cheap, local change gets a quick review. A shape many callers will depend on gets competing designs. An expensive, contested one gets both.',
          hint: 'Start with the matrix (coverage) and the contested design (the heaviest option).',
        },
        {
          kind: 'mcq',
          q: 'You are fixing a typo in an error message. How much design work?',
          options: ['/architect then /interrogate', '/arena with 5 candidates', 'None', '/swarm across all packages'],
          answer: 2,
          explain: 'Most changes need none of it. A wrong typo fix costs a minute to correct, so design work would cost more than it saves. Process should be sized to the change, too.',
          hint: 'What does it cost if you get this one wrong?',
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
          options: ['It costs more tokens than several attempts', 'It locks in the first shape the model thought of', 'The model gets the syntax wrong more often', 'It skips the tests to save time'],
          answer: 1,
          explain: 'First shapes stick. Once code is built on a shape, changing it is expensive, so you want to see alternatives before committing. Competing attempts surface them.',
          hint: 'What is expensive to change later?',
        },
        {
          kind: 'mcq',
          q: 'Where does each arena candidate write its work?',
          options: ['The same shared folder, one at a time', 'Its own worktree', 'A separate branch in the main folder', 'Only in the chat, as a proposal'],
          answer: 1,
          explain: 'Each candidate gets its own worktree, so all of them can run at once without colliding. A branch in the shared folder would still share files. Taking turns would lose the parallelism.',
          hint: 'Remember what happened to two agents in one folder.',
        },
        {
          kind: 'mcq',
          q: 'What three verdicts can a /swarm worker report?',
          options: ['PASS, ISSUES, BLOCKED', 'PASS, FAIL, SKIP', 'Act on, Consider, Dismissed', 'Base, Graft, Discard'],
          answer: 0,
          explain: 'PASS, ISSUES or BLOCKED, aggregated into one report. BLOCKED matters: "could not check" is reported separately, never counted as a pass. Act on/Consider is /interrogate, and base/graft is /arena.',
          hint: 'One of them means "could not even run the check".',
        },
        {
          kind: 'mcq',
          q: 'What does /interrogate apply automatically?',
          options: ['All Act on findings', 'Findings two models agree on', 'Nothing', 'Only small, safe fixes'],
          answer: 2,
          explain: 'It sorts and explains. You decide. Even an Act on finding can be wrong, and the lead reviewer is not an oracle.',
          hint: 'Remember: read the dismissals too.',
        },
        {
          kind: 'mcq',
          q: 'Pitfall check: using /arena to check 12 packages for errors is...',
          options: [
            'Right, as long as the panel has 12 runners',
            'A mistake. That is coverage, so use /swarm',
            'Right, because the judge will catch errors',
            'A mistake. Use /interrogate on each package.',
          ],
          answer: 1,
          explain: 'Arena gives every runner the **same** brief and merges the best one. Twelve runners would each try the whole job. Checking 12 different slices is coverage, and that is swarm.',
          hint: 'Does each package need the same work done 12 times, or different work done once?',
        },
        {
          kind: 'mcq',
          q: 'You want /architect to show you the design before writing code. What do you add?',
          options: ['"with checkpoint"', '"design only"', '"/interrogate first"', '"don\'t merge"'],
          answer: 0,
          explain: '"/architect with checkpoint. stop and show me before implementing." By default /architect goes straight from design into implementation.',
          hint: 'It is the exact phrase from the /architect lesson.',
        },
      ],
    },
  ],
}
