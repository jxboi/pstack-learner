import type { Unit } from '../types'

export const foundations: Unit = {
  id: 'foundations',
  index: 1,
  title: 'Start here: agents, skills & plugins',
  tagline: 'Zero to "I get what pstack is" in 15 minutes.',
  icon: '🌱',
  hue: 150,
  goals: [
    'Explain what an AI coding agent is in one sentence',
    'Tell a skill, a rule, and a plugin apart',
    'Say what problem pstack solves and why it exists',
  ],
  lessons: [
    {
      id: 'what-is-an-agent',
      title: 'What is an AI coding agent?',
      kind: 'learn',
      minutes: 4,
      summary: 'The tiny loop that powers every AI coding tool.',
      steps: [
        {
          kind: 'read',
          title: 'Chatbots talk. Agents act.',
          body: `A normal chatbot answers questions with text. An **AI coding agent** goes further. It can **read your files**, **run commands**, **edit code**, and **check the result**, all by itself, in a loop.

You give it a goal like "fix the login bug". It decides what to look at, makes changes, runs the app, and repeats until it thinks it is done.`,
          callout: {
            tone: 'analogy',
            text: 'Think of a very fast new hire. They never get tired and they type at superhuman speed. But they only know what you tell them, and they sometimes say "done!" before checking their work.',
          },
        },
        {
          kind: 'widget',
          title: 'Watch the agent loop',
          intro: 'Press play, or step through it. Notice that the agent keeps cycling until a check passes.',
          widget: 'agent-loop',
        },
        {
          kind: 'mcq',
          q: 'What makes an agent different from a plain chatbot?',
          options: [
            'It uses a bigger AI model',
            'It can take actions (read files, run commands, edit code) in a loop',
            'It only answers coding questions',
            'It never makes mistakes',
          ],
          answer: 1,
          explain: 'The key word is **act**. Agents use tools in a loop. Model size has nothing to do with it, and agents definitely make mistakes.',
        },
        {
          kind: 'read',
          title: 'Where pstack lives: Cursor',
          body: `**Cursor** is a code editor (built on VS Code) with an AI agent chat built in. In that chat you can type a **slash command**, like \`/poteto-mode\`, to load a specific set of instructions for the agent.

Cursor also lets an agent start **subagents**: helper agents that work on a slice of the job in parallel and report back. pstack uses subagents a lot. Hold on to that idea.`,
          callout: {
            tone: 'key',
            text: 'Agent = AI that acts in a loop. Subagent = a helper agent your agent spawns. Slash command = how you call up a skill.',
          },
        },
        {
          kind: 'mcq',
          q: 'Your agent starts three helper agents to each read a different folder at the same time. What are those helpers called?',
          options: ['Plugins', 'Subagents', 'Rules', 'Playbooks'],
          answer: 1,
          explain: 'Helpers spawned by an agent are **subagents**. They work in parallel and report back to the parent.',
        },
        {
          kind: 'mcq',
          q: 'The agent says "Done! The bug is fixed." It never ran the app. Based on the analogy, what should you think?',
          options: [
            'Great, ship it',
            'Be suspicious. Saying "done" is not the same as proving it works',
            'The agent is broken and should be uninstalled',
            'You must fix it yourself by hand',
          ],
          answer: 1,
          explain: 'This is the exact weakness pstack is designed to fix. You will meet the **Prove It Works** principle later.',
        },
        {
          kind: 'recap',
          title: 'You now know',
          points: [
            'An agent reads, runs, edits and checks in a loop.',
            'Cursor is the editor where pstack runs. Slash commands load skills.',
            'Agents can spawn subagents to work in parallel.',
            'Agents can claim success without proof. That is a problem worth solving.',
          ],
        },
      ],
    },
    {
      id: 'skills-rules-plugins',
      title: 'Skills, rules & plugins',
      kind: 'learn',
      minutes: 5,
      summary: 'The three building blocks pstack is made of.',
      steps: [
        {
          kind: 'read',
          title: 'A skill is a recipe card',
          body: `A **skill** is a plain Markdown file named \`SKILL.md\` that teaches the agent how to do one kind of job. It is written in normal English, like a recipe card.

It has two parts:
- **Frontmatter**: a small header between \`---\` lines. It holds the skill's \`name\` and a \`description\` that says when to use it.
- **Body**: the actual instructions, steps and rules.

When you type \`/how\`, Cursor loads the \`how\` skill and the agent follows its recipe.`,
          callout: { tone: 'analogy', text: 'A skill is to an agent what a recipe card is to a cook. The cook is talented. The card makes the result consistent.' },
        },
        {
          kind: 'widget',
          title: 'Dissect a real SKILL.md',
          intro: 'This is a real skill from pstack. Tap each highlighted part to see what it does.',
          widget: 'skill-anatomy',
        },
        {
          kind: 'read',
          title: 'Rules and plugins',
          body: `A **rule** is a set of instructions Cursor can add to every chat automatically. Rules live in \`.mdc\` files. pstack writes one rule, \`pstack-models.mdc\`, to remember which AI models you picked.

A **plugin** is a bundle you install in one go. It can hold many skills, plus **agents** (preset personas for subagents). pstack is a plugin. You install it with:

\`\`\`
/add-plugin pstack
\`\`\`

The plugin's ID card is a small file, \`.cursor-plugin/plugin.json\`. It says the name, version, and where the skills and agents folders are.`,
        },
        {
          kind: 'match',
          q: 'Match each term to what it is.',
          pairs: [
            ['Skill', 'A SKILL.md recipe that teaches the agent one job'],
            ['Rule', 'Instructions Cursor can apply to every chat automatically'],
            ['Plugin', 'An installable bundle of skills and agents'],
            ['plugin.json', "The plugin's ID card: name, version, folders"],
          ],
          explain: 'Skills are the recipes, rules are always-on notes, and the plugin is the box they ship in.',
        },
        {
          kind: 'mcq',
          q: 'In a SKILL.md, what does the `description` field in the frontmatter mostly help with?',
          code: `---
name: how
description: "Use for \\"how does X work\\", code walkthroughs before
changing something..."
---`,
          options: [
            'Styling the skill in the editor',
            'Telling the agent (and you) when this skill should be used',
            'Storing the skill version number',
            'Listing which files the skill may edit',
          ],
          answer: 1,
          explain: 'The description is a "use me when..." note. Agents read it to decide if the skill fits the task.',
        },
        {
          kind: 'recap',
          title: 'You now know',
          points: [
            'Skill = SKILL.md recipe with frontmatter + body.',
            'Rule = always-on instructions in an .mdc file.',
            'Plugin = installable bundle. pstack is one.',
            'Install pstack with /add-plugin pstack.',
          ],
        },
      ],
    },
    {
      id: 'meet-pstack',
      title: 'Meet pstack',
      kind: 'learn',
      minutes: 5,
      summary: 'Who made it, what problem it fixes, and its one-line philosophy.',
      steps: [
        {
          kind: 'read',
          title: 'The problem: slop',
          body: `There is a growing complaint that AI writes **slop**: too much code, padded with junk, that looks done but is not quite right. Lots of lines, little quality.

pstack was written by **Lauren Tan (poteto)**, who has worked on huge codebases at Meta, Netflix and Cursor, and is on the React core team working on React Compiler. pstack is the set of skills she uses every day to ship high-quality code at Cursor.`,
          image: { src: '/pstack-logo.png', alt: 'The pstack logo', credit: 'pstack logo, MIT licensed' },
        },
        {
          kind: 'read',
          title: 'The motto',
          body: `pstack's tagline is:

**"If you want to go fast, go deep first."**

The goal is *not* to write more code. It is the opposite. pstack helps the agent write **less code, but better code**, and prove that it works.`,
          callout: { tone: 'key', text: 'Less code. Higher quality. Proof, not promises.' },
        },
        {
          kind: 'widget',
          title: 'Slop vs. pstack, side by side',
          intro: 'Same bug, two fixes. Flip between them and compare.',
          widget: 'slop-vs-clean',
        },
        {
          kind: 'read',
          title: 'Fearless parallelism',
          body: `Here is the payoff. If you can trust one agent to do careful, *verifiable* work, you can run **many agents at once** without fear. pstack calls this **fearless parallelism**.

It also uses **many AI models**. Each model has strengths and blind spots, so pstack often asks several models to attempt or review the same thing. By default, code work goes to a fast code model, and the hardest changes, writing, and judgment go to the strongest reasoning model. You can change all of it.`,
        },
        {
          kind: 'multi',
          q: 'Which of these are goals of pstack? Select all that apply.',
          options: [
            'Write as many lines of code as possible',
            'Write less, but higher-quality code',
            'Prove changes work with real evidence',
            'Let you run many agents in parallel with confidence',
            'Lock you into a single AI model',
          ],
          answers: [1, 2, 3],
          explain: 'pstack optimizes for quality and proof, which is what makes parallel agents safe. It works with any model you have.',
        },
        {
          kind: 'mcq',
          q: 'What does "go deep first" mean in practice?',
          options: [
            'Read every file in the repo before doing anything',
            'Understand, design and verify carefully, so that the speed you gain later is safe',
            'Always use the slowest AI model',
            'Write very long prompts',
          ],
          answer: 1,
          explain: 'Depth means understanding, design and proof. That rigor is what lets you go fast later without breaking things.',
        },
        {
          kind: 'recap',
          title: 'You now know',
          points: [
            'pstack is a Cursor plugin by Lauren Tan (poteto).',
            'It fights "slop": padded, unproven AI code.',
            'Motto: if you want to go fast, go deep first.',
            'Trustworthy agents unlock fearless parallelism across many models.',
          ],
        },
      ],
    },
    {
      id: 'foundations-quiz',
      title: 'Unit quiz: Foundations',
      kind: 'quiz',
      minutes: 4,
      summary: 'Six questions. Show what stuck.',
      steps: [
        {
          kind: 'mcq',
          q: 'Which file name does every skill use?',
          options: ['README.md', 'SKILL.md', 'plugin.json', 'rules.mdc'],
          answer: 1,
          explain: 'Every skill folder holds a SKILL.md with frontmatter and a body.',
        },
        {
          kind: 'mcq',
          q: 'How do you install pstack in Cursor?',
          options: ['npm install pstack', '/add-plugin pstack', 'git clone pstack', '/setup-pstack install'],
          answer: 1,
          explain: '`/add-plugin pstack` installs the plugin. `/setup-pstack` comes after, to pick models.',
        },
        {
          kind: 'mcq',
          q: 'In pstack\'s world, what is "slop"?',
          options: [
            'Code that is too short',
            'Padded, low-quality AI output that looks done but is not proven',
            'A type of database',
            'A Cursor setting',
          ],
          answer: 1,
          explain: 'Slop is volume without quality. pstack is designed to prevent it.',
        },
        {
          kind: 'sort',
          q: 'Sort each item into the building block it is.',
          buckets: ['Skill', 'Rule', 'Plugin'],
          items: [
            { text: 'how/SKILL.md', bucket: 0 },
            { text: 'pstack-models.mdc', bucket: 1 },
            { text: 'pstack (the whole bundle)', bucket: 2 },
            { text: 'unslop/SKILL.md', bucket: 0 },
          ],
          explain: 'SKILL.md files are skills, .mdc files are rules, and pstack is the plugin bundling them.',
        },
        {
          kind: 'mcq',
          q: 'Why does reliable single-agent work matter for parallelism?',
          options: [
            'It does not matter',
            'If you can trust each agent to verify its own work, you can run many at once without fear',
            'Parallel agents need fewer models',
            'Cursor only allows one agent at a time',
          ],
          answer: 1,
          explain: 'That is "fearless parallelism". Trust in each agent is what scales.',
        },
        {
          kind: 'mcq',
          q: 'An agent spawns a helper to read a large log file and send back a short summary. The helper is a...',
          options: ['rule', 'subagent', 'plugin', 'playbook'],
          answer: 1,
          explain: 'Helpers are subagents. Using them for bulky reading keeps the main chat clean, a principle you will meet later.',
        },
      ],
    },
  ],
}
