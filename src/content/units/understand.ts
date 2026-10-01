import type { Unit } from '../types'

export const understand: Unit = {
  id: 'understand',
  index: 4,
  title: 'Understand before you change',
  tagline: '/how, /why, /teach and /recall: four ways into unfamiliar code.',
  icon: '🔍',
  hue: 265,
  image: '/guide/understanding.jpg',
  goals: [
    'Pick between /how, /why, /teach and /recall for a question',
    'Explain why "evidence vs. inference" matters in a /why report',
    'Know when to use the Session pickup playbook',
  ],
  lessons: [
    {
      id: 'how',
      title: '/how: trace what the code does',
      kind: 'learn',
      minutes: 4,
      summary: 'A senior engineer onboarding you onto a subsystem.',
      steps: [
        {
          kind: 'read',
          title: 'Why understanding comes first',
          body: `Editing code you do not understand is how subtle bugs ship. An agent that starts editing without a mental model tends to fix the **symptom** at the first plausible spot.

pstack gives you four ways in:
- \`/how\`: what the code **does** now.
- \`/why\`: **why** it is shaped this way (history).
- \`/teach\`: both, woven into one explanation you actually understand.
- \`/recall\`: rebuild **your own** recent context on a topic.`,
          image: { src: '/guide/understanding.jpg', alt: 'A detective studies a machine blueprint while robots fetch case files for an evidence board.', credit: 'Illustration from the pstack guide (MIT)' },
        },
        {
          kind: 'read',
          title: 'How /how works',
          body: `\`\`\`
/how do we dedupe notifications? is there an n+1 when we look up subscribers?
\`\`\`

Ask the question you actually have. \`/how\` answers at the level of a **senior engineer onboarding you**: the runtime flow, the key types, the non-obvious parts. Not annotated source code.

For a **big** subsystem it first sends out **2 to 4 read-only explorer subagents** in parallel, then a single explainer writes it up. For a narrow question it just reads and explains.

Its output has a predictable shape: **Overview, Key Concepts, How It Works, Where Things Live, Gotchas.**`,
          callout: { tone: 'tip', text: '/how also answers placement questions: "where should this live?", "which package owns this?", "is this the right layer?"' },
        },
        {
          kind: 'mcq',
          q: 'For a large subsystem, what does /how do before explaining?',
          options: [
            'Rewrites the subsystem',
            'Sends out 2 to 4 read-only explorer subagents in parallel',
            'Asks you to draw a diagram',
            'Runs the test suite',
          ],
          answer: 1,
          explain: 'Explorers fan out and read. They are read-only. Then one explainer synthesizes.',
        },
        {
          kind: 'mcq',
          q: 'Which question is a /how question?',
          options: [
            '"Why did we pick Postgres in 2021?"',
            '"Which package should own the new rate limiter?"',
            '"What was I working on last week?"',
            '"Restate that in plain words."',
          ],
          answer: 1,
          explain: 'Placement and ownership questions are /how. History is /why, your own context is /recall, plain restating is /bro.',
        },
      ],
    },
    {
      id: 'why',
      title: '/why: the cold-case detective',
      kind: 'learn',
      minutes: 5,
      summary: 'Digging up the reasons behind the code, with citations.',
      steps: [
        {
          kind: 'read',
          title: 'History has answers',
          body: `\`\`\`
/why was the retry limit set to five? does the reason still hold?
\`\`\`

\`/why\` works like a **detective on a cold case**. It starts from **source control** (git history, PRs), then queries whatever other evidence your tools expose, **all in parallel**:

- issue tracker
- long-form docs
- team chat
- infrastructure observability
- error tracking
- analytics warehouse

It discovers which **MCP servers** (tool connectors) you have at run time and uses them.`,
        },
        {
          kind: 'widget',
          title: 'Run an investigation',
          intro: 'Send investigators out to each evidence source and see what comes back.',
          widget: 'why-detective',
        },
        {
          kind: 'read',
          title: 'Honest reports',
          body: `A good \`/why\` report:

- **Cites everything.**
- **Separates direct evidence from inference.** "PR #812 says X" is evidence. "So the team probably wanted Y" is inference.
- Says **"appears to"** when the record is thin.
- Reports a **null result** too. "Nobody wrote down why" is itself an answer.

\`/how\` and \`/why\` compose. "do why first then how" is a perfectly good prompt when you suspect history explains the mess.`,
        },
        {
          kind: 'sort',
          q: 'Is each statement direct evidence or inference?',
          buckets: ['Direct evidence', 'Inference'],
          items: [
            { text: 'Commit a1b2c3 set the retry limit to 5', bucket: 0 },
            { text: 'The team probably feared overloading the API', bucket: 1 },
            { text: 'Issue #42 reports timeouts after 6 retries', bucket: 0 },
            { text: 'It appears the limit was copied from another service', bucket: 1 },
          ],
          explain: 'Evidence points at a real artifact. Inference is a reasoned guess and should be labeled as one.',
        },
        {
          kind: 'mcq',
          q: '/why searched everywhere and found nothing about the decision. What should it report?',
          options: [
            'Make up a plausible reason',
            'That nobody wrote down why, which is itself an answer',
            'Nothing, and stay silent',
            'Ask you to search manually',
          ],
          answer: 1,
          explain: 'A null result gets reported. Inventing a reason would be the worst outcome.',
        },
      ],
    },
    {
      id: 'teach-recall-pickup',
      title: '/teach, /recall & Session pickup',
      kind: 'learn',
      minutes: 5,
      summary: 'Really understanding, catching up, and taking over.',
      steps: [
        {
          kind: 'read',
          title: '/teach: when a summary is not enough',
          body: `\`\`\`
/teach me how this PR changes retries. convince me it fixes the cause and not the symptom.
\`\`\`

\`/teach\` runs \`/how\` and \`/why\` (for a small change, maybe just one) and weaves the findings into **one plain explanation that builds up diagram by diagram**.

The "**convince me**" framing is worth stealing. It turns a tour into an **argument you can poke at**.`,
          callout: { tone: 'tip', text: 'This course is basically /teach applied to pstack itself.' },
        },
        {
          kind: 'read',
          title: '/recall and Session pickup',
          body: `\`\`\`
/recall catch me up on the export work from last week
\`\`\`

\`/recall\` mines **your own recent chats** plus the shared record (issues, prior fixes, errors still firing) and hands back a short brief: where things stand, what is next.

To resume **one specific** chat or branch, use the **Session pickup** playbook instead:

\`\`\`
/poteto-mode take over this branch. read the decision log, figure out what's done, and continue. don't redo finished work.
\`\`\`

It treats the prior trail as authoritative, rebuilds the state, names the resume point, and verifies inherited claims against the original goal.`,
        },
        {
          kind: 'match',
          q: 'Match the need to the tool.',
          pairs: [
            ['"What does this code do right now?"', '/how'],
            ['"Why was it built this way?"', '/why'],
            ['"Help me really understand this change"', '/teach'],
            ['"Catch me up on my own work on this topic"', '/recall'],
            ['"Continue the branch another agent left mid-flight"', 'Session pickup'],
          ],
          explain: 'Mechanics, history, deep understanding, your own context, and taking over a specific trail.',
        },
        {
          kind: 'recap',
          title: 'Four ways in',
          points: [
            '/how traces behavior. /why digs up history with citations.',
            '/teach weaves both into one explanation. Say "convince me".',
            '/recall rebuilds your context. Session pickup resumes a specific trail.',
            'Running /how first is cheaper than the second bug.',
          ],
        },
      ],
    },
    {
      id: 'understand-quiz',
      title: 'Unit quiz: Understanding code',
      kind: 'quiz',
      minutes: 3,
      summary: 'Five questions.',
      steps: [
        {
          kind: 'mcq',
          q: 'Why does pstack want understanding before editing?',
          options: [
            'It is slower, which is safer',
            'Agents without a traced model tend to fix the symptom at the first plausible spot',
            'Cursor requires it',
            'It saves tokens',
          ],
          answer: 1,
          explain: '/how first is cheaper than the second bug.',
        },
        {
          kind: 'mcq',
          q: 'Where does /why always start looking?',
          options: ['Team chat', 'Source control', 'Analytics warehouse', 'Your browser history'],
          answer: 1,
          explain: 'It starts from source control, then fans out to other sources it discovers.',
        },
        {
          kind: 'mcq',
          q: 'Which phrase turns /teach into an argument you can poke at?',
          options: ['"be brief"', '"convince me"', '"use bullet points"', '"skip the diagrams"'],
          answer: 1,
          explain: '"Convince me it fixes the cause and not the symptom."',
        },
        {
          kind: 'mcq',
          q: 'You come back from vacation and want to know where your export work stands. Best tool?',
          options: ['/why', '/recall', '/arena', '/no-comments'],
          answer: 1,
          explain: '/recall mines your own recent chats and the shared record.',
        },
        {
          kind: 'mcq',
          q: 'A /why report says "the team appears to have chosen 5 to match the upstream API". What does "appears to" signal?',
          options: [
            'Certainty',
            'That this is inference on a thin record, not direct evidence',
            'That the report is broken',
            'A typo',
          ],
          answer: 1,
          explain: 'Honest reports label inference so you know how much weight it carries.',
        },
      ],
    },
  ],
}
