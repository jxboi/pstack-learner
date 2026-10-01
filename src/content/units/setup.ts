import type { Unit } from '../types'

export const setup: Unit = {
  id: 'setup',
  index: 2,
  title: 'Tour the repo & set it up',
  tagline: 'Walk the folders, then install pstack and choose your models.',
  icon: '🗺️',
  hue: 205,
  goals: [
    'Find your way around the pstack folder',
    'Explain what /setup-pstack writes and why',
    'Run a first real task and read the todo list',
  ],
  lessons: [
    {
      id: 'repo-map',
      title: 'The map of the repo',
      kind: 'learn',
      minutes: 5,
      summary: 'Every folder in pstack, explained in plain words.',
      steps: [
        {
          kind: 'read',
          title: 'pstack lives inside a bigger repo',
          body: `pstack is one folder inside **cursor/plugins** on GitHub, a repo that holds many Cursor plugins. Everything for pstack sits under \`pstack/\`.

The good news: it is mostly **Markdown**. There is very little "real" code. The skills are written instructions, so you can read them like documentation.`,
          callout: { tone: 'tip', text: 'You can open any SKILL.md on GitHub and read it like an article. That is the best way to go deeper after this course.' },
        },
        {
          kind: 'widget',
          title: 'Explore the folders',
          intro: 'Click any folder or file to learn what lives there.',
          widget: 'repo-explorer',
        },
        {
          kind: 'sort',
          q: 'Where would you find each thing?',
          buckets: ['skills/', 'agents/', 'docs/guide/', 'automations/'],
          items: [
            { text: 'The /poteto-mode recipe and its 23 playbooks', bucket: 0 },
            { text: 'Comment Sicko, the comment-hating reviewer', bucket: 1 },
            { text: 'A 10-page tutorial for humans', bucket: 2 },
            { text: 'Benny, which triages bug reports from Slack', bucket: 3 },
            { text: 'principle-prove-it-works', bucket: 0 },
          ],
          explain: 'Skills (including the 23 principle-* skills) live in skills/. Subagent personas live in agents/. The human guide lives in docs/guide/. Benny is a dormant automation pack.',
        },
        {
          kind: 'mcq',
          q: 'How many principle skills does pstack ship (folders named principle-*)?',
          options: ['5', '10', '23', '100'],
          answer: 2,
          explain: 'There are 23 principles, and also 23 playbooks inside poteto-mode. Same number, different things.',
          hint: 'It is the same number as the playbooks.',
        },
        {
          kind: 'recap',
          title: 'Repo map',
          points: [
            'skills/ holds poteto-mode, about 20 workflow skills, and 23 principles.',
            'agents/ holds subagent personas: poteto-agent and comment-sicko.',
            'docs/guide/ is the human tutorial this course is based on.',
            '.cursor-plugin/plugin.json is the plugin ID card.',
          ],
        },
      ],
    },
    {
      id: 'install-and-models',
      title: 'Install & pick your models',
      kind: 'learn',
      minutes: 6,
      summary: '/add-plugin, /setup-pstack, and the model roles.',
      steps: [
        {
          kind: 'read',
          title: 'Two commands to start',
          body: `Setup is one command plus a short conversation.

\`\`\`
/add-plugin pstack
/setup-pstack
\`\`\`

\`/setup-pstack\` detects which AI models you can use, asks for a **reasoning budget** (how much "thinking" to pay for), shows you each **role**, and asks what you want.`,
        },
        {
          kind: 'read',
          title: 'Roles: who does which job',
          body: `pstack gives different jobs to different models. These jobs are called **roles**. A few examples:

- **feature, bug-fix, refactoring**: the model that writes code. Default: a fast code model.
- **judgment and prose**: the model that makes calls and writes text. Default: the strongest reasoning model.
- **hardest tasks**: gnarly design and concurrency work. Default: also the strongest model.
- **Panels** like *arena runners* or *interrogate reviewers*: a **list** of models. One subagent runs per entry, so the list length sets the panel size.

Your choices get written to a small rule file: \`~/.cursor/rules/pstack-models.mdc\`. Every pstack skill reads it.`,
          callout: { tone: 'analogy', text: 'Like casting a film. The setup step decides which actor plays which part. You can recast any part later.' },
        },
        {
          kind: 'widget',
          title: 'Try the setup',
          intro: 'Pick a budget and recast a few roles. Watch the rule file update live.',
          widget: 'model-roles',
        },
        {
          kind: 'mcq',
          q: 'You set a role to `auto` (or `inherit-parent`). What happens?',
          options: [
            'pstack picks a random model',
            'The role uses a model literally named "auto"',
            'The subagent inherits whatever model your main chat is using',
            'The role is disabled',
          ],
          answer: 2,
          explain: 'Both values mean "leave the model field out", so the subagent uses the parent chat model. Neither is a real model name.',
        },
        {
          kind: 'mcq',
          q: 'The arena runners panel lists three models. How many candidate subagents run?',
          options: ['1', '3', '23', 'It depends on the weather'],
          answer: 1,
          explain: 'One subagent per entry. The list length is the panel size.',
        },
        {
          kind: 'read',
          title: 'The verification offer',
          body: `At the end, \`/setup-pstack\` checks if your project has a way to **prove app behavior** (a \`verify-*\` skill or an existing test harness). If not, it offers **once** to generate one with \`/create-verification-skill\`. Saying no is fine. You can run it later.

Last step: **start a new chat**. The model rule applies to new sessions.`,
          callout: { tone: 'warn', text: 'Upgrading from a version before 0.15.3? Old rule files pin old default models. Delete those lines (or the file) and run /setup-pstack again.' },
        },
        {
          kind: 'order',
          q: 'Put the setup flow in order.',
          items: [
            'Run /add-plugin pstack',
            'Run /setup-pstack and pick a budget',
            'Review roles and change any you care about',
            'Accept or decline the verification-skill offer',
            'Start a new chat so the rule applies',
          ],
          explain: 'Install, configure, optionally add verification, then a fresh chat picks up the new rule.',
        },
      ],
    },
    {
      id: 'first-task',
      title: 'Your first real task',
      kind: 'practice',
      minutes: 4,
      summary: 'Describe a small task like you would to a colleague.',
      steps: [
        {
          kind: 'read',
          title: 'Start small and real',
          body: `Pick something real but small. Describe it like you would to a colleague:

\`\`\`
/poteto-mode add a --json flag to this command. text output stays byte-identical. verify both.
\`\`\`

Then **watch the todo list**. Its first items are the matched playbook's steps, copied in word for word. Here that is the **Feature** playbook.

If the agent decides to skip a step, it does not quietly vanish. It stays in the list as \`skip: <reason>\`, so you can see what it chose not to do.`,
          callout: { tone: 'key', text: '/poteto-mode is sticky. After you start it, it stays on for the conversation until you say to stop.' },
        },
        {
          kind: 'mcq',
          q: 'In the prompt above, which part is the "check" that proves the work?',
          options: [
            'add a --json flag',
            'to this command',
            'text output stays byte-identical. verify both.',
            '/poteto-mode',
          ],
          answer: 2,
          explain: 'A good prompt gives a goal and a way to check it. "Byte-identical" and "verify both" are checks the agent can actually run.',
        },
        {
          kind: 'mcq',
          q: 'The todo list shows `skip: no cross-function boundary, design step not needed`. What does that tell you?',
          options: [
            'The agent crashed',
            'The agent chose not to do that step, and told you why',
            'You need to rerun /setup-pstack',
            'The step was done twice',
          ],
          answer: 1,
          explain: 'Skipped steps stay visible with a reason. You can disagree and ask for the step anyway.',
        },
        {
          kind: 'mcq',
          q: 'After your first /poteto-mode message, you type "now also add a --yaml flag". Do you need to type /poteto-mode again?',
          options: [
            'Yes, every message needs it',
            'No, the mode is sticky until you opt out',
            'Only on Tuesdays',
            'Yes, otherwise the agent ignores you',
          ],
          answer: 1,
          explain: 'poteto-mode stays on for the conversation. Opt out by saying so.',
        },
      ],
    },
    {
      id: 'setup-quiz',
      title: 'Unit quiz: Repo & setup',
      kind: 'quiz',
      minutes: 3,
      summary: 'Five questions on folders and setup.',
      steps: [
        {
          kind: 'mcq',
          q: 'Where does /setup-pstack write your model choices?',
          options: ['package.json', '~/.cursor/rules/pstack-models.mdc', 'skills/poteto-mode/SKILL.md', 'A cloud database'],
          answer: 1,
          explain: 'It writes a small, always-applied rule file that every pstack skill reads.',
        },
        {
          kind: 'mcq',
          q: 'A role has no line in your rule file. What model does it use?',
          options: ['None, it fails', "The skill's built-in default", 'A random model', 'The cheapest model'],
          answer: 1,
          explain: 'You only override what you care about. Missing lines fall back to defaults.',
        },
        {
          kind: 'mcq',
          q: 'What file is the plugin\'s "ID card"?',
          options: ['.cursor-plugin/plugin.json', 'LICENSE', 'docs/guide/README.md', 'agents/poteto-agent.md'],
          answer: 0,
          explain: 'plugin.json holds the name, version, description and the skills/agents folders.',
        },
        {
          kind: 'mcq',
          q: 'You changed models in /setup-pstack, but the current chat still uses the old ones. Why?',
          options: [
            'The rule only applies to new chats',
            'Setup failed silently',
            'Models cannot be changed',
            'You need to reinstall Cursor',
          ],
          answer: 0,
          explain: 'Start a new chat after setup. The rule applies to new sessions.',
        },
        {
          kind: 'mcq',
          q: 'What does a skipped playbook step look like in the todo list?',
          options: ['It disappears', 'It turns red', 'It stays, marked `skip: <reason>`', 'It moves to the end'],
          answer: 2,
          explain: 'Transparency. You always see what the agent chose not to do, and why.',
        },
      ],
    },
  ],
}
