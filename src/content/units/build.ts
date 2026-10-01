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
          body: `Each build playbook supplies steps you did not type:

- **Bug**: state the symptom, ask for a repro first.
  \`this command emits two records after a retry. repro first, then fix and verify.\`
- **Feature**: state the behavior and what must **not** change.
  \`add a --json flag. text output stays byte-identical. verify both forms.\`
- **Refactor**: pin behavior before structure moves.
  \`move parsing into one module, zero behavior change. record the current output first and prove it's unchanged after.\`
- **Perf**: state a **measurement**, not a vibe.
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
          explain: 'Each playbook front-loads the step people most often skip.',
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
            '"make it faster"',
            '"the app feels sluggish, do some optimizations"',
            '"cold start is 1.8s on this fixture. trace it, fix the measured cause, show before and after."',
            '"add caching everywhere"',
          ],
          answer: 2,
          explain: 'A measurement, a fixture, and a before/after check. "Add caching everywhere" is a solution in search of evidence.',
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
          explain: 'Small and failing for the right reason. Then the fix turns it green.',
        },
        {
          kind: 'mcq',
          q: 'A test for this bug would need mocking 9 services. What does /tdd do?',
          options: [
            'Mocks all 9 anyway',
            'Says so and uses the closest real executable check instead',
            'Gives up on the bug',
            'Deletes the existing tests',
          ],
          answer: 1,
          explain: 'Do not force a test where a real command is stronger evidence.',
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
          explain: 'A clean version: "This PR moves backoff into one helper. Retries now stop after 5 attempts." Shorter and says what it does.',
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
          explain: 'Short, active, plain words. The last option is over-compressed (rule 33).',
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
          explain: '/deslop ships in the cursor-team-kit plugin, not pstack. Without it, ask in plain words for the same cleanup.',
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
          options: ['A new flag', 'A pin on current behavior, proven unchanged after', 'More subagents', 'A design doc'],
          answer: 1,
          explain: 'Refactoring changes structure, never behavior. Pin first.',
        },
        {
          kind: 'mcq',
          q: 'In Hillclimb, an attempt does not move the metric past noise. What happens?',
          options: ['Keep it anyway', 'Revert it in full and log the row', 'Stop the whole run', 'Ask the human'],
          answer: 1,
          explain: 'One change, one measurement, keep or revert. Every attempt gets logged.',
        },
        {
          kind: 'mcq',
          q: 'Which comment survives Comment Sicko?',
          options: [
            '// increment counter',
            '// Phase 1: setup',
            '// Safari drops this event on hidden tabs, see https://bugs.webkit.org/...',
            '// TODO maybe refactor later',
          ],
          answer: 2,
          explain: 'Behavior forced by an external platform with a link explaining it. The rest are narration or noise.',
        },
        {
          kind: 'mcq',
          q: 'Which line is unslopped?',
          options: [
            '"This change serves as a pivotal upgrade."',
            '"Retries now stop after five attempts."',
            '"Not just faster, but smarter."',
            '"Great question! Here\'s the fix."',
          ],
          answer: 1,
          explain: 'Plain, specific, says what it does.',
        },
        {
          kind: 'mcq',
          q: 'Where does /deslop come from?',
          options: ['pstack', 'cursor-team-kit plugin', 'Cursor built-in', 'npm'],
          answer: 1,
          explain: 'It ships in cursor-team-kit. Install both for the full set.',
        },
        {
          kind: 'mcq',
          q: 'When does typescript-best-practices load?',
          options: ['Only when you type it', 'Automatically when the agent touches a .ts or .tsx file', 'Never', 'At install'],
          answer: 1,
          explain: 'No slash command needed.',
        },
      ],
    },
  ],
}
