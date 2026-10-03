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

The good news: it is mostly **Markdown**. There is very little "real" code. The skills are written instructions, so you can read them like documentation.

Five places matter:

- **\`.cursor-plugin/plugin.json\`**: the plugin's ID card. Name, version, description, and where the skills and agents live.
- **\`skills/\`**: the heart of pstack. One folder per skill, including \`poteto-mode\` with its 23 playbooks, plus **23 principle skills** named \`principle-*\`.
- **\`agents/\`**: personas for subagents, like **Comment Sicko**, a reviewer who hates code comments.
- **\`docs/guide/\`**: a 10-page tutorial for humans. This course follows it.
- **\`automations/benny/\`**: **Benny**, a dormant automation that triages bug reports from Slack.`,
          callout: { tone: 'tip', text: 'You can open any SKILL.md on GitHub and read it like an article. That is the best way to go deeper after this course.' },
        },
        {
          kind: 'widget',
          title: 'Explore the folders',
          intro: 'Optional: tap anything you want to know more about. You have already seen everything the questions need.',
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
          hint: 'A principle is packaged the same way as any other skill.',
        },
        {
          kind: 'mcq',
          q: 'The agent followed the Bug fix playbook and you want to read exactly what that playbook told it to do. Where do you look?',
          options: ['skills/poteto-mode/', 'agents/', 'docs/guide/', '.cursor-plugin/plugin.json'],
          answer: 0,
          explain: 'The 23 playbooks live inside the poteto-mode skill, in skills/poteto-mode/. docs/guide/ explains pstack to humans, but the instructions the agent actually follows are in the skill. Reading the source is the best way to settle "why did it do that?".',
          hint: 'You want what the agent reads, not what humans read.',
        },
        {
          kind: 'recap',
          title: 'Repo map',
          points: [
            'skills/ holds poteto-mode (with its 23 playbooks), the other skills, and 23 principles.',
            'agents/ holds subagent personas, like Comment Sicko.',
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
            'pstack picks the cheapest model it can find',
            'The role uses a model literally named "auto"',
            'The subagent uses your main chat\'s model',
            'The role is disabled and its step gets skipped',
          ],
          answer: 2,
          explain: 'Both values mean "leave the model field out", so the subagent uses the parent chat model. Neither is a real model name. This trips people up often enough to be on the pitfall list at the end of the course.',
          hint: 'Think of what "inherit-parent" literally says.',
        },
        {
          kind: 'mcq',
          q: 'Your arena runners panel lists three models. You want five candidates every time. What do you change?',
          options: [
            'Raise the reasoning budget so each runner tries harder',
            'Add two more models to the arena runners list',
            'Set arena runners to `auto` so it decides',
            'Nothing. Arena always runs five.',
          ],
          answer: 1,
          explain: 'One subagent runs per entry, so the list length is the panel size. The budget changes how hard each model thinks, not how many run. `auto` means "inherit the parent model", not "more".',
          hint: 'How is the panel size decided?',
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
          explain: 'Install, configure, optionally add verification, then a fresh chat picks up the new rule. The new chat has to come last: start it earlier and it misses the rule.',
          hint: 'You cannot configure a plugin you have not installed.',
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
          explain: 'A good prompt gives a goal and a way to check it. "Byte-identical" and "verify both" are checks the agent can actually run. "add a --json flag" is the goal, not the check.',
          hint: 'Which part could pass or fail?',
        },
        {
          kind: 'mcq',
          q: 'The todo list shows `skip: no cross-function boundary, design step not needed`. What does that tell you?',
          options: [
            'The agent hit an error and could not run that step',
            'The agent chose not to do that step, and told you why',
            'A setting is off, so you need to rerun /setup-pstack',
            'The step was done earlier, so it was not repeated',
          ],
          answer: 1,
          explain: 'Skipped steps stay visible with a reason. You can disagree and ask for the step anyway. Here the agent judged the change too small to need a design pass.',
          hint: 'Read the text after "skip:".',
        },
        {
          kind: 'mcq',
          q: 'After your first /poteto-mode message, you type "now also add a --yaml flag". Do you need to type /poteto-mode again?',
          options: [
            'Yes, every message needs it',
            'No, the mode is sticky until you opt out',
            'Only if the new request is a different playbook',
            'Yes, or it will route your message to the wrong skill',
          ],
          answer: 1,
          explain: 'poteto-mode stays on for the conversation. Opt out by saying so. (When you change subjects you say "new task", which you will meet in the next unit, but you still do not retype the command.)',
          hint: 'Look at the "key" callout on the previous screen.',
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
          q: 'A teammate says pstack keeps using the wrong model for bug fixes. Which file do you check?',
          options: ['package.json', '~/.cursor/rules/pstack-models.mdc', 'skills/poteto-mode/SKILL.md', '.cursor-plugin/plugin.json'],
          answer: 1,
          explain: 'Model choices live in a small, always-applied rule file that every pstack skill reads. The skill files hold only the defaults. If a line in the rule file pins an old model, that wins.',
          hint: 'Where did /setup-pstack save the choices?',
        },
        {
          kind: 'mcq',
          q: 'A role has no line in your rule file. What model does it use?',
          options: ['None, it fails', "The skill's built-in default", 'Whatever model your chat is using', 'The first model in the file'],
          answer: 1,
          explain: 'You only override what you care about. Missing lines fall back to the skill\'s default. "Whatever your chat uses" is what `auto` means, and you only get that by asking for it.',
          hint: 'An empty line and `auto` are not the same thing.',
        },
        {
          kind: 'mcq',
          q: 'You decline the offer to generate a verification skill during /setup-pstack. What happens?',
          options: [
            'Nothing breaks. You can run /create-verification-skill later.',
            'Setup stops, and you must run it again from the start',
            'pstack asks again at the start of every chat',
            'pstack turns off verification for good',
          ],
          answer: 0,
          explain: 'It offers **once**. Saying no is fine. Agents still verify with whatever they can run. A verification skill just makes "drive the real app" easy.',
          hint: 'The setup lesson said how many times it asks.',
        },
        {
          kind: 'mcq',
          q: 'You changed models in /setup-pstack, but the current chat still uses the old ones. Why?',
          options: [
            'The rule only applies to new chats',
            'Setup failed silently',
            'You also need to run /add-plugin pstack again',
            'Model changes take a day to apply',
          ],
          answer: 0,
          explain: 'Start a new chat after setup. The rule is loaded when a chat starts, so an open chat keeps the old one.',
          hint: 'What was the last step of the setup flow?',
        },
        {
          kind: 'mcq',
          q: 'What does a skipped playbook step look like in the todo list?',
          options: ['It disappears', 'It is crossed out with no reason', 'It stays, marked `skip: <reason>`', 'It is moved to a separate "skipped" list'],
          answer: 2,
          explain: 'Transparency. You always see what the agent chose not to do, and why, right where the step would have been. A reason is what lets you disagree.',
          hint: 'What would you need in order to argue with the decision?',
        },
      ],
    },
  ],
}
