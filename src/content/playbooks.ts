export type Playbook = {
  id: string
  name: string
  icon: string
  group: 'Understand' | 'Build' | 'Diagnose' | 'Ship' | 'Run' | 'Meta'
  plain: string
  signals: string[]
  example: string
}

export const PLAYBOOKS: Playbook[] = [
  { id: 'investigation', name: 'Investigation', icon: '🔎', group: 'Understand', plain: 'A read-only question. The answer is a cited explanation, not a code change.', signals: ['how does', 'why', 'are we sure', "don't change", 'explain', 'should we'], example: 'how does the cache get invalidated? don\'t change any code.' },
  { id: 'bug-fix', name: 'Bug fix', icon: '🐞', group: 'Build', plain: 'Reproduce a defect, find the root cause, fix it with runtime evidence.', signals: ['bug', 'repro', 'broken', 'duplicate', 'crash', 'fails', 'wrong'], example: 'users get two notifications after a retry. repro first, then fix and verify.' },
  { id: 'feature', name: 'Feature', icon: '✨', group: 'Build', plain: 'New or changed behavior, built from a named data shape.', signals: ['add', 'flag', 'support', 'new', 'implement', 'build'], example: 'add a --json flag. text output stays byte-identical.' },
  { id: 'refactoring', name: 'Refactoring', icon: '🧹', group: 'Build', plain: 'Change the structure without changing behavior. Pin behavior first.', signals: ['move', 'rename', 'extract', 'refactor', 'zero behavior change', 'dedupe'], example: 'move parsing into one module, zero behavior change.' },
  { id: 'perf-issue', name: 'Perf issue', icon: '⏱️', group: 'Diagnose', plain: 'Trace a measured slowness and improve it against a baseline.', signals: ['slow', 'takes', 'ms', 'startup', 'perf', 'latency'], example: 'startup takes 1.8s on this fixture. trace it and fix the measured cause.' },
  { id: 'hillclimb', name: 'Hillclimb', icon: '⛰️', group: 'Diagnose', plain: 'Improve one number again and again: one hypothesis, one measurement, keep or revert.', signals: ['hillclimb', 'metric', 'target', 'keep improving', 'get it under'], example: 'hillclimb bundle size to under 200kb, at least 10 attempts.' },
  { id: 'runtime-forensics', name: 'Runtime forensics', icon: '🩺', group: 'Diagnose', plain: 'Diagnose a live symptom like a memory leak or idle CPU spin. The deliverable is a diagnosis.', signals: ['leak', 'cpu', 'spin', 'glitch', 'memory'], example: 'the app idles at 30% cpu. find out why.' },
  { id: 'trace-forensics', name: 'Trace forensics', icon: '📈', group: 'Diagnose', plain: 'Diagnose a captured profile or trace someone hands you.', signals: ['cpuprofile', 'trace', 'heap snapshot', 'spindump', 'profile'], example: 'here is a cpuprofile from a user. what is hot?' },
  { id: 'prototype', name: 'Prototype', icon: '🧪', group: 'Build', plain: 'A throwaway sketch to make a design decision cheaply.', signals: ['prototype', 'mock it up', 'try this layout', 'sketch'], example: 'prototype three layouts for the settings page so we can pick one.' },
  { id: 'visual-parity', name: 'Visual parity', icon: '🖼️', group: 'Build', plain: 'Pixel-exact UI equivalence between two implementations.', signals: ['pixel', 'parity', 'looks identical', 'migrate styling'], example: 'port this screen to the new styling system, pixel-identical.' },
  { id: 'authoring-a-skill', name: 'Authoring a skill', icon: '✍️', group: 'Meta', plain: 'Writing or editing a SKILL.md, with validation and review.', signals: ['write a skill', 'SKILL.md', 'edit the skill'], example: 'write a skill for verifying database migrations in this repo.' },
  { id: 'eval', name: 'Eval', icon: '⚖️', group: 'Meta', plain: 'Test how a skill or prompt change affects agent behavior, blinded.', signals: ['eval', 'test this skill change', 'a/b'], example: 'run the eval playbook on this skill change.' },
  { id: 'babysit', name: 'Babysit', icon: '🍼', group: 'Ship', plain: 'Drive a PR or stack to merge-ready: conflicts, then review threads, then CI. Never merges.', signals: ['babysit', 'get it green', 'check on pr', 'anything outstanding'], example: 'babysit this pr. get it green.' },
  { id: 'shipping', name: 'Shipping', icon: '🚢', group: 'Ship', plain: 'Independently verify a green stack, then land the verified run from the bottom.', signals: ['land', 'ship', 'merge the stack'], example: 'land the stack.' },
  { id: 'autonomous-run', name: 'Autonomous run', icon: '🔁', group: 'Run', plain: 'Drive one long task to a checkable finish condition without stopping.', signals: ['until done', '/loop', "don't stop", 'going to bed'], example: 'keep going until every fixture passes. /loop until done.' },
  { id: 'orchestrate', name: 'Orchestrate', icon: '🎼', group: 'Run', plain: 'A multi-day program with many PRs and fleets of subagents under one coordinator chat.', signals: ['orchestrate', 'own this migration', 'whole project'], example: 'orchestrate the store migration until every package is merged.' },
  { id: 'autopilot-full', name: 'Autopilot-full', icon: '🛩️', group: 'Run', plain: 'A queue of independent PRs run all the way to merged, one owner per PR.', signals: ['full autopilot', 'merged by morning', 'queue'], example: 'full autopilot on this queue. i want them merged by morning.' },
  { id: 'autopilot-stack', name: 'Autopilot-stack', icon: '🥞', group: 'Run', plain: 'Build and verify one linear stack for you to review and land yourself.', signals: ['stack them', "don't ship", "i'll land"], example: "autopilot these five changes but stack them, don't ship." },
  { id: 'session-pickup', name: 'Session pickup', icon: '🧳', group: 'Run', plain: "Resume or take over another agent's in-flight work.", signals: ['take over', 'pick up', 'continue the branch', 'resume'], example: 'take over this branch. read the decision log and continue.' },
  { id: 'pause-safely', name: 'Pause safely', icon: '⏸️', group: 'Run', plain: 'Suspend work cleanly so it can be resumed later.', signals: ['pause', 'stop for now', 'going offline'], example: 'pause safely, I need to restart Cursor.' },
  { id: 'multi-phase-plan', name: 'Multi-phase plan', icon: '🗂️', group: 'Run', plain: 'Work that spans phases or stacked PRs.', signals: ['phases', 'plan', 'stacked prs'], example: 'plan this in phases as stacked prs.' },
  { id: 'worktree-cleanup', name: 'Worktree cleanup', icon: '🧽', group: 'Meta', plain: 'Free disk by pruning merged or abandoned worktrees and old simulators, safely.', signals: ['disk', 'worktrees', 'free up space', 'prune'], example: "what's eating my disk? prune the safe worktrees." },
  { id: 'opening-a-pr', name: 'Opening a PR', icon: '📬', group: 'Ship', plain: 'Small ordered commits, cleaned diff, briefing-style description. Runs at the end of every other playbook.', signals: ['open the pr', 'open a pr'], example: 'open the pr. small ordered commits, evidence in the description.' },
]

export const BUG_FIX_STEPS = [
  'Reproduce it yourself on the matching surface.',
  'Binary-search the cause: form hypotheses, rule them out with runtime evidence.',
  'Plan the fix. If it crosses a function boundary, architect first. Delegate to a subagent.',
  'Verify on the same surface. The original repro now passes.',
  'Stage commits so the failing repro lands before the fix.',
  'Run Opening a PR.',
]
