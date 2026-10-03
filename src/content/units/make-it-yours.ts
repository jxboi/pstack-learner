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
            'It asks you to describe your style in a short interview',
            'It mines your recent chats, then asks which patterns are really you',
            'It starts from poteto-mode and asks what to change',
            'It reads your code and infers your style from it',
          ],
          answer: 1,
          explain: 'People are bad at describing their own habits but good at recognizing them. So it gathers evidence from how you actually worked, then has you confirm it. Your code shows how you write code, not how you like to delegate or verify.',
          hint: 'It does not trust self-description.',
        },
        {
          kind: 'mcq',
          q: '/reflect proposes a new rule based on one strange session. What should you do?',
          options: [
            'Approve it. The lesson is fresh.',
            'Reject or backlog it unless it would change a future decision',
            'Approve it, then remove it later if it causes trouble',
            'Approve it, since three reviewers suggested it',
          ],
          answer: 1,
          explain: 'One weird session is an anecdote. A rule changes every future session, and bad rules are rarely noticed, let alone removed. Backlog it, and promote it if it keeps happening.',
          hint: 'Who pays for a bad rule?',
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
          explain: 'This course is mostly tutorial and explanation. The pstack README tables are reference. Mixing modes is a common reason docs feel hard to use: a how-to that stops to explain history loses the reader who just wants the steps.',
          hint: 'How-to assumes you know what you want. Tutorial assumes you are new.',
        },
        {
          kind: 'mcq',
          q: 'Your skill misbehaves in the middle of a feature task. What does pstack advise?',
          options: [
            'Edit the skill right there inside the feature PR',
            'Fix it in its own PR and keep the task moving',
            'Stop the feature until the skill is fixed',
            'Note it in the feature PR description for later',
          ],
          answer: 1,
          explain: 'A skill edit tangled into feature work is invisible to review and impossible to evaluate on its own. A separate PR keeps both changes reviewable without blocking the feature.',
          hint: 'A skill change affects every future session. How should it be reviewed?',
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
          options: ['Your own judgment', 'The rubric', 'The judge model', 'The candidate prompts'],
          answer: 1,
          explain: 'Read every output yourself. If you disagree with the judge, suspect the rubric first: the judge scored what it was told to value, and the rubric may not say what you actually care about. Fix the rubric and rerun.',
          hint: 'The judge only scores what it was told to look for.',
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
            'They are unfinished and not ready to use',
            'They are automations you set up per repo, not chat skills',
            'Slack does not allow bots to use slash commands',
            'They need an admin to unlock them first',
          ],
          answer: 1,
          explain: 'You opt in by running the setup in a target repo. Chat skills are for things you ask for. benny runs on its own when a Slack report arrives.',
          hint: 'Who triggers benny: you, or a Slack message?',
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
          q: 'Why does /automate-me open a PR for your new mode skill instead of just saving it?',
          options: [
            'So you can review it like any other change',
            'Because Cursor only loads skills from merged PRs',
            'So other people can vote on your style',
            'Because skills must pass CI to work',
          ],
          answer: 0,
          explain: 'Your mode skill steers every future session, so it deserves the same review as code. The PR is for you, not a technical requirement.',
          hint: 'What do you do with any change you want to check before it takes effect?',
        },
        {
          kind: 'mcq',
          q: 'Why does /reflect wait for your approval before changing any skill?',
          options: [
            'A skill change affects every future session',
            'Its reviewers are often wrong',
            'Cursor does not allow agents to edit skills',
            'To give you a chance to rename the skill',
          ],
          answer: 0,
          explain: 'A skill change affects every future session, so a human decides. The three reviewers and the synthesizer propose. You approve.',
          hint: 'How many sessions does one skill edit touch?',
        },
        {
          kind: 'mcq',
          q: 'Which task prompt is safe to give an eval candidate?',
          options: [
            '"Add pagination to the users list. Your output will be compared."',
            '"Add pagination to the users list. Follow the skill exactly."',
            '"Add pagination to the users list."',
            '"Benchmark task 3: add pagination to the users list."',
          ],
          answer: 2,
          explain: 'Only the plain request looks organic. "Will be compared" and "Benchmark" announce the experiment. "Follow the skill exactly" changes behavior too: you want to see whether it follows the skill on its own.',
          hint: 'Which one could a real user have typed?',
        },
        {
          kind: 'mcq',
          q: 'Why is agent-facing prose held to a higher bar?',
          options: [
            'Agents read slower than humans',
            'An agent may follow a vague sentence as an instruction',
            'Agents ignore anything not in a bullet list',
            'Agent prose is read once, so it must be perfect',
          ],
          answer: 1,
          explain: 'A human skims past a vague sentence. An agent may treat it as an instruction, in every session. Every sentence in a skill is a potential instruction.',
          hint: 'What does an agent do with a sentence in a skill?',
        },
        {
          kind: 'mcq',
          q: '/technical-writing first decides...',
          options: ['How senior the audience is', "The document's mode, like tutorial or reference", 'The target length of the document', 'Which AI tells to remove first'],
          answer: 1,
          explain: 'Mode first, then sentence-level rules. The mode decides what belongs in the document at all. Polishing sentences in the wrong kind of document wastes effort.',
          hint: 'It is the framework from the Diátaxis matching question.',
        },
      ],
    },
  ],
}
