import type { Unit } from '../types'

export const overnight: Unit = {
  id: 'overnight',
  index: 8,
  title: 'Run work while you sleep',
  tagline: 'A checkable finish line, an isolated worktree, and a log you audit over coffee.',
  icon: '🌙',
  hue: 235,
  image: '/guide/overnight.jpg',
  goals: [
    'Write an overnight contract with a real finish condition',
    'Read a decision log the next morning',
    'Pick between Autopilot-full, Autopilot-stack and Orchestrate',
  ],
  lessons: [
    {
      id: 'contract',
      title: 'The overnight contract',
      kind: 'learn',
      minutes: 6,
      summary: 'Five lines that make an unattended run safe.',
      steps: [
        {
          kind: 'read',
          title: 'Trust is engineered, not hoped for',
          body: `This is the payoff of everything so far. An agent you can trust to verify its own work is an agent you can **leave alone** with a hard task.

What makes that safe is not hope. It is:
- a **checkable finish condition**,
- an **isolated worktree**,
- a **decision log** you audit in the morning.`,
          image: { src: '/guide/overnight.jpg', alt: 'She waves goodnight while robots keep the factory running and update a DECISION LOG board.', credit: 'Illustration from the pstack guide (MIT)' },
        },
        {
          kind: 'widget',
          title: 'Write the contract',
          intro: 'Add lines to the contract and see what each one buys you.',
          widget: 'overnight-contract',
        },
        {
          kind: 'mcq',
          q: '"Work on this for 4 hours" is a bad finish condition because...',
          options: [
            '4 hours is not enough time for a hard task',
            'There is nothing to check, so you get activity, not a result',
            'The agent will stop early to save tokens',
            'It should be split into four separate 1-hour runs',
          ],
          answer: 1,
          explain: 'After 4 hours, "did it work?" still has no answer. A condition like "zero old callers and all fixtures pass" can pass or fail, so the agent knows when it is done, and so do you.',
          hint: 'At 4 hours and 1 minute, how would you know whether it succeeded?',
        },
        {
          kind: 'mcq',
          q: 'Your overnight prompt ends with "/loop until done". What does /loop check each time it wakes the agent?',
          options: [
            'The finish condition you wrote',
            'Whether the agent says it is finished',
            'Whether the build is green',
            'How much time has passed',
          ],
          answer: 0,
          explain: '/loop (built into Cursor, not pstack) keeps waking the agent until **your** finish condition holds. That is why the condition must be checkable. The agent saying "done" and a green build are the proxies you learned to distrust.',
          hint: 'This is why the contract needs a condition that can pass or fail.',
        },
      ],
    },
    {
      id: 'loop-and-log',
      title: 'The loop & the decision log',
      kind: 'learn',
      minutes: 6,
      summary: 'One change, one check, one log row. Every iteration.',
      steps: [
        {
          kind: 'widget',
          title: 'Watch a night run',
          intro: 'Each iteration makes one change, verifies it, then commits or discards, and logs a row.',
          widget: 'night-loop',
        },
        {
          kind: 'read',
          title: 'Rules of the loop',
          body: `- One change, one check, one log row, every iteration.
- Changes that did not help get **discarded**, not left to ride.
- A **plateau means pivot**, not stop.
- The finish condition **never quietly relaxes** to declare victory.
- A genuine dead end gets **written up**, not spun on for hours.`,
        },
        {
          kind: 'read',
          title: 'The morning audit',
          body: `\`/show-me-your-work\` keeps the trail: a **TSV file** (tab-separated, one row per decision) with columns:

\`ts\` · \`phase\` · \`decision\` · \`why\` · \`evidence\` · \`result\`

It stays local by default, in \`decisions.tsv\` (or \`.audit/<task-slug>.tsv\`). Commit it when a reviewer needs the trail to trust the result.

In the morning: \`/show-me-your-work catch me up on what you did last night\`. Before replying, it has a **reviewer on a different model family** read the trail, and the reply ends with an **Attention** section. **Read that first.** You are auditing decisions, not rereading the whole night.`,
        },
        {
          kind: 'mcq',
          q: 'What belongs in the `evidence` column of a decision log row?',
          options: [
            'A paragraph explaining the reasoning',
            'A pointer, like a commit SHA or file:line',
            'The agent\'s confidence level, from low to high',
            'A copy of the full command output',
          ],
          answer: 1,
          explain: 'Evidence is a pointer you can follow, not prose. Reasoning belongs in the `why` column. Full output would break the one-line-per-row format, so point at a file that holds it.',
          hint: 'There is already a column for reasoning.',
        },
        {
          kind: 'mcq',
          q: 'What should you read first in the morning?',
          options: ['Every log row from the top', 'The Attention section', 'The git log', 'The final diff'],
          answer: 1,
          explain: 'A reviewer on a different model family has already read the whole trail and flagged what deserves your scrutiny. Start there, then dig into the rows it points at.',
          hint: 'You are auditing decisions, not rereading the whole night.',
        },
      ],
    },
    {
      id: 'queues',
      title: 'Queues & programs',
      kind: 'learn',
      minutes: 5,
      summary: 'Autopilot-full, Autopilot-stack and Orchestrate.',
      steps: [
        {
          kind: 'read',
          title: 'When the night holds more than one task',
          body: `**Autopilot-full** runs a **queue of independent PRs to merged**. Each PR has **one owner agent** from build to merge, and **no owner merges on its own verdict**. A swarm of fresh verifiers checks the code-ready head, and again after any push that changes the patch.

**Autopilot-stack** runs the same owner loop but **ships nothing**. You wake up to **one linear stack** with a verdict on every link, and you land it yourself. Pick it when the changes are coupled, or you want your own eyes on it first.

**Orchestrate** is for a **multi-day program**: many stacked PRs, fleets of subagents, one standing **coordinator** chat that writes briefs and **never writes code itself**. It is heavy machinery. If one agent could finish in a session, it routes you back to the simple overnight contract.`,
        },
        {
          kind: 'match',
          q: 'Match the request to the playbook.',
          pairs: [
            ['"full autopilot on this queue. merged by morning."', 'Autopilot-full'],
            ['"autopilot these five but stack them, don\'t ship."', 'Autopilot-stack'],
            ['"own the store migration until every package is merged."', 'Orchestrate'],
            ['"migrate every caller tonight. done means zero old callers."', 'Autonomous run (overnight contract)'],
          ],
          explain: 'Independent queue to merged, coupled stack for you to land, multi-day program, single task to a predicate.',
          hint: 'Look for "merged", "don\'t ship", "until every package", and "done means".',
        },
        {
          kind: 'mcq',
          q: 'In Orchestrate, what does the coordinator never do?',
          options: ['Write briefs', 'Collect finished work', 'Write code itself', 'Keep the lowest PR green'],
          answer: 2,
          explain: 'The coordinator coordinates. Subagents write code. A coordinator deep in code has stopped watching the program, and its chat fills with detail it does not need.',
          hint: 'Which of these would fill the coordinator\'s chat with detail?',
        },
      ],
    },
    {
      id: 'overnight-quiz',
      title: 'Unit quiz: Overnight',
      kind: 'quiz',
      minutes: 4,
      summary: 'Five questions.',
      steps: [
        {
          kind: 'multi',
          q: 'Which three things make an unattended run safe? Select three.',
          options: ['A checkable finish condition', 'The strongest available model', 'An isolated worktree', 'A decision log', 'A time limit, like "stop after 6 hours"'],
          answers: [0, 2, 3],
          explain: 'Finish condition, isolation, and an auditable trail. A strong model still needs to know when it is done. A time limit is the duration trap from the contract lesson.',
          hint: 'One wrong option is the trap from the first overnight lesson.',
        },
        {
          kind: 'mcq',
          q: 'What does "don\'t ask me before committing" do in the contract?',
          options: [
            'Lets the agent push straight to main',
            'Pre-answers a question that would stop the run',
            'Turns off the decision log',
            'Tells the agent to commit only at the end',
          ],
          answer: 1,
          explain: 'Without it, the agent may stop at 1 a.m. to ask "can I commit?" and wait until morning. Pre-answering it keeps the run moving. Commits stay on the worktree branch, so they are easy to undo.',
          hint: 'Picture the agent at 1 a.m. with nobody awake to answer.',
        },
        {
          kind: 'mcq',
          q: 'Five attempts in a row did not move the metric. What does the loop do?',
          options: ['Stop and write up a dead end', 'Pivot to a different approach', 'Lower the target to what it reached', 'Try a sixth variation of the same idea'],
          answer: 1,
          explain: 'A plateau means pivot: the current idea has run out, not the task. The goal never relaxes. A write-up is for a genuine dead end, after the alternatives are gone, not after one idea stalls.',
          hint: 'Five failures of one idea say something about the idea, not the goal.',
        },
        {
          kind: 'mcq',
          q: 'In the morning, a log row reads: decision "switched to the streaming parser", why "faster", evidence empty. What do you do?',
          options: [
            'Accept it, since the why column explains it',
            'Treat it as unproven, and ask for the measurement',
            'Revert it, since every row needs a commit',
            'Ignore it, since only the Attention section matters',
          ],
          answer: 1,
          explain: '"faster" is a claim. With no pointer to a benchmark or commit, nothing backs it. That is not automatically wrong, so do not revert blindly. Ask for the evidence.',
          hint: 'Which column turns a claim into something you can check?',
        },
        {
          kind: 'mcq',
          q: 'Five coupled changes, and you want to review before anything merges. Which playbook?',
          options: ['Autopilot-full', 'Autopilot-stack', 'Orchestrate', 'Babysit'],
          answer: 1,
          explain: 'Autopilot-stack builds and verifies but ships nothing. You land it. Autopilot-full would merge independent PRs on its own. Orchestrate is for multi-day programs.',
          hint: '"Coupled" and "before anything merges" are the key words.',
        },
      ],
    },
  ],
}
