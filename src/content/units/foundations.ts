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
          q: 'A chatbot can also write code for you. So what actually makes an agent different?',
          options: [
            'It writes better code because it uses a bigger model',
            'It acts: runs tools, checks the result, and loops',
            'It remembers everything from all your past conversations',
            'It only works inside a code editor, next to your files',
          ],
          answer: 1,
          explain: 'A chatbot hands you code and stops. An agent **acts**: it reads files, runs commands, edits, looks at what happened, and loops. Model size and memory have nothing to do with it. The same model can power a chatbot or an agent.',
          hint: 'Think back to the animation. What did the agent do after it wrote the code?',
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
          explain: 'Helpers spawned by an agent are **subagents**. They work in parallel and report back to the parent. Plugins, rules and playbooks are files, not agents.',
          hint: 'Only one of these is an agent. The others are files.',
        },
        {
          kind: 'mcq',
          q: 'The agent says "Done! The bug is fixed." It never ran the app. What is the best next message to send?',
          options: [
            '"Re-read your change carefully and confirm it is correct."',
            '"Run the app, reproduce the original bug, and show me the output."',
            '"Explain your fix in more detail."',
            '"Great, thanks!"',
          ],
          answer: 1,
          explain: 'Re-reading and explaining are still just the agent **talking** about its work. Only running the real thing gives you evidence. This gap between "done" and "proven" is exactly what pstack is built to close.',
          hint: 'Which option produces something you could check yourself, rather than more words from the agent?',
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
          explain: 'Skills are the recipes, rules are always-on notes, and the plugin is the box they ship in. plugin.json is the label on that box.',
          hint: 'Start with the one you are sure of, then eliminate.',
        },
        {
          kind: 'mcq',
          q: 'You wrote a skill. It works when you type its slash command, but the agent never picks it up on its own when it should. Which part do you fix first?',
          code: `---
name: migrations
description: "Migration helper."
---`,
          options: [
            'The body: add more detailed steps',
            'The `description`: say when to use it',
            'The `name`: make it longer and more specific',
            'The folder: move it next to the code it is about',
          ],
          answer: 1,
          explain: 'The agent decides whether a skill fits by reading its **description**. "Migration helper." gives it nothing to match on. Something like "Use when writing or checking database migrations" does. The body only matters once the skill is loaded.',
          hint: 'The agent has not loaded the skill yet. Which part can it see before loading?',
        },
        {
          kind: 'mcq',
          q: 'You want the agent to use `pnpm`, never `npm`, in every chat in this project. Skill or rule?',
          options: [
            'A rule, because it should apply to every chat automatically',
            'A skill, because it teaches the agent a job',
            'A plugin, because it changes how the agent works',
            'Neither. Type it at the start of every chat.',
          ],
          answer: 0,
          explain: 'A short instruction that should **always** apply is a rule. A skill is a recipe for one kind of job, loaded when that job comes up. Typing it every time works, but you will forget.',
          hint: 'Does this instruction belong to one kind of job, or to every chat?',
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
            'Have the agent start coding sooner by skipping the reading',
            'Write less, but higher-quality code',
            'Prove changes work with real evidence',
            'Let you run many agents in parallel with confidence',
            'Use one model for everything so results stay consistent',
          ],
          answers: [1, 2, 3],
          explain: 'pstack optimizes for quality and proof, which is what makes parallel agents safe. It does the opposite of skipping the reading ("go deep first"), and it deliberately mixes models because each has different blind spots.',
          hint: 'Two options contradict things you just read: the motto, and the paragraph about models.',
        },
        {
          kind: 'mcq',
          q: 'What does "go deep first" mean in practice?',
          options: [
            'Read every file in the repo before doing anything',
            'Understand, design and prove carefully, so later speed is safe',
            'Write a detailed spec before every task',
            'Use the strongest model for every task',
          ],
          answer: 1,
          explain: 'Depth means understanding the code you touch, designing before you build, and proving the result. It is targeted, not "read everything", and it is the agent doing the work, not you writing specs.',
          hint: '"Deep" is about the quality of the work, not the amount of reading or the size of the model.',
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
          explain: 'Every skill folder holds a SKILL.md with frontmatter and a body. README.md is for humans, plugin.json describes the plugin, and .mdc files are rules.',
          hint: 'The file name says what it is.',
        },
        {
          kind: 'mcq',
          q: 'How do you install pstack in Cursor?',
          options: ['npm install pstack', '/add-plugin pstack', 'git clone pstack', '/setup-pstack install'],
          answer: 1,
          explain: '`/add-plugin pstack` installs the plugin. `/setup-pstack` comes after, to pick models. pstack is a Cursor plugin, not an npm package.',
          hint: 'It is a slash command you type in the Cursor chat.',
        },
        {
          kind: 'mcq',
          q: 'In pstack\'s world, what is "slop"?',
          options: [
            'Code that has bugs the agent did not catch',
            'Padded AI output that looks done but is not proven',
            'Code written quickly, without tests',
            'Any code an AI wrote instead of a person',
          ],
          answer: 1,
          explain: 'Slop is volume without quality: extra lines, junk, and a confident "done". Code with a bug is not automatically slop, and AI-written code is not automatically slop either. pstack exists so AI-written code is not.',
          hint: 'Slop is about padding and false confidence, not who wrote it.',
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
          hint: 'Look at the file extensions.',
        },
        {
          kind: 'mcq',
          q: 'Why does reliable single-agent work matter for parallelism?',
          options: [
            'Parallel agents share one memory, so one bad agent spoils the rest',
            'You cannot check ten results by hand, so each agent must prove its own',
            'Cursor only allows parallel agents once one has succeeded',
            'Reliable agents run faster, which leaves room for more of them',
          ],
          answer: 1,
          explain: 'You can personally review one agent. You cannot review ten. Parallelism only works when each agent brings back its own evidence. That is "fearless parallelism".',
          hint: 'Imagine ten agents finish at once. What is the bottleneck?',
        },
        {
          kind: 'mcq',
          q: 'Why does pstack often ask several different AI models to review the same work?',
          options: [
            'It is cheaper than asking one strong model',
            'Each model has different blind spots',
            'Cursor needs at least two models to run subagents',
            'So the fastest answer can be used and the rest dropped',
          ],
          answer: 1,
          explain: 'Each model has strengths and blind spots. When different models look at the same thing, one catches what another misses. You will see this idea again in /arena and /interrogate.',
          hint: 'Think about why you might ask a second doctor for an opinion.',
        },
      ],
    },
  ],
}
