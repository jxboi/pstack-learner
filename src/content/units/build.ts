import type { Unit } from '../types'

export const build: Unit = {
  id: 'build',
  index: 6,
  title: 'Build and clean the change',
  tagline: 'Prompt the build playbooks, test first, then scrub code, prose and comments.',
  icon: '🔨',
  hue: 330,
  goals: [
    'Know what to put in bug, feature, refactor and perf prompts',
    'Explain the red-then-green rhythm of /tdd',
    'Tell /deslop, /unslop and /no-comments apart',
  ],
  lessons: [
    {
      id: 'build-prompts',
      title: 'Prompt each build playbook',
      kind: 'learn',
      minutes: 5,
      summary: 'Say what you observed. The playbook demands the evidence.',
      steps: [
        {
          kind: 'read',
          title: 'Four prompts, four disciplines',
          body: `Your prompt carries what only you know. The playbook adds the discipline people usually skip:

- **Bug**: you state the symptom. The playbook **reproduces it before fixing**.
  \`this command emits two records after a retry. repro first, then fix and verify.\`
- **Feature**: you state the behavior and what must **not** change. The playbook makes the agent **name the data shape** (a type, a state machine, a table) before any logic gets written.
  \`add a --json flag. text output stays byte-identical. verify both forms.\`
- **Refactor**: you say "zero behavior change". The playbook **pins current behavior** with a test or snapshot before structure moves.
  \`move parsing into one module, zero behavior change. record the current output first and prove it's unchanged after.\`
- **Perf**: you state a **measurement**, not a vibe. The playbook **profiles before optimizing**, so it fixes the measured cause, not a guess.
  \`startup takes 1.8s on this fixture. trace it, fix the measured cause, show me before and after.\``,
        },
        {
          kind: 'match',
          q: 'Match each playbook to the step it adds that you did not type.',
          pairs: [
            ['Bug fix', 'Reproduce before fixing'],
            ['Feature', 'Name the data shape before implementing'],
            ['Refactoring', 'Pin current behavior before restructuring'],
            ['Perf issue', 'Profile before optimizing'],
          ],
          explain: 'Each playbook front-loads the step people most often skip. Notice the pattern: every one of them is "look before you leap", in a different form.',
          hint: 'Each added step happens *before* the main work.',
        },
        {
          kind: 'read',
          title: 'Hillclimb: one number, many attempts',
          body: `For **sustained** improvement of one number, there is **Hillclimb**. Give it a metric, a target, and a floor on attempts (so a lucky early win cannot end it).

It loops: **one hypothesis, one measurement, keep or revert.** The measurement harness is frozen so results are comparable. Wins get one commit each. Everything else gets reverted. A plateau means pivot, not quit.`,
          callout: { tone: 'analogy', text: 'A scientist running one controlled experiment at a time, writing each result in a lab notebook.' },
        },
        {
          kind: 'mcq',
          q: 'Which perf prompt fits pstack style?',
          options: [
            '"make startup faster, it is really slow for our users right now"',
            '"the app feels sluggish on startup, do some optimizations and tell me what you changed"',
            '"cold start is 1.8s on this fixture. trace it, fix the measured cause, show before and after."',
            '"add caching to every data fetch so the app loads faster, then run the tests"',
          ],
          answer: 2,
          explain: 'A measurement, a fixture, and a before/after check. "Sluggish" cannot be checked. "Add caching everywhere" picks the fix before anyone has measured what is slow.',
          hint: 'Which one could you prove succeeded?',
        },
      ],
    },
    {
      id: 'tdd',
      title: '/tdd: red, then green',
      kind: 'learn',
      minutes: 4,
      summary: 'Write the failing test first, when the test is cheap.',
      steps: [
        {
          kind: 'widget',
          title: 'The red, green loop',
          intro: 'Step through a bug fix done test-first.',
          widget: 'tdd-cycle',
        },
        {
          kind: 'read',
          title: 'When to use it, and when not to',
          body: `When a bug has a **cheap local test path**, the prompt can be two words: \`/tdd implement\`.

\`/tdd\` writes the **smallest test that fails for the intended reason**, then the fix, then reruns the test.

But it is honest: if a test would need a huge harness or brittle mocks, it **says so** and uses the closest real command instead. A real command is often stronger evidence than a forced test.

**TypeScript bonus:** the \`typescript-best-practices\` skill has no slash command. It **loads itself** whenever the agent touches a .ts or .tsx file: discriminated unions, \`unknown\` at boundaries, exhaustive variants, schema-derived types.`,
        },
        {
          kind: 'mcq',
          q: 'What makes a good first test in /tdd?',
          options: [
            'A huge integration test covering everything',
            'The smallest test that fails for the intended reason',
            'A test that always passes',
            'A snapshot of the entire app',
          ],
          answer: 1,
          explain: 'Small and failing for the right reason. A test that fails because of a typo or missing import proves nothing about the bug. A huge test fails for many reasons, so it is hard to tell what your fix changed.',
          hint: 'Why it fails matters as much as whether it fails.',
        },
        {
          kind: 'mcq',
          q: 'A test for this bug would need mocking 9 services. What does /tdd do?',
          options: [
            'Mocks all 9, since a test is always required',
            'Says so and runs the closest real command instead',
            'Skips testing and fixes the bug directly',
            'Writes it anyway, with simpler fakes for all 9',
          ],
          answer: 1,
          explain: 'A test built on 9 mocks mostly tests the mocks. Running the real command is stronger evidence. The honest move is to say so.',
          hint: 'What would a test built on 9 fakes actually prove?',
        },
      ],
    },
    {
      id: 'unslop',
      title: '/unslop: remove AI tells',
      kind: 'learn',
      minutes: 5,
      summary: 'Plain, direct prose. No "delve", no em dashes.',
      steps: [
        {
          kind: 'read',
          title: 'What "AI tells" look like',
          body: `\`/unslop\` edits writing to remove patterns that scream "an AI wrote this". It has numbered rules. Some favorites:

- **AI vocabulary**: delve, crucial, pivotal, tapestry, showcase, testament, vibrant... use plain words.
- **Fancy "is"**: "serves as", "stands as", "boasts". Just say "is" or "has".
- **"Not just X, but Y."** Say the point directly.
- **Em dashes.** Avoid them entirely. Use periods or commas.
- **Chatbot phrases**: "I hope this helps!", "Great question!"
- **Filler**: "in order to" becomes "to". "Due to the fact that" becomes "because".
- **Say what it does, not how it feels.** Name the mechanism or the number.

Usage: \`/unslop the readme changes, no emdashes\`.`,
        },
        {
          kind: 'spot',
          q: 'Tap every AI tell in this PR description.',
          segments: [
            { text: 'This PR ' },
            { text: 'delves into', target: true, why: 'AI vocabulary. Say "changes" or "fixes".' },
            { text: ' the retry logic. The new helper ' },
            { text: 'serves as', target: true, why: 'Fancy "is". Just say "is".' },
            { text: ' a single source of truth for backoff. ' },
            { text: 'It is not just a refactor, but a reliability upgrade.', target: true, why: '"Not just X, but Y." State the point directly.' },
            { text: ' Retries now stop after 5 attempts. ' },
            { text: 'I hope this helps!', target: true, why: 'Chatbot phrase. Delete it.' },
          ],
          explain: 'A clean version: "This PR moves backoff into one helper. Retries now stop after 5 attempts." Shorter, and it says what it does. Notice the untouched sentence is the most useful one: a plain fact with a number.',
          hint: 'There are four. Compare against the list on the previous screen.',
        },
        {
          kind: 'mcq',
          q: 'Rewrite "In order to utilize the cache, it is important to note that you must first initialize it." Best unslopped version?',
          options: [
            '"To leverage the cache, it is crucial to initialize it first."',
            '"Initialize the cache before you use it."',
            '"The cache, a pivotal component, requires initialization."',
            '"Cache initialization: required."',
          ],
          answer: 1,
          explain: 'Short, active, plain words. The first option swaps in AI vocabulary ("leverage", "crucial"). The third adds "pivotal" and a fancy "requires". The last is so compressed it reads like a label. Unslopped does not mean shortest. It means a real sentence with nothing extra.',
          hint: 'Plain is not the same as shortest.',
        },
      ],
    },
    {
      id: 'no-comments',
      title: '/no-comments & Comment Sicko',
      kind: 'learn',
      minutes: 5,
      summary: 'Comments get reviewed by someone who did not write them.',
      steps: [
        {
          kind: 'read',
          title: 'Fresh eyes for comments',
          body: `An author defends their own comments. So before review, pstack hands them to **fresh eyes**:

\`\`\`
/no-comments the diff
\`\`\`

It spawns **Comment Sicko**, a gleefully comment-hating, read-only reviewer ("Yes... Ha ha ha... Yes!"). Its short **keep list**:
- License headers.
- Doc comments that define a **public API** contract.
- Issue or RFC links that explain a constraint code cannot express.
- Non-obvious behavior **forced by an external dependency** you cannot reshape.

**Everything else goes.** A surprise in *your own* code gets no pass. It becomes a refactor flag: rename, extract, or retype until the code explains itself.`,
          callout: { tone: 'tip', text: 'If a comment claims a constraint like "do not remove", /no-comments offers to encode it as a type, test, or lint instead. Either way, the comment comes out.' },
        },
        {
          kind: 'widget',
          title: 'Be the Comment Sicko',
          intro: 'Tap the comments that should die. Leave the ones on the keep list.',
          widget: 'comment-sicko',
        },
        {
          kind: 'match',
          q: 'Who cleans what?',
          pairs: [
            ['/deslop', 'Slop in the code (narrating comments, dead guards, unrelated edits)'],
            ['/unslop', 'Slop in prose (PR descriptions, docs, replies)'],
            ['/no-comments', 'Comments, reviewed by an agent that did not write them'],
          ],
          explain: 'deslop = code, unslop = prose, no-comments = comments. (/deslop ships in the cursor-team-kit plugin, not pstack. Without it, ask in plain words for the same cleanup.)',
          hint: '"unslop" was the prose lesson.',
        },
      ],
    },
    {
      id: 'build-quiz',
      title: 'Unit quiz: Build & clean',
      kind: 'quiz',
      minutes: 4,
      summary: 'Six questions.',
      steps: [
        {
          kind: 'mcq',
          q: 'What does a refactoring prompt need that a feature prompt does not?',
          options: ['A list of the files it may touch', 'Proof that behavior did not change', 'A design pass with /architect first', 'A before-and-after performance measurement'],
          answer: 1,
          explain: 'Refactoring changes structure, never behavior, so you need proof that behavior did not move. That means recording it first. Type checks and lint do not count as a pin.',
          hint: 'What does "zero behavior change" need in order to be provable?',
        },
        {
          kind: 'mcq',
          q: 'In Hillclimb, an attempt does not move the metric past noise. What happens?',
          options: ['Keep it, since it did not hurt', 'Revert it in full and log the row', 'Stop the run, since the idea failed', 'Keep it and try a bigger version'],
          answer: 1,
          explain: 'One change, one measurement, keep or revert. A change that "did not hurt" still adds code that does nothing, and it blurs the next measurement. Logging the failed try stops anyone repeating it. One miss is not a reason to stop.',
          hint: 'Keep or revert. There is no third bucket.',
        },
        {
          kind: 'mcq',
          q: 'Which comment survives Comment Sicko?',
          options: [
            '// increment counter',
            '// we retry 3 times here because our queue sometimes drops jobs',
            '// Safari drops this event on hidden tabs, see https://bugs.webkit.org/...',
            '// TODO maybe refactor later',
          ],
          answer: 2,
          explain: 'Safari is an external dependency you cannot reshape, and the link explains it. The queue comment describes a surprise in **your own** system, so it becomes a refactor flag: fix the queue, or name the constant so the code says it. The rest is narration or noise.',
          hint: 'Can you change the thing the comment is apologizing for?',
        },
        {
          kind: 'mcq',
          q: 'Which line is unslopped?',
          options: [
            '"This change serves as a pivotal upgrade."',
            '"Retries now stop after five attempts."',
            '"Not just faster, but smarter."',
            '"This robust fix significantly improves reliability."',
          ],
          answer: 1,
          explain: 'Plain, specific, says what it does. "Robust" and "significantly improves" sound fine but say nothing you could check. Say what it does, not how it feels.',
          hint: 'Which one contains a fact you could verify?',
        },
        {
          kind: 'mcq',
          q: 'You type /deslop and Cursor says there is no such skill. Why?',
          options: [
            'pstack is not installed',
            'It ships in cursor-team-kit',
            'You need to run /setup-pstack first',
            'It only works inside /poteto-mode',
          ],
          answer: 1,
          explain: '/deslop ships in cursor-team-kit, not pstack. Install both for the full set, or ask in plain words for the same cleanup.',
          hint: 'It was mentioned in the "Who cleans what?" explanation.',
        },
        {
          kind: 'mcq',
          q: 'You never typed /typescript-best-practices, yet the agent\'s TypeScript edit uses discriminated unions and `unknown` at the boundary. Why?',
          options: [
            'The model always writes TypeScript that way',
            'The skill loads itself for .ts and .tsx files',
            '/poteto-mode lists it in every todo list',
            'It is part of your model rule file',
          ],
          answer: 1,
          explain: 'typescript-best-practices has no slash command. It loads itself when the agent touches a .ts or .tsx file.',
          hint: 'Some skills load based on the files, not the prompt.',
        },
      ],
    },
  ],
}
