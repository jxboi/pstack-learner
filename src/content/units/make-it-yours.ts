import type { Unit } from '../types'

export const makeItYours: Unit = {
  id: 'make-it-yours',
  index: 10,
  title: 'Make it yours',
  tagline: 'Your own mode, captured lessons, new skills, and blind tests.',
  icon: '🎨',
  hue: 290,
  goals: [
    'Generate a personal -mode skill with /automate-me',
    'Capture lessons with /reflect without overfitting',
    'Test a skill change blind with the Eval playbook',
  ],
  lessons: [
    {
      id: 'automate-me-reflect',
      title: '/automate-me & /reflect',
      kind: 'learn',
      minutes: 5,
      summary: 'Turn how you work into a skill, and learn from each session.',
      steps: [
        {
          kind: 'read',
          title: 'poteto-mode is one person\'s style',
          body: `The machinery underneath (playbooks, routing, model roles) works just as well wearing **your** style.

\`\`\`
/automate-me
\`\`\`

You do not describe your style. \`/automate-me\` **reads it from your history**. It mines your recent chats in the workspace for repeated preferences (how you like replies, delegation, verification, code, prose, process), **asks you which patterns are really you**, then drafts \`.cursor/skills/<your-name>-mode/SKILL.md\`. It unslops the draft and opens a PR from a worktree so you review it like any change.

Later: \`/automate-me update my mode skill with everything since its last edit\` mines only the new history.`,
        },
        {
          kind: 'read',
          title: '/reflect: learn from a session',
          body: `Right after a task that taught you something:

\`\`\`
/reflect that took way too long. capture what we learned so the next run doesn't repeat it.
\`\`\`

\`/reflect\` sends the transcript to **three parallel reviewers** (tooling, judgment, divergent). A synthesizer sorts their proposals into **Accepted, Rejected, and Backlog**, and **waits for your approval** before any skill changes.`,
          callout: { tone: 'warn', text: 'Approve a proposal only if it would change a future decision. One weird session is an anecdote, not a rule.' },
        },
        {
          kind: 'mcq',
          q: 'How does /automate-me learn your style?',
          options: [
            'A 50-question survey',
            'It mines your recent transcripts, then asks which patterns are really you',
            'It copies poteto-mode exactly',
            'It reads your social media',
          ],
          answer: 1,
          explain: 'Evidence from how you actually worked, confirmed by you.',
        },
        {
          kind: 'mcq',
          q: '/reflect proposes a new rule based on one strange session. What should you do?',
          options: ['Approve it immediately', 'Reject or backlog it unless it would change a future decision', 'Delete /reflect', 'Approve every proposal'],
          answer: 1,
          explain: 'One weird session is an anecdote. Do not overfit your skills.',
        },
      ],
    },
    {
      id: 'authoring',
      title: 'Authoring skills & writing docs',
      kind: 'learn',
      minutes: 5,
      summary: 'Agent-facing prose has a higher bar than human prose.',
      steps: [
        {
          kind: 'read',
          title: 'Do not write SKILL.md freehand',
          body: `\`\`\`
/poteto-mode write a skill for verifying database migrations in this repo
\`\`\`

This matches the **Authoring a skill** playbook. It routes through Cursor's built-in \`create-skill\`, validates frontmatter and links, and ships through Opening a PR.

Why the ceremony? **Agent-facing prose has a higher bar than human prose.** An unhelpful sentence becomes an instruction some future agent follows.

Special case: a skill that drives your app to prove behavior is a **verification skill**, so use \`/create-verification-skill\` instead.`,
        },
        {
          kind: 'read',
          title: '/technical-writing',
          body: `For docs, RFCs, readmes, PR descriptions, and commit messages:

\`\`\`
/technical-writing review the readme changes
\`\`\`

It applies a layered standard with one goal: **prose a tired engineer understands on the first read**. It picks the document's **mode** first (tutorial, how-to, reference, or explanation, from the Diátaxis framework), then works sentence by sentence: who does what, one thought per sentence, nothing readable two ways.`,
        },
        {
          kind: 'match',
          q: 'Match the Diátaxis mode to its purpose.',
          pairs: [
            ['Tutorial', 'Learning by doing a guided first task'],
            ['How-to', 'Steps to reach a specific goal'],
            ['Reference', 'Dry, complete facts to look up'],
            ['Explanation', 'Background and the "why"'],
          ],
          explain: 'This course is mostly tutorial and explanation. The pstack README tables are reference.',
        },
        {
          kind: 'mcq',
          q: 'Your skill misbehaves in the middle of a feature task. What does pstack advise?',
          options: [
            'Edit the skill right there inside the feature PR',
            'Fix it in its own PR and keep the task moving',
            'Stop all work until it is fixed',
            'Ignore it forever',
          ],
          answer: 1,
          explain: 'A skill edit tangled into feature work is invisible to review and impossible to evaluate.',
        },
      ],
    },
    {
      id: 'eval',
      title: 'Test a skill change blind',
      kind: 'learn',
      minutes: 5,
      summary: 'The observer effect, and how the Eval playbook defeats it.',
      steps: [
        {
          kind: 'read',
          title: 'Agents behave differently when watched',
          body: `A skill edit affects **every future session**, so test it like an experiment:

\`\`\`
/poteto-mode run the eval playbook on this skill change. same task for both variants, candidates stay blind.
\`\`\`

The **Eval** playbook is built around one failure mode: the **observer effect**. An agent that knows it is being evaluated behaves differently. So:
- Candidates get an **organic-looking task** in sanitized folders. Never the words "eval", "test", "judge", "candidate", "benchmark"...
- Candidates never know **other candidates exist**.
- **One judge** scores all outputs under **neutral labels**, never model names.
- Whether a candidate followed the skill chain is graded from **which files it actually opened**, not what it claims.`,
        },
        {
          kind: 'widget',
          title: 'Spot the leaks',
          intro: 'This candidate setup leaks the experiment. Find every leak.',
          widget: 'eval-blind',
        },
        {
          kind: 'mcq',
          q: 'You disagree with the eval judge\'s verdict. pstack says to suspect first...',
          options: ['Your own judgment', 'The rubric', 'The weather', 'Cursor'],
          answer: 1,
          explain: 'Read every output yourself. If you disagree with the judge, suspect the rubric before your judgment.',
        },
      ],
    },
    {
      id: 'benny',
      title: 'Bonus: benny automations',
      kind: 'learn',
      minutes: 3,
      summary: 'A dormant pack that triages Slack bug reports.',
      steps: [
        {
          kind: 'read',
          title: 'What benny is',
          body: `pstack also ships a **dormant automation pack** called **benny** in \`automations/benny/\`. Its files are **not** registered as slash skills.

benny is two Cursor automations for **Slack issue reports**:
1. One **triages** each report.
2. The other **reproduces confirmed bugs** with real UI evidence, and may prepare a small draft fix.

To set it up, point Cursor at \`FOR_AGENTS.md\` and name the target repo. Setup copies the pack to \`.cursor/automations/benny/\`, enables pstack there for shared skills, and keeps your configuration **outside** the copied pack (for example in \`.cursor/benny/\`). Then send a harmless test report and check every reply stays in the original Slack thread.`,
        },
        {
          kind: 'mcq',
          q: 'Why are benny\'s files not slash commands?',
          options: [
            'They are broken',
            'It is a dormant automation pack you set up per repository, not a chat skill',
            'Slack does not allow it',
            'They are secret',
          ],
          answer: 1,
          explain: 'You opt in by running the setup in a target repo.',
        },
      ],
    },
    {
      id: 'make-it-yours-quiz',
      title: 'Unit quiz: Make it yours',
      kind: 'quiz',
      minutes: 3,
      summary: 'Five questions.',
      steps: [
        {
          kind: 'mcq',
          q: 'Where does /automate-me write your personal mode?',
          options: ['.cursor/skills/<your-name>-mode/SKILL.md', 'README.md', 'pstack-models.mdc', '~/Desktop'],
          answer: 0,
          explain: 'A project skill, opened as a PR for you to review.',
        },
        {
          kind: 'mcq',
          q: 'How many parallel reviewers does /reflect use?',
          options: ['1', '3', '23', 'As many as there are files'],
          answer: 1,
          explain: 'Three reviewers, then a synthesizer sorts into Accepted, Rejected and Backlog.',
        },
        {
          kind: 'mcq',
          q: 'Which word may appear in an eval candidate\'s task prompt?',
          options: ['"benchmark"', '"candidate"', '"rubric"', '"add pagination to the users list"'],
          answer: 3,
          explain: 'The prompt must look like an organic user request.',
        },
        {
          kind: 'mcq',
          q: 'Why is agent-facing prose held to a higher bar?',
          options: [
            'Agents are picky readers',
            'An unhelpful sentence becomes an instruction a future agent follows',
            'It is longer',
            'It is not',
          ],
          answer: 1,
          explain: 'Every sentence in a skill is a potential instruction.',
        },
        {
          kind: 'mcq',
          q: '/technical-writing first decides...',
          options: ['The font', "The document's mode: tutorial, how-to, reference or explanation", 'The word count', 'The language'],
          answer: 1,
          explain: 'Mode first, then sentence-level rules.',
        },
      ],
    },
  ],
}
