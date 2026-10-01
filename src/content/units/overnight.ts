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
            '4 hours is too short',
            'A duration gives the agent nothing to check. You wake up to motion, not a result.',
            'Agents cannot tell time',
            'It is too polite',
          ],
          answer: 1,
          explain: 'Give /loop a predicate that can pass or fail.',
        },
        {
          kind: 'mcq',
          q: 'What is `/loop`?',
          options: [
            'A pstack skill',
            "Cursor's built-in wake mechanism that re-checks the finish condition",
            'A JavaScript keyword',
            'A type of playbook',
          ],
          answer: 1,
          explain: '/loop is built into Cursor, not pstack. The Autonomous run playbook uses it.',
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
            'A long paragraph explaining everything',
            'A pointer: commit SHA, PR number, file:line, or an artifact path',
            'The agent\'s feelings',
            'Nothing',
          ],
          answer: 1,
          explain: 'Evidence is a pointer, not prose. Cells stay single-line.',
        },
        {
          kind: 'mcq',
          q: 'What should you read first in the morning?',
          options: ['Every log row from the top', 'The Attention section', 'The git log', 'Nothing, just merge'],
          answer: 1,
          explain: 'A different-family reviewer flags what deserves your scrutiny.',
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
        },
        {
          kind: 'mcq',
          q: 'In Orchestrate, what does the coordinator never do?',
          options: ['Write briefs', 'Collect finished work', 'Write code itself', 'Keep the lowest PR green'],
          answer: 2,
          explain: 'The coordinator coordinates. Subagents write code.',
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
          options: ['A checkable finish condition', 'Hope', 'An isolated worktree', 'A decision log', 'A very long prompt'],
          answers: [0, 2, 3],
          explain: 'Finish condition, isolation, and an auditable trail.',
        },
        {
          kind: 'mcq',
          q: 'What does "don\'t ask me before committing" do in the contract?',
          options: [
            'Disables git',
            'Pre-answers a permission the agent would otherwise block on',
            'Makes commits slower',
            'Nothing',
          ],
          answer: 1,
          explain: 'It removes a block. Never Block on the Human, made explicit.',
        },
        {
          kind: 'mcq',
          q: 'Five attempts in a row did not move the metric. What does the loop do?',
          options: ['Stop and report success', 'Pivot to a different approach', 'Relax the goal', 'Keep the five changes'],
          answer: 1,
          explain: 'A plateau means pivot. The goal never relaxes.',
        },
        {
          kind: 'mcq',
          q: 'What format is the decision log?',
          options: ['JSON', 'TSV, one row per decision', 'A Word doc', 'Screenshots'],
          answer: 1,
          explain: 'ts, phase, decision, why, evidence, result.',
        },
        {
          kind: 'mcq',
          q: 'Five coupled changes, and you want to review before anything merges. Which playbook?',
          options: ['Autopilot-full', 'Autopilot-stack', 'Orchestrate', 'Babysit'],
          answer: 1,
          explain: 'Autopilot-stack builds and verifies but ships nothing. You land it.',
        },
      ],
    },
  ],
}
