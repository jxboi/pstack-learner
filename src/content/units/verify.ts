import type { Unit } from '../types'

export const verify: Unit = {
  id: 'verify',
  index: 7,
  title: 'Verify and ship',
  tagline: '"It compiles" is not evidence. Prove it, open the PR, land it safely.',
  icon: '✅',
  hue: 130,
  image: '/guide/verification.jpg',
  goals: [
    'Tell real evidence from proxies',
    'Explain what a project verification skill is',
    'Describe how Babysit and Shipping drive a PR to merged',
  ],
  lessons: [
    {
      id: 'prove-it',
      title: 'Prove it works',
      kind: 'learn',
      minutes: 5,
      summary: 'State the finish condition up front, and expect evidence back.',
      steps: [
        {
          kind: 'read',
          title: 'Proxies are not proof',
          body: `The **Prove It Works** principle makes the agent check the **real artifact** before it reports success. Your job is to make the real artifact checkable. Put "done means..." in your first prompt:

\`\`\`
/poteto-mode add json output to this command. text output stays byte-identical, the json parses, both run against the sample project. show me the evidence.
\`\`\`

Now the agent has **three checks it can run**, not a mood to satisfy. The reply should carry the **exact commands and outputs**. If a check could not run, a good reply says **"inconclusive"**. A confident reply with no evidence is a **red flag**.`,
          image: { src: '/guide/verification.jpg', alt: 'A prototype plane flies a real test course while robots film and checklist the run.', credit: 'Illustration from the pstack guide (MIT)' },
        },
        {
          kind: 'sort',
          q: 'Real evidence or just a proxy?',
          buckets: ['Real evidence', 'Proxy'],
          items: [
            { text: 'The build passed', bucket: 1 },
            { text: 'Output of the real CLI command, pasted verbatim', bucket: 0 },
            { text: '"I updated the code, it should work now"', bucket: 1 },
            { text: 'Reading back the value actually written to storage', bucket: 0 },
            { text: 'The file modification time changed', bucket: 1 },
            { text: 'Before and after profiles of the perf change', bucket: 0 },
          ],
          explain: 'Builds, self-reports and timestamps are proxies. Real runs, real values and real profiles are evidence.',
        },
        {
          kind: 'match',
          q: 'Match the change to the check that proves it.',
          pairs: [
            ['A CLI change', 'Run the real command'],
            ['A UI change', 'Walk the changed flow in the running app'],
            ['A parser or migration', 'Replay a saved input'],
            ['A perf change', 'Compare before and after profiles'],
            ['A storage change', 'Read back the written value'],
          ],
          explain: 'Match the check to the surface that changed.',
        },
        {
          kind: 'read',
          title: '/blast-radius for small, scary diffs',
          body: `For a small diff you do not fully trust, \`/blast-radius\` finds what it could break **elsewhere**, beyond the diff. It picks the **one fact the change is safe because of** and **proves it by running code**, instead of writing an essay.`,
        },
      ],
    },
    {
      id: 'verification-skills',
      title: 'Verification skills',
      kind: 'learn',
      minutes: 5,
      summary: 'Teach agents to drive your app like a user does.',
      steps: [
        {
          kind: 'read',
          title: 'The hidden requirement',
          body: `"Walk the flow in the running app" needs a **scripted way to drive your app**. If your project has none:

\`\`\`
/create-verification-skill
\`\`\`

It **interviews the repository, not you**: what a user touches, how the app launches, what can drive it (an existing harness first, else a browser via CDP, a terminal, or plain HTTP), what evidence proves behavior. It only asks what the code cannot answer.

It writes \`.cursor/skills/verify-<app>/\` with exact **Launch, Doctor, Drive, Evidence, Cleanup** sections, plus a **feature map**: one file per feature saying what proves it works.`,
          callout: { tone: 'key', text: 'Before handing it over, the generator proves the skill once end to end. If that proof fails, do not use the output.' },
        },
        {
          kind: 'order',
          q: 'The end-to-end proof run the generator does before handing over the skill:',
          items: ['Launch the app', 'Run the doctor check', 'Drive one feature', 'Capture evidence', 'Clean up'],
          explain: 'Launch, doctor, drive, evidence, cleanup. The same sections the skill documents.',
        },
        {
          kind: 'read',
          title: 'Keep it honest',
          body: `Apps change and feature maps rot. \`/maintain-verification-skill\` audits it: **one read-only source reader per feature in parallel**, then **one live pass** that drives every mapped feature.

It ends in exactly one of three outcomes:
- **clean**: full coverage, nothing to ship.
- **changed**: one PR of proven corrections, only inside the verify skill's own folder.
- **blocked**: names the blocker.

It **never edits product code**. If the live pass catches a product regression, it reports it rather than papering over it in docs.`,
        },
        {
          kind: 'mcq',
          q: '/maintain-verification-skill finds the app\'s "Export" button is actually broken. What does it do?',
          options: [
            'Fixes the product code',
            'Edits the feature map to say export is not expected to work',
            'Reports the product regression',
            'Deletes the export feature',
          ],
          answer: 2,
          explain: 'It never edits product code and never hides a regression in docs.',
        },
      ],
    },
    {
      id: 'babysit',
      title: 'Open the PR & babysit it',
      kind: 'learn',
      minutes: 5,
      summary: 'Small commits, then clear blockers in the right order.',
      steps: [
        {
          kind: 'read',
          title: 'Opening a PR',
          body: `\`\`\`
/poteto-mode open the pr. small ordered commits, evidence in the description.
\`\`\`

The **Opening a PR** playbook works from a worktree, rebases into **small ordered commits**, cleans the diff, unslops the prose, and returns the link. Five narrow PRs beat one fat one. Stacked follow-ups beat a growing branch.

A **stack** is a chain of PRs where each builds on the one below it.`,
        },
        {
          kind: 'read',
          title: 'Babysit: get it green',
          body: `An open PR starts collecting blockers right away. \`/poteto-mode babysit this pr. get it green.\` hands the churn to **Babysit**:

- Blockers in order: **conflicts, then review threads, then CI**.
- Every known fix is **batched into one push**, so checks restart once instead of after every fix.
- Comment triage is **skeptical**. Real findings get fixed. Noise gets dismissed with the disproof posted.
- Flaky CI earns **one** fresh build. An identical second failure means it was never flake.
- It **stops at merge-ready and never merges.** Merging is a different decision.

Just want status? \`check on pr 123. anything outstanding?\` gives one status pass, no loop.`,
        },
        {
          kind: 'widget',
          title: 'Clear the blockers',
          intro: 'This PR has five blockers. Handle them the Babysit way.',
          widget: 'babysit-queue',
        },
        {
          kind: 'mcq',
          q: 'Everything is green. Does Babysit merge the PR?',
          options: ['Yes, immediately', 'No. It stops at merge-ready. Landing is the Shipping playbook.', 'Only on weekends', 'Only if a bot approves'],
          answer: 1,
          explain: 'Babysit never merges. "Land the stack" routes to Shipping.',
        },
      ],
    },
    {
      id: 'shipping',
      title: 'Land the stack with Shipping',
      kind: 'learn',
      minutes: 5,
      summary: 'Green is not safe. Verify each PR, land from the bottom.',
      steps: [
        {
          kind: 'read',
          title: 'Green is not the same as safe',
          body: `\`\`\`
/poteto-mode land the stack.
\`\`\`

**Shipping** verifies each PR **independently** before arming anything. **One fresh agent per PR** proves the behavior live. **The agent that judges a change is never the one that wrote it.**

Then it lands only the **contiguous verified run from the bottom**, one PR at a time, and reports the first PR that breaks the chain. A verified PR **above** an unverified one waits, because merging it would pull the gap in underneath.`,
          callout: { tone: 'analogy', text: 'Stacking boxes. You can only lift off the bottom box when it is checked. A checked box sitting on an unchecked one still has to wait.' },
        },
        {
          kind: 'widget',
          title: 'Which PRs can land?',
          intro: 'Toggle verdicts and see which part of the stack is landable.',
          widget: 'stack-lander',
        },
        {
          kind: 'mcq',
          q: 'Stack from bottom: PR1 verified, PR2 verified, PR3 NOT verified, PR4 verified. What lands?',
          options: ['All four', 'PR1 and PR2', 'PR1, PR2 and PR4', 'Nothing'],
          answer: 1,
          explain: 'The contiguous verified run from the bottom stops at PR3. PR4 waits.',
        },
        {
          kind: 'mcq',
          q: 'Why is the verifier never the agent that wrote the change?',
          options: [
            'To save money',
            'An author tends to confirm its own assumptions. Fresh eyes catch what the author cannot.',
            'Agents cannot read their own code',
            'It is a Cursor limitation',
          ],
          answer: 1,
          explain: 'Same reason Comment Sicko reviews comments it did not write.',
        },
      ],
    },
    {
      id: 'verify-quiz',
      title: 'Unit quiz: Verify & ship',
      kind: 'quiz',
      minutes: 4,
      summary: 'Six questions.',
      steps: [
        {
          kind: 'mcq',
          q: 'A reply says "Fixed! Everything works." with no commands or outputs. How should you read it?',
          options: ['Great news', 'A red flag. Ask for the evidence.', 'The agent is being modest', 'Normal'],
          answer: 1,
          explain: 'A confident reply without evidence is a red flag.',
        },
        {
          kind: 'mcq',
          q: 'A check could not run. What should a good reply say?',
          options: ['"Passed"', '"Inconclusive"', 'Nothing', '"Probably fine"'],
          answer: 1,
          explain: '"Inconclusive" or wrong-surface is not a pass.',
        },
        {
          kind: 'mcq',
          q: 'What does /create-verification-skill interview first?',
          options: ['You, with a long survey', 'The repository', 'Your teammates', 'Stack Overflow'],
          answer: 1,
          explain: 'It reads the repo and only asks what the code cannot answer.',
        },
        {
          kind: 'mcq',
          q: 'Babysit\'s order for clearing blockers?',
          options: ['CI, threads, conflicts', 'Conflicts, review threads, CI', 'Threads, CI, conflicts', 'Any order'],
          answer: 1,
          explain: 'Conflicts first, then review threads, then CI. Batch fixes into one push.',
        },
        {
          kind: 'mcq',
          q: 'CI failed twice with the identical error. Babysit concludes...',
          options: ['It is a flake, retry again', 'It was never flake. Read the logs.', 'Disable the test', 'Merge anyway'],
          answer: 1,
          explain: 'One fresh build only. A second identical failure is real.',
        },
        {
          kind: 'mcq',
          q: 'What does /blast-radius prove?',
          options: [
            'That the code compiles',
            'The one fact the change is safe because of, by running real code',
            'That the PR has no typos',
            'That tests are fast',
          ],
          answer: 1,
          explain: 'It looks beyond the diff and proves safety by running code, not by essay.',
        },
      ],
    },
  ],
}
