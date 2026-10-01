import type { Unit } from '../types'

export const principles: Unit = {
  id: 'principles',
  index: 9,
  title: 'The 23 principles',
  tagline: 'Short names that redirect an agent better than a paragraph.',
  icon: '🧭',
  hue: 185,
  goals: [
    'Explain why principle names work as steering words',
    'Recognize each of the 23 principles from a scenario',
    'Use a principle name to redirect a drifting agent',
  ],
  lessons: [
    {
      id: 'steer-with-names',
      title: 'Steer with names',
      kind: 'learn',
      minutes: 4,
      summary: 'One phrase, one complete rule the agent already read.',
      steps: [
        {
          kind: 'read',
          title: 'Principles are vocabulary',
          body: `pstack ships **23 principles**, each as its own small skill. \`/poteto-mode\` reads their index at the start of every multi-step task, applies the ones the task triggers, and **names each one in its reply along with the decision it changed**.

**You do not invoke principles. You use their names to steer.** Each name points at a full rule the agent has already read, so one phrase redirects it more precisely than a paragraph.

\`\`\`
use subtract before you add. delete the obsolete adapters first, then design what's left.
\`\`\`

\`\`\`
apply prove it works. run the real import flow and show me the written records.
\`\`\``,
          callout: { tone: 'warn', text: 'A principle cited with no decision behind it is a tell. The agent name-dropped instead of applying it.' },
        },
        {
          kind: 'read',
          title: 'Five families',
          body: `- **Core (10)**: how much to build and when to rethink.
- **Architecture (6)**: where state, validation and compatibility live.
- **Verification (4)**: what counts as proof.
- **Delegation (2)**: keeping parallel work sane.
- **Meta (1)**: turning repeated lessons into rules.

Don't memorize the list. Skim it now, then come back when you catch an agent doing something a name would have prevented. That is how the vocabulary sticks.`,
        },
        {
          kind: 'widget',
          title: 'Flip through the deck',
          intro: 'Filter by family. Flip a card to see the plain-English rule, an example, and a steering phrase.',
          widget: 'principle-cards',
        },
        {
          kind: 'mcq',
          q: 'The agent\'s reply says "Applied Laziness Protocol." but no decision changed. What does that suggest?',
          options: [
            'Perfect application',
            'It name-dropped the principle instead of applying it',
            'Laziness Protocol is broken',
            'You should never use principles',
          ],
          answer: 1,
          explain: 'Each cited principle should come with the specific choice it changed.',
        },
      ],
    },
    {
      id: 'core',
      title: 'Core principles',
      kind: 'practice',
      minutes: 6,
      summary: 'Ten rules for how much to build.',
      steps: [
        {
          kind: 'match',
          q: 'Match the core principle to its idea.',
          pairs: [
            ['Laziness Protocol', 'Smallest change that solves it. Prefer deletion.'],
            ['Foundational Thinking', 'Pick the data shape before writing logic'],
            ['Subtract Before You Add', 'Remove dead weight first, then build'],
            ['Build the Lever', 'Write the script that does or proves the work'],
            ['Exhaust the Design Space', 'Build 2 or 3 different prototypes when there is no precedent'],
          ],
          explain: 'These five come up constantly in everyday work.',
        },
        {
          kind: 'match',
          q: 'And the other five.',
          pairs: [
            ['Redesign from First Principles', 'Fit a new requirement as if it had always been there'],
            ['Attack the Premise', 'Two failed fixes share an assumption. Question it.'],
            ['Minimize Reader Load', 'Fewer layers and less hidden state to hold in your head'],
            ['Outcome-Oriented Execution', 'Aim at the final design. No throwaway compatibility shims.'],
            ['Experience First', 'User delight over builder convenience'],
          ],
          explain: 'Together these ten decide how much to build and when to rethink.',
        },
        {
          kind: 'mcq',
          q: 'Two fixes, both "increase the retry timeout", have failed. Which principle fits?',
          options: ['Experience First', 'Attack the Premise', 'Build the Lever', 'Laziness Protocol'],
          answer: 1,
          explain: 'Both fixes assumed "the timeout is too short". Write that down, take a census of what actually fails, and question it.',
        },
        {
          kind: 'mcq',
          q: 'You need to rename a function used in 300 places. Which principle says to write a codemod instead of editing by hand?',
          options: ['Build the Lever', 'Experience First', 'Minimize Reader Load', 'Attack the Premise'],
          answer: 0,
          explain: 'The codemod does the work the same way every time and a reviewer can rerun it.',
        },
      ],
    },
    {
      id: 'architecture',
      title: 'Architecture principles',
      kind: 'practice',
      minutes: 5,
      summary: 'Six rules for where things live.',
      steps: [
        {
          kind: 'mcq',
          q: 'An order has `isPaid`, `isShipped`, `isCancelled` booleans that keep disagreeing. Which principle fixes the design?',
          code: `if (order.isPaid && !order.isCancelled && !order.isShipped) { ... }
if (order.isShipped && !order.isPaid) { /* how?? */ }`,
          options: ['Model the Domain', 'Make Operations Idempotent', 'Boundary Discipline', 'Experience First'],
          answer: 0,
          explain: 'A single status state machine replaces scattered booleans. Type System Discipline then makes "shipped but unpaid" impossible to write.',
        },
        {
          kind: 'mcq',
          q: 'Null checks for the same config value are sprinkled across 14 files. Which principle applies?',
          options: ['Boundary Discipline', 'Build the Lever', 'Attack the Premise', 'Exhaust the Design Space'],
          answer: 0,
          explain: 'Validate config once at the boundary where it is parsed. Inside, trust the types.',
        },
        {
          kind: 'mcq',
          q: 'A sync job crashed halfway. Rerunning it creates duplicate records. Which principle was missed?',
          options: ['Make Operations Idempotent', 'Experience First', 'Minimize Reader Load', 'Laziness Protocol'],
          answer: 0,
          explain: 'Running twice, or after a partial crash, should converge on the same end state.',
        },
        {
          kind: 'match',
          q: 'Match the rest.',
          pairs: [
            ['Type System Discipline', 'Make illegal states unrepresentable'],
            ['Migrate Callers Then Delete Legacy APIs', 'Move every caller and delete the old API in one wave'],
            ['Separate Before Serializing Shared State', 'Give each worker its own thing before adding locks'],
          ],
          explain: 'Types, migrations, and concurrency.',
        },
      ],
    },
    {
      id: 'verification-delegation-meta',
      title: 'Verification, delegation & meta',
      kind: 'practice',
      minutes: 5,
      summary: 'The last seven.',
      steps: [
        {
          kind: 'mcq',
          q: 'A test passes even when every imported function returns `undefined`. Which principle says to rewrite or delete it?',
          code: `test('checkout', () => {
  const spy = vi.spyOn(tax, 'calculate')
  checkout(cart)
  expect(spy).toHaveBeenCalled()
})`,
          options: ['Prove It Works', 'Test Behavior, Not Implementation', 'Fix Root Causes', 'Guard the Context Window'],
          answer: 1,
          explain: 'Call it like a user and assert a literal value: `expect(checkout(cart).total).toBe(42)`.',
        },
        {
          kind: 'sort',
          q: 'Which family does each principle belong to?',
          buckets: ['Verification', 'Delegation', 'Meta'],
          items: [
            { text: 'Prove It Works', bucket: 0 },
            { text: 'Fix Root Causes', bucket: 0 },
            { text: 'Sequence Work into Verifiable Units', bucket: 0 },
            { text: 'Guard the Context Window', bucket: 1 },
            { text: 'Never Block on the Human', bucket: 1 },
            { text: 'Encode Lessons in Structure', bucket: 2 },
          ],
          explain: 'Four verification, two delegation, one meta.',
        },
        {
          kind: 'mcq',
          q: 'You have told agents "don\'t import from legacy/" three times this week. Which principle?',
          options: ['Encode Lessons in Structure', 'Never Block on the Human', 'Experience First', 'Laziness Protocol'],
          answer: 0,
          explain: 'Turn it into a lint rule that fails CI. The instruction is the symptom.',
        },
        {
          kind: 'mcq',
          q: 'The agent pastes 4,000 lines of logs into the main chat and starts forgetting earlier instructions. Which principle was violated?',
          options: ['Guard the Context Window', 'Fix Root Causes', 'Model the Domain', 'Build the Lever'],
          answer: 0,
          explain: 'Send bulk to a subagent. Keep summaries in the main thread.',
        },
      ],
    },
    {
      id: 'principles-quiz',
      title: 'Unit quiz: Name that principle',
      kind: 'quiz',
      minutes: 5,
      summary: 'Seven scenarios. Pick the principle.',
      steps: [
        {
          kind: 'mcq',
          q: 'The agent asks "Should I write the helper function now?" about reversible work.',
          options: ['Never Block on the Human', 'Prove It Works', 'Model the Domain', 'Attack the Premise'],
          answer: 0,
          explain: 'Proceed, present the result, let the human course-correct.',
        },
        {
          kind: 'mcq',
          q: 'Adding multi-currency, the agent bolts a `currency` flag onto 40 call sites.',
          options: ['Redesign from First Principles', 'Build the Lever', 'Never Block on the Human', 'Fix Root Causes'],
          answer: 0,
          explain: 'Design as if multi-currency had always been there, probably in the core Price type.',
        },
        {
          kind: 'mcq',
          q: 'The agent claims success because the build is green.',
          options: ['Prove It Works', 'Laziness Protocol', 'Experience First', 'Subtract Before You Add'],
          answer: 0,
          explain: 'Check the real artifact, not "it compiles".',
        },
        {
          kind: 'mcq',
          q: 'A migration of 80 files is done all at once, and something broke somewhere in the middle.',
          options: ['Sequence Work into Verifiable Units', 'Experience First', 'Boundary Discipline', 'Guard the Context Window'],
          answer: 0,
          explain: 'Small units, each ending in a check. A break is cheap to localize at the unit that caused it.',
        },
        {
          kind: 'mcq',
          q: 'A new reader needs to open 6 files and 3 wrappers to learn where a value comes from.',
          options: ['Minimize Reader Load', 'Make Operations Idempotent', 'Type System Discipline', 'Never Block on the Human'],
          answer: 0,
          explain: 'Collapse one-caller wrappers. Can a reader answer "where does X come from?" in 30 seconds?',
        },
        {
          kind: 'mcq',
          q: 'A brand-new interaction with no example in the codebase. The agent builds the first idea it had.',
          options: ['Exhaust the Design Space', 'Laziness Protocol', 'Fix Root Causes', 'Boundary Discipline'],
          answer: 0,
          explain: 'Build 2 or 3 genuinely different sketches. Design it twice.',
        },
        {
          kind: 'mcq',
          q: 'The new API exists, but the old one is kept "for compatibility" with 12 internal callers.',
          options: ['Migrate Callers Then Delete Legacy APIs', 'Experience First', 'Encode Lessons in Structure', 'Prove It Works'],
          answer: 0,
          explain: 'With no external users, migrate the callers and delete the old API in the same wave.',
        },
      ],
    },
  ],
}
