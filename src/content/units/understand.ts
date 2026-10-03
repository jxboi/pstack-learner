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
          q: 'You run `/how do we dedupe notifications?` before changing that code. What should you expect back?',
          options: [
            'The source files, with a comment on every important line',
            'The runtime flow, key concepts, where things live, and gotchas',
            'A proposed fix for the dedupe logic',
            'The commit history that shaped the dedupe logic',
          ],
          answer: 1,
          explain: '/how explains like a senior engineer onboarding you, not like annotated source. It does not change code, so no fix. History is /why\'s job.',
          hint: 'Remember the predictable shape of a /how answer.',
        },
        {
          kind: 'mcq',
          q: 'Which question is a /how question?',
          options: [
            '"Why did we pick Postgres in 2021?"',
            '"Which package should own the new rate limiter?"',
            '"What was I working on last week?"',
            '"Fix the slow subscriber lookup."',
          ],
          answer: 1,
          explain: 'Placement and ownership questions are /how: they are about how the code is organized now. "Why in 2021" is history, so /why. "What was I doing" is /recall. "Fix it" is not an understanding question at all.',
          hint: 'Check the tip on the previous screen.',
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
          explain: 'Evidence points at a real artifact you could open. Inference is a reasoned guess, and the giveaways are words like "probably" and "appears". Inference is fine. Passing it off as evidence is not.',
          hint: 'Could you click on it and see it for yourself?',
        },
        {
          kind: 'mcq',
          q: 'You find `await sleep(500)` before a retry, with no comment. It looks pointless and you want to delete it. What first?',
          options: [
            '/why, to find out if someone added it on purpose',
            'Delete it and see if the tests still pass',
            '/how, to see what the retry code does',
            'Leave it forever, just in case',
          ],
          answer: 0,
          explain: 'Odd-looking code often exists because of a past incident: maybe the server rate-limits instant retries. Tests may not cover that. /why digs through history for the reason. If it finds nothing, that null result is your permission to delete. /how tells you what the code does, which you already know.',
          hint: 'You already know what it does. What you do not know is...',
        },
        {
          kind: 'mcq',
          q: '/why searched everywhere and found nothing about the decision. What should it report?',
          options: [
            'The most plausible reason, clearly worded',
            'That nobody wrote down why',
            'Nothing, since there is no finding',
            'That the choice was probably arbitrary',
          ],
          answer: 1,
          explain: 'A null result gets reported. It is useful: it tells you nobody will be surprised if you change it. Inventing a plausible reason would be the worst outcome, because you would trust it.',
          hint: 'An honest report says what it found, even when that is nothing.',
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
          explain: 'Mechanics, history, deep understanding, your own context, and taking over a specific trail. /recall and Session pickup are easy to mix up: /recall briefs **you**, Session pickup makes the **agent** continue the work.',
          hint: 'Who needs to be caught up: you, or the agent?',
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
            'Slower, more careful work is always safer',
            'Otherwise agents patch the first plausible spot',
            'Agents cannot edit files they have not read first',
            'Reading first uses fewer tokens per task',
          ],
          answer: 1,
          explain: 'An agent that edits without understanding fixes where the symptom shows up, not where it starts. Then you get the second bug. /how first is cheaper. It is not about being slow for its own sake.',
          hint: 'Symptom or cause?',
        },
        {
          kind: 'mcq',
          q: 'Where does /why always start looking?',
          options: ['Team chat', 'Source control', 'The issue tracker', 'The code comments'],
          answer: 1,
          explain: 'It starts from source control (commits and PRs), because every line of code has a commit that added it. Then it fans out to the other sources your tools expose.',
          hint: 'Which source is guaranteed to exist for every line of code?',
        },
        {
          kind: 'mcq',
          q: 'Which phrase turns /teach into an argument you can poke at?',
          options: ['"be thorough"', '"convince me"', '"explain it simply"', '"show your sources"'],
          answer: 1,
          explain: '"Convince me it fixes the cause and not the symptom." turns an explanation into a claim with reasons, which you can push back on. "Be thorough" just gets you a longer tour.',
          hint: 'You want an argument, not a tour.',
        },
        {
          kind: 'mcq',
          q: 'You come back from vacation and want to know where your export work stands. Best tool?',
          options: ['/why', '/recall', 'Session pickup', '/how'],
          answer: 1,
          explain: '/recall briefs **you** on where your work stands, from your recent chats and the shared record. Session pickup would make the agent resume a specific branch. Here you only want to catch up.',
          hint: 'You want a brief for yourself, not an agent taking over.',
        },
        {
          kind: 'mcq',
          q: 'A /why report says "the team appears to have chosen 5 to match the upstream API". What does "appears to" signal?',
          options: [
            'A confirmed fact with a source',
            'An inference from a thin record',
            'That the agent is unsure of its own wording',
            'That several sources disagree',
          ],
          answer: 1,
          explain: 'Honest reports label inference so you know how much weight it carries. Before you rely on it, ask what the inference rests on.',
          hint: 'Evidence or inference?',
        },
      ],
    },
  ],
}
