import type { ReadStep, Unit } from '../types'
import { PRINCIPLES, type PrincipleCategory } from '../principles'

const family = (title: string, cats: PrincipleCategory[]): ReadStep => ({
  kind: 'read',
  title,
  body: PRINCIPLES.filter((p) => cats.includes(p.category))
    .map((p) => `- **${p.name}**: ${p.plain}`)
    .join('\n'),
  callout: { tone: 'tip', text: 'Skim it, then try the scenarios. Press ← to come back here if you get stuck.' },
})

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
            'It applied it so well no change was needed',
            'It name-dropped the principle',
            'Laziness Protocol does not fit this kind of task',
            'The agent forgot which decision it changed',
          ],
          answer: 1,
          explain: 'Each cited principle should come with the specific choice it changed, like "Laziness Protocol: deleted the wrapper instead of adding a flag". A name with no decision is decoration.',
          hint: 'Re-read the warning on the first screen of this lesson.',
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
        family('The ten core principles', ['Core']),
        {
          kind: 'match',
          q: 'Which principle would you name to steer each agent?',
          pairs: [
            ['It adds a config option, a helper and a wrapper to fix a one-line bug', 'Laziness Protocol'],
            ['It starts writing job-runner logic before deciding what a Job looks like', 'Foundational Thinking'],
            ['It designs a new adapter next to three unused old ones', 'Subtract Before You Add'],
            ['It plans to hand-check 200 output files one by one', 'Build the Lever'],
            ['It builds the first layout idea for a screen unlike anything in the app', 'Exhaust the Design Space'],
          ],
          explain: 'Each name points at a full rule the agent has already read. One phrase redirects it.',
          hint: 'For each one, ask what the agent skipped or overdid.',
        },
        {
          kind: 'match',
          q: 'Five more.',
          pairs: [
            ['It bolts a `currency` flag onto 40 call sites', 'Redesign from First Principles'],
            ['Its third fix rests on the same assumption as two failed ones', 'Attack the Premise'],
            ['Finding where a value comes from means opening 6 files and 3 wrappers', 'Minimize Reader Load'],
            ['In a planned rewrite, it builds temporary shims to keep every middle step working', 'Outcome-Oriented Execution'],
            ['It skips the loading state because it is fiddly to build', 'Experience First'],
          ],
          explain: 'Together these ten decide how much to build and when to rethink.',
          hint: 'Start with the ones whose scenario you already met in this course.',
        },
        {
          kind: 'mcq',
          q: 'Two fixes, both "increase the retry timeout", have failed. Which principle fits?',
          options: ['Fix Root Causes', 'Attack the Premise', 'Build the Lever', 'Laziness Protocol'],
          answer: 1,
          explain: 'Fix Root Causes is close, but the clue is that **two fixes failed on one shared assumption**: "the timeout is too short". Attack the Premise says to write that assumption down and test it. Count what actually fails before trying fix number three.',
          hint: 'What do the two failed fixes have in common?',
        },
        {
          kind: 'mcq',
          q: 'You need to rename a function used in 300 places. Which principle says to write a codemod instead of editing by hand?',
          options: ['Build the Lever', 'Laziness Protocol', 'Minimize Reader Load', 'Migrate Callers Then Delete Legacy APIs'],
          answer: 0,
          explain: 'A codemod is a lever: a tool that does the work the same way every time, and that a reviewer can rerun instead of checking 300 edits. Laziness sounds right, but it is about the size of the change, not how you make it.',
          hint: 'The question is about how to do the work, not how big it is.',
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
        family('The six architecture principles', ['Architecture']),
        {
          kind: 'mcq',
          q: 'An order has `isPaid`, `isShipped`, `isCancelled` booleans that keep disagreeing. Which principle fixes the design?',
          code: `if (order.isPaid && !order.isCancelled && !order.isShipped) { ... }
if (order.isShipped && !order.isPaid) { /* how?? */ }`,
          options: ['Model the Domain', 'Make Operations Idempotent', 'Boundary Discipline', 'Minimize Reader Load'],
          answer: 0,
          explain: 'A single status state machine replaces scattered booleans. Type System Discipline then makes "shipped but unpaid" impossible to write. Fewer booleans also lowers reader load, but that is a side effect, not the fix.',
          hint: 'The real-world rule is "an order is in exactly one state". Where does that rule live today?',
        },
        {
          kind: 'mcq',
          q: 'Null checks for the same config value are sprinkled across 14 files. Which principle applies?',
          options: ['Boundary Discipline', 'Type System Discipline', 'Encode Lessons in Structure', 'Laziness Protocol'],
          answer: 0,
          explain: 'Validate config once at the boundary where it is parsed. Inside, trust the types. Type System Discipline helps, but only after the boundary has turned "maybe null" into a checked value.',
          hint: 'Where does config enter the program?',
        },
        {
          kind: 'mcq',
          q: 'A sync job crashed halfway. Rerunning it creates duplicate records. Which principle was missed?',
          options: ['Make Operations Idempotent', 'Fix Root Causes', 'Separate Before Serializing Shared State', 'Sequence Work into Verifiable Units'],
          answer: 0,
          explain: 'Running twice, or after a partial crash, should end in the same correct state. Crashes will happen. The design flaw is that a rerun is not safe.',
          hint: 'The crash is not the problem. What happens on the rerun is.',
        },
        {
          kind: 'match',
          q: 'Match the rest to a scenario.',
          pairs: [
            ['A `Result` type lets code read `.value` even when there was an error', 'Type System Discipline'],
            ['The new API shipped months ago, and the old one still has 12 internal callers', 'Migrate Callers Then Delete Legacy APIs'],
            ['Four workers append to one shared cache file behind a lock', 'Separate Before Serializing Shared State'],
          ],
          explain: 'Types, migrations, and concurrency. In each, the fix removes a whole class of mistake instead of guarding against it.',
          hint: 'One is about types, one about old code, one about workers.',
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
        family('Verification, delegation & meta', ['Verification', 'Delegation', 'Meta']),
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
          explain: 'The test only checks that `calculate` was **called**, not that the total is right. Call the code like a user and assert a literal value: `expect(checkout(cart).total).toBe(42)`. Prove It Works is close, but this is specifically about what a test asserts.',
          hint: 'What would this test do if `calculate` returned the wrong number?',
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
          explain: 'Four verification, two delegation, one meta. Delegation is about working with other agents and humans. Meta is about improving the rules themselves.',
          hint: 'Delegation is about other agents and humans.',
        },
        {
          kind: 'mcq',
          q: 'You have told agents "don\'t import from legacy/" three times this week. Which principle?',
          options: ['Encode Lessons in Structure', 'Boundary Discipline', 'Migrate Callers Then Delete Legacy APIs', 'Guard the Context Window'],
          answer: 0,
          explain: 'Turn it into a lint rule that fails CI, so no one has to remember it. Repeating an instruction is the symptom. Migrating the callers off legacy/ may be the long-term fix, but the lesson here is to stop relying on memory.',
          hint: 'You said the same thing three times. What would stop you needing to say it again?',
        },
        {
          kind: 'mcq',
          q: 'The agent pastes 4,000 lines of logs into the main chat and starts forgetting earlier instructions. Which principle was violated?',
          options: ['Guard the Context Window', 'Minimize Reader Load', 'Sequence Work into Verifiable Units', 'Build the Lever'],
          answer: 0,
          explain: 'The chat has limited memory, and 4,000 lines of logs pushed your instructions out. Send bulk reading to a subagent and keep only its summary in the main thread.',
          hint: 'Why would the agent forget earlier instructions?',
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
          options: ['Never Block on the Human', 'Laziness Protocol', 'Guard the Context Window', 'Attack the Premise'],
          answer: 0,
          explain: 'On reversible work, proceed, present the result, and let the human course-correct. Asking first costs a round trip for nothing.',
          hint: 'The key word is "reversible".',
        },
        {
          kind: 'mcq',
          q: 'Adding multi-currency, the agent bolts a `currency` flag onto 40 call sites.',
          options: ['Redesign from First Principles', 'Build the Lever', 'Model the Domain', 'Laziness Protocol'],
          answer: 0,
          explain: 'Design as if multi-currency had always been there, probably in the core Price type. Model the Domain is a close cousin, but the trigger here is a **new requirement** being bolted on.',
          hint: 'A new requirement arrived. Is it being bolted on or designed in?',
        },
        {
          kind: 'mcq',
          q: 'The agent claims success because the build is green.',
          options: ['Prove It Works', 'Test Behavior, Not Implementation', 'Fix Root Causes', 'Sequence Work into Verifiable Units'],
          answer: 0,
          explain: 'Check the real artifact, not "it compiles". Test Behavior is about how tests are written. Here no test of behavior was run at all.',
          hint: 'Is a green build evidence?',
        },
        {
          kind: 'mcq',
          q: 'A migration of 80 files is done all at once, and something broke somewhere in the middle.',
          options: ['Sequence Work into Verifiable Units', 'Migrate Callers Then Delete Legacy APIs', 'Prove It Works', 'Build the Lever'],
          answer: 0,
          explain: 'Small units, each ending in a check. A break is cheap to find in the unit that caused it, and impossible to find in an 80-file blob.',
          hint: 'The problem is "somewhere in the middle". What would have pinpointed it?',
        },
        {
          kind: 'mcq',
          q: 'A new reader needs to open 6 files and 3 wrappers to learn where a value comes from.',
          options: ['Minimize Reader Load', 'Subtract Before You Add', 'Model the Domain', 'Foundational Thinking'],
          answer: 0,
          explain: 'Collapse one-caller wrappers. Can a reader answer "where does X come from?" in 30 seconds? Subtract Before You Add is about clearing dead weight before new work. Here the pain is reading.',
          hint: 'Who is suffering in this scenario?',
        },
        {
          kind: 'mcq',
          q: 'A brand-new interaction with no example in the codebase. The agent builds the first idea it had.',
          options: ['Exhaust the Design Space', 'Experience First', 'Foundational Thinking', 'Redesign from First Principles'],
          answer: 0,
          explain: 'With no precedent, the first idea is just the first idea. Build 2 or 3 genuinely different sketches and compare. Experience First tells you how to judge them, not to make several.',
          hint: '"No example in the codebase" is the trigger.',
        },
        {
          kind: 'mcq',
          q: 'The new API exists, but the old one is kept "for compatibility" with 12 internal callers.',
          options: ['Migrate Callers Then Delete Legacy APIs', 'Outcome-Oriented Execution', 'Subtract Before You Add', 'Minimize Reader Load'],
          answer: 0,
          explain: 'With no external users, migrate the callers and delete the old API in the same wave. Keeping both "for compatibility" means two paths to maintain forever. The other options are related, but this one names exactly the situation.',
          hint: 'Old API, new API, and internal callers.',
        },
      ],
    },
  ],
}
