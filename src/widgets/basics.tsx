import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'motion/react'

/* ---------------- agent loop ---------------- */

const LOOP_NODES = [
  { id: 'read', label: 'Read', icon: '📂', x: 50, y: 17 },
  { id: 'plan', label: 'Think', icon: '💭', x: 83, y: 50 },
  { id: 'edit', label: 'Edit', icon: '✏️', x: 50, y: 83 },
  { id: 'run', label: 'Check', icon: '▶️', x: 17, y: 50 },
] as const

const LOOP_SCRIPT: { node: (typeof LOOP_NODES)[number]['id'] | 'start' | 'done'; text: string; tone?: 'bad' | 'good' }[] = [
  { node: 'start', text: 'You: "users get logged out after 1 minute. fix it and verify."' },
  { node: 'read', text: 'Opens auth/session.ts and auth/login.ts' },
  { node: 'plan', text: 'Hypothesis: expiry is compared in seconds against a milliseconds clock' },
  { node: 'edit', text: 'Changes the expiry check in session.ts' },
  { node: 'run', text: '$ npm test session  →  1 failing: "refresh keeps session"', tone: 'bad' },
  { node: 'read', text: 'Reads the failing test output' },
  { node: 'edit', text: 'Also converts the refresh timestamp to milliseconds' },
  { node: 'run', text: '$ npm test session  →  all 14 passing', tone: 'good' },
  { node: 'run', text: 'Logs in on the real app, waits 2 minutes: still logged in', tone: 'good' },
  { node: 'done', text: 'Reports the root cause, the fix, and the evidence' },
]

export function AgentLoop() {
  const [i, setI] = useState(0)
  const [playing, setPlaying] = useState(false)
  const termRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    termRef.current?.scrollTo({ top: termRef.current.scrollHeight, behavior: 'smooth' })
  }, [i])
  useEffect(() => {
    if (!playing) return
    if (i >= LOOP_SCRIPT.length - 1) {
      setPlaying(false)
      return
    }
    const t = setTimeout(() => setI((x) => x + 1), 1300)
    return () => clearTimeout(t)
  }, [playing, i])
  const cur = LOOP_SCRIPT[i]
  const pos = LOOP_NODES.find((n) => n.id === cur.node) ?? { x: 50, y: 50 }
  const loops = LOOP_SCRIPT.slice(0, i + 1).filter((s) => s.node === 'run').length
  return (
    <div className="widget">
      <div className="split narrow-left" style={{ alignItems: 'center' }}>
        <div style={{ position: 'relative', width: '100%', aspectRatio: '1', maxWidth: 260, margin: '0 auto' }}>
          <svg viewBox="0 0 100 100" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} aria-hidden>
            <circle cx="50" cy="50" r="33" fill="none" stroke="var(--line-2)" strokeWidth="1.5" strokeDasharray="3 3" />
            <path d="M 70 24 l 4 -1 l -1 4" fill="none" stroke="var(--muted)" strokeWidth="1.2" />
            <path d="M 30 76 l -4 1 l 1 -4" fill="none" stroke="var(--muted)" strokeWidth="1.2" />
          </svg>
          <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
            <div style={{ fontSize: 30 }}>{cur.node === 'done' ? '✅' : '🤖'}</div>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--muted)' }}>loop #{Math.max(1, loops)}</div>
          </div>
          {LOOP_NODES.map((n) => {
            const on = cur.node === n.id
            return (
              <motion.div
                key={n.id}
                animate={{ scale: on ? 1.12 : 1 }}
                style={{
                  position: 'absolute',
                  left: `${n.x}%`,
                  top: `${n.y}%`,
                  transform: 'translate(-50%,-50%)',
                  padding: '6px 10px',
                  borderRadius: 12,
                  fontSize: 12,
                  fontWeight: 800,
                  whiteSpace: 'nowrap',
                  background: on ? 'var(--brand)' : 'var(--surface)',
                  color: on ? 'var(--brand-ink)' : 'var(--ink-2)',
                  border: '1.5px solid var(--line-2)',
                  boxShadow: on ? 'var(--shadow-2)' : 'none',
                  x: '-50%',
                  y: '-50%',
                }}
              >
                {n.icon} {n.label}
              </motion.div>
            )
          })}
          <motion.div
            animate={{ left: `${pos.x}%`, top: `${pos.y}%`, opacity: cur.node === 'start' || cur.node === 'done' ? 0 : 1 }}
            transition={{ type: 'spring', stiffness: 120, damping: 16 }}
            style={{ position: 'absolute', width: 12, height: 12, borderRadius: 99, background: 'var(--gold)', boxShadow: '0 0 0 6px color-mix(in srgb, var(--gold) 30%, transparent)', x: '-50%', y: '-50%', marginTop: -22 }}
          />
        </div>
        <div>
          <div ref={termRef} className="term" style={{ height: 230, overflowY: 'auto' }}>
            {LOOP_SCRIPT.slice(0, i + 1).map((s, k) => (
              <motion.div key={k} initial={{ opacity: 0, y: 6 }} animate={{ opacity: k === i ? 1 : 0.55, y: 0 }}>
                <span className="c-dim">{s.node === 'start' ? '>' : s.node === 'done' ? '✓' : `[${s.node}]`} </span>
                <span className={s.tone === 'bad' ? 'c-key' : s.tone === 'good' ? 'c-str' : ''}>{s.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <div className="widget-toolbar">
        <button className="btn btn-primary btn-sm" onClick={() => (i >= LOOP_SCRIPT.length - 1 ? (setI(0), setPlaying(true)) : setPlaying(!playing))}>
          {playing ? '⏸ Pause' : i >= LOOP_SCRIPT.length - 1 ? '↻ Replay' : '▶ Play'}
        </button>
        <button className="btn btn-ghost btn-sm" onClick={() => setI((x) => Math.min(LOOP_SCRIPT.length - 1, x + 1))} disabled={i >= LOOP_SCRIPT.length - 1}>
          Step →
        </button>
        <button className="btn btn-ghost btn-sm" onClick={() => (setI(0), setPlaying(false))}>
          Reset
        </button>
        {loops >= 2 && (
          <span className="muted" style={{ fontSize: 13, fontWeight: 600, marginLeft: 'auto' }}>
            The first check failed, so the agent looped again.
          </span>
        )}
      </div>
    </div>
  )
}

/* ---------------- skill anatomy ---------------- */

const ANATOMY: { id: string; lines: string[]; title: string; text: string }[] = [
  { id: 'fence', lines: ['---'], title: 'Frontmatter fence', text: 'Three dashes open and close the frontmatter: a small block of settings that sits above the instructions.' },
  { id: 'name', lines: ['name: principle-laziness-protocol'], title: 'name', text: 'The skill’s ID. Other skills refer to it by this name, like "per **principle-laziness-protocol**".' },
  {
    id: 'desc',
    lines: ['description: "Apply when refactoring, evaluating diff size,', '  or tempted to add abstractions... Bias toward deletion."'],
    title: 'description',
    text: 'A "use me when..." note. The agent reads it to decide whether this skill fits the task. Good descriptions name the trigger situation.',
  },
  {
    id: 'dmi',
    lines: ['disable-model-invocation: true'],
    title: 'disable-model-invocation',
    text: 'Stops the agent from loading this skill on its own whim. Principles are loaded deliberately, when poteto-mode decides a principle applies.',
  },
  { id: 'fence2', lines: ['---'], title: 'Frontmatter fence', text: 'Closes the frontmatter. Everything below is the body: the instructions themselves.' },
  { id: 'h1', lines: ['# Laziness Protocol'], title: 'Title', text: 'A plain Markdown heading. Skills are just Markdown.' },
  { id: 'rule', lines: ['Aim for the most result with the least code and complexity.'], title: 'The one-line rule', text: 'Good skills lead with the rule itself, in one sentence, before any detail.' },
  {
    id: 'bullets',
    lines: ['- **Prefer deletion.** Look for removals before additions.', '- **Minimize the diff.** Make the smallest change that solves it.', '- **Question the threading.** ...'],
    title: 'The pattern',
    text: 'Concrete, checkable behaviors. Each bullet is something the agent can actually do differently.',
  },
  {
    id: 'test',
    lines: ['**The test:** If a human developer would find the code', 'exhausting to maintain, it is a bad solution.'],
    title: 'The test',
    text: 'A quick self-check. Many pstack principles end with "The test" so the agent can verify it applied the rule.',
  },
]

export function SkillAnatomy() {
  const [sel, setSel] = useState('desc')
  const cur = ANATOMY.find((a) => a.id === sel)!
  return (
    <div className="widget split wide-left">
      <div className="term" style={{ padding: 10 }}>
        <div className="c-dim" style={{ padding: '0 6px 6px', fontSize: 12 }}>
          skills/principle-laziness-protocol/SKILL.md
        </div>
        {ANATOMY.map((a) => (
          <div
            key={a.id}
            role="button"
            tabIndex={0}
            onClick={() => setSel(a.id)}
            onKeyDown={(e) => e.key === 'Enter' && setSel(a.id)}
            style={{
              cursor: 'pointer',
              padding: '2px 6px',
              borderRadius: 6,
              background: sel === a.id ? 'rgb(242 177 29 / 22%)' : 'transparent',
              outline: sel === a.id ? '1.5px solid #f2b11d' : 'none',
              margin: '2px 0',
            }}
          >
            {a.lines.map((l, i) => (
              <div key={i} className={l.startsWith('---') ? 'c-dim' : l.includes(':') && !l.startsWith('-') && !l.startsWith('**') ? 'c-key' : ''}>
                {l || ' '}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div>
        <>
          <motion.div key={sel} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="card" style={{ padding: 18 }}>
            <div className="eyebrow">{ANATOMY.findIndex((a) => a.id === sel) < 5 ? 'Frontmatter' : 'Body'}</div>
            <h3 style={{ fontSize: 20, margin: '4px 0 8px', fontFamily: 'var(--mono)' }}>{cur.title}</h3>
            <p style={{ margin: 0, color: 'var(--ink-2)' }} dangerouslySetInnerHTML={{ __html: cur.text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }} />
          </motion.div>
        </>
        <p className="muted" style={{ fontSize: 13, fontWeight: 600, marginTop: 12 }}>
          Tap any part of the file. {ANATOMY.length} parts to explore.
        </p>
      </div>
    </div>
  )
}

/* ---------------- slop vs clean ---------------- */

const SLOP = `+ // Helper function to safely get the user's notification settings
+ function getNotificationSettingsSafely(user) {
+   // Check if user exists
+   if (!user) {
+     return null; // Return null if no user
+   }
+   try {
+     // Try to get the settings
+     return user.settings?.notifications ?? {};
+   } catch (e) {
+     // Log the error just in case
+     console.log("Error getting settings", e);
+     return {};
+   }
+ }
+
  async function sendOnRetry(job) {
-   await notify(job.user)
+   // Make sure we don't send duplicate notifications
+   const settings = getNotificationSettingsSafely(job.user);
+   if (settings && !job.alreadyNotified) {
+     await notify(job.user);
+     job.alreadyNotified = true; // Mark as notified
+   }
  }`

const CLEAN = `  async function sendOnRetry(job) {
-   await notify(job.user)
+   await notify(job.user, { idempotencyKey: job.id })
  }`

export function SlopVsClean() {
  const [mode, setMode] = useState<'slop' | 'clean'>('slop')
  const code = mode === 'slop' ? SLOP : CLEAN
  const stats =
    mode === 'slop'
      ? [
          ['Lines added', '21'],
          ['Comments', '8'],
          ['Root cause found?', 'No, just guarded'],
          ['Evidence', 'None. "Should work now!"'],
        ]
      : [
          ['Lines added', '1'],
          ['Comments', '0'],
          ['Root cause found?', 'Yes, retries re-sent without a key'],
          ['Evidence', 'Repro: 2 sends before, 1 after'],
        ]
  return (
    <div className="widget">
      <div className="pill-tabs" role="tablist" style={{ marginBottom: 12 }}>
        <button className={mode === 'slop' ? 'on' : ''} onClick={() => setMode('slop')} role="tab" aria-selected={mode === 'slop'}>
          🫠 Slop fix
        </button>
        <button className={mode === 'clean' ? 'on' : ''} onClick={() => setMode('clean')} role="tab" aria-selected={mode === 'clean'}>
          🍠 pstack fix
        </button>
      </div>
      <p style={{ margin: '0 0 10px', fontWeight: 600, color: 'var(--ink-2)', fontSize: 15 }}>Bug: users get two notifications when a job retries.</p>
      <>
        <motion.div key={mode} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
          <div className="term" style={{ maxHeight: 300, overflow: 'auto' }}>
            {code.split('\n').map((l, i) => (
              <div key={i} className={`diff-line ${l.startsWith('+') ? 'diff-add' : l.startsWith('-') ? 'diff-del' : ''}`}>
                <span className={l.includes('//') ? 'c-dim' : ''}>{l}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 8, marginTop: 12 }}>
            {stats.map(([k, v]) => (
              <div key={k} className="card" style={{ padding: '10px 12px', borderColor: mode === 'slop' ? 'color-mix(in srgb, var(--bad) 35%, transparent)' : 'color-mix(in srgb, var(--good) 35%, transparent)' }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--muted)' }}>{k}</div>
                <div style={{ fontWeight: 800, color: mode === 'slop' ? 'var(--bad)' : 'var(--good)' }}>{v}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </>
    </div>
  )
}

/* ---------------- repo explorer ---------------- */

type Node = { name: string; info: string; kids?: Node[]; tag?: string }

const TREE: Node = {
  name: 'pstack/',
  info: 'The plugin root inside the cursor/plugins repo. Almost everything here is Markdown that agents read.',
  kids: [
    {
      name: '.cursor-plugin/',
      info: 'Plugin metadata for Cursor.',
      kids: [{ name: 'plugin.json', info: 'The ID card: name "pstack", version, description, author Lauren Tan, and the paths to ./skills/ and ./agents/. MIT license.', tag: 'config' }],
    },
    { name: 'README.md', info: 'The front page: philosophy, install, the 23 playbooks table, the full skills table, and the 23 principles.', tag: 'docs' },
    {
      name: 'skills/',
      info: 'The heart of pstack. Each folder is one skill with a SKILL.md inside.',
      kids: [
        {
          name: 'poteto-mode/',
          info: 'The front door skill. Its SKILL.md has the non-negotiables, the principle index, autonomy rules, subagent defaults and the playbook list.',
          kids: [
            { name: 'SKILL.md', info: 'About 140 lines that route every task: match a playbook, copy its steps into a todo list, call skills as steps need them.', tag: 'skill' },
            { name: 'playbooks/', info: '23 short Markdown checklists: investigation.md, bug-fix.md, feature.md, refactoring.md, perf-issue.md, hillclimb.md, babysit.md, shipping.md and more.', tag: 'playbooks' },
            { name: 'references/', info: 'Extra reading loaded on demand, such as bugbot-triage.md for judging bot review comments.' },
            { name: 'scripts/', info: 'Small helper tools, like watch-pr (polls PR status for Babysit) and worktree-audit.sh (for Worktree cleanup).', tag: 'code' },
          ],
        },
        { name: 'how/ · why/ · teach/ · recall/', info: 'The understanding skills. how and why have references/ folders holding the prompts for their explorer, investigator and synthesizer subagents.', tag: 'skill' },
        { name: 'architect/ · arena/ · swarm/ · interrogate/', info: 'The design and review skills. interrogate/references holds the reviewer prompt, the rubric, and the lead-judgment guide.', tag: 'skill' },
        { name: 'tdd/ · unslop/ · no-comments/ · technical-writing/', info: 'Build and cleanup skills, plus typescript-best-practices which loads itself for .ts files.', tag: 'skill' },
        { name: 'create-/maintain-verification-skill/', info: 'Generate and audit a project-local verify-<app> skill with a feature map. Includes a worked feature-map example.', tag: 'skill' },
        { name: 'figure-it-out/ · show-me-your-work/', info: 'Design a custom playbook for big work, and keep a TSV decision log.', tag: 'skill' },
        { name: 'automate-me/ · reflect/ · setup-pstack/ · bro/ …', info: 'Personalization, learning from sessions, model setup, and plain-language restating. Plus blast-radius and make-bot-ui.', tag: 'skill' },
        { name: 'principle-*/ (×23)', info: 'One tiny skill per principle, 15 to 35 lines each: when it applies, the pattern, and often "The test".', tag: 'principles' },
      ],
    },
    {
      name: 'agents/',
      info: 'Personas for subagents.',
      kids: [
        { name: 'poteto-agent.md', info: 'The default subagent type poteto-mode uses for helpers inside playbook steps.', tag: 'agent' },
        { name: 'comment-sicko.md', info: 'A gleefully comment-hating, read-only reviewer spawned by /no-comments. First words: "Yes... Ha ha ha... Yes!"', tag: 'agent' },
      ],
    },
    {
      name: 'docs/guide/',
      info: 'The human guide: 10 pages from setup to recipes, with illustrations. This course follows the same arc.',
      kids: [
        { name: '01-setup.md … 10-recipes-and-pitfalls.md', info: 'Setup, poteto-mode, understand, design, build & clean, verify & ship, overnight, principles, make it yours, recipes.', tag: 'docs' },
        { name: 'images/', info: 'Six illustrations: router, understanding, design, verification, overnight, recipes.' },
      ],
    },
    {
      name: 'automations/benny/',
      info: 'A dormant automation pack: triage Slack issue reports, then reproduce and fix confirmed bugs. Not registered as slash skills. Set up via FOR_AGENTS.md.',
      tag: 'automation',
    },
    { name: 'assets/logo.png', info: 'The logo: poteto happily eating a roasted sweet potato.' },
    { name: 'LICENSE', info: 'MIT. Fork it, improve it, make it yours.' },
  ],
}

const TAG_HUE: Record<string, number> = { skill: 275, principles: 185, playbooks: 45, agent: 345, docs: 205, config: 130, code: 20, automation: 300 }

function TreeRow({ node, depth, sel, onSel, open, toggle, path }: { node: Node; depth: number; sel: string; onSel: (p: string, n: Node) => void; open: Set<string>; toggle: (p: string) => void; path: string }) {
  const isOpen = open.has(path)
  const isDir = !!node.kids
  return (
    <>
      <button
        onClick={() => {
          onSel(path, node)
          if (isDir) toggle(path)
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          width: '100%',
          textAlign: 'left',
          border: 0,
          padding: `6px 8px 6px ${8 + depth * 16}px`,
          borderRadius: 8,
          cursor: 'pointer',
          fontFamily: 'var(--mono)',
          fontSize: 13,
          background: sel === path ? 'var(--brand-soft)' : 'transparent',
          color: sel === path ? 'var(--brand)' : 'var(--ink)',
          fontWeight: sel === path ? 700 : 500,
        }}
      >
        <span style={{ width: 12, color: 'var(--muted)' }}>{isDir ? (isOpen ? '▾' : '▸') : ''}</span>
        <span>{isDir ? '📁' : '📄'}</span>
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{node.name}</span>
      </button>
      {isDir && isOpen && node.kids!.map((k) => <TreeRow key={k.name} node={k} depth={depth + 1} sel={sel} onSel={onSel} open={open} toggle={toggle} path={`${path}/${k.name}`} />)}
    </>
  )
}

export function RepoExplorer() {
  const [open, setOpen] = useState<Set<string>>(new Set(['pstack/']))
  const [sel, setSel] = useState('pstack/')
  const [node, setNode] = useState<Node>(TREE)
  const [seen, setSeen] = useState<Set<string>>(new Set(['pstack/']))
  const total = useMemo(() => {
    let n = 0
    const walk = (x: Node) => {
      n++
      x.kids?.forEach(walk)
    }
    walk(TREE)
    return n
  }, [])
  const toggle = (p: string) => {
    const next = new Set(open)
    if (next.has(p)) next.delete(p)
    else next.add(p)
    setOpen(next)
  }
  return (
    <div className="widget split">
      <div className="card" style={{ padding: 6, maxHeight: 380, overflow: 'auto' }}>
        <TreeRow
          node={TREE}
          depth={0}
          sel={sel}
          onSel={(p, n) => {
            setSel(p)
            setNode(n)
            setSeen((s) => new Set(s).add(p))
          }}
          open={open}
          toggle={toggle}
          path="pstack/"
        />
      </div>
      <div>
        <>
          <motion.div key={sel} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="card" style={{ padding: 18 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              <h3 style={{ fontFamily: 'var(--mono)', fontSize: 16, wordBreak: 'break-word' }}>{node.name}</h3>
              {node.tag && (
                <span className="chip" style={{ background: `hsl(${TAG_HUE[node.tag]} 80% 92%)`, color: `hsl(${TAG_HUE[node.tag]} 60% 30%)`, borderColor: 'transparent' }}>
                  {node.tag}
                </span>
              )}
            </div>
            <p style={{ margin: '10px 0 0', color: 'var(--ink-2)' }}>{node.info}</p>
          </motion.div>
        </>
        <div style={{ marginTop: 12 }}>
          <div className="bar">
            <div style={{ width: `${(seen.size / total) * 100}%` }} />
          </div>
          <p className="muted" style={{ fontSize: 13, fontWeight: 600, margin: '6px 0 0' }}>
            Explored {seen.size} of {total} items
          </p>
        </div>
      </div>
    </div>
  )
}

/* ---------------- model roles ---------------- */

const BUDGETS = [
  { id: 'unlimited', label: 'unlimited', effort: 'max' },
  { id: 'large', label: 'large', effort: 'xhigh' },
  { id: 'medium', label: 'medium', effort: 'high' },
  { id: 'small', label: 'small', effort: 'medium' },
] as const
type Family = 'opus' | 'sol' | 'grok' | 'auto'
const FAMILY_LABEL: Record<Family, string> = { opus: 'Claude Opus 5.5', sol: 'GPT-5.6 Sol', grok: 'Grok 4.7', auto: 'auto (inherit parent)' }

function slug(f: Family, budget: (typeof BUDGETS)[number]) {
  if (f === 'auto') return 'auto'
  const e = budget.effort
  if (f === 'opus') return `claude-opus-5-5-${e}`
  if (f === 'sol') return `gpt-5.6-sol-${e}`
  return `grok-4.7-${budget.id === 'unlimited' ? 'xhigh' : e}-fast`
}

const SINGLE_ROLES: { role: string; def: Family; what: string }[] = [
  { role: 'feature, refactoring', def: 'grok', what: 'writes feature and refactor code' },
  { role: 'bug-fix', def: 'grok', what: 'writes bug fixes' },
  { role: 'judgment and prose', def: 'opus', what: 'makes calls, writes text' },
  { role: 'hardest tasks', def: 'opus', what: 'gnarly design and concurrency' },
]
const PANEL_ROLES = ['arena runners', 'interrogate reviewers']

export function ModelRoles() {
  const [budget, setBudget] = useState<(typeof BUDGETS)[number]>(BUDGETS[0])
  const [roles, setRoles] = useState<Record<string, Family>>(Object.fromEntries(SINGLE_ROLES.map((r) => [r.role, r.def])))
  const [panels, setPanels] = useState<Record<string, Family[]>>(Object.fromEntries(PANEL_ROLES.map((p) => [p, ['opus', 'sol', 'grok'] as Family[]])))
  const togglePanel = (p: string, f: Family) => {
    const cur = panels[p]
    setPanels({ ...panels, [p]: cur.includes(f) ? cur.filter((x) => x !== f) : [...cur, f] })
  }
  const rule = [
    '---',
    'description: pstack per-role model choices (overrides skill defaults)',
    'alwaysApply: true',
    '---',
    `# budget: ${budget.label} (${budget.effort})`,
    ...SINGLE_ROLES.map((r) => `${r.role}: ${slug(roles[r.role], budget)}`),
    ...PANEL_ROLES.map((p) => `${p}: ${panels[p].map((f) => slug(f, budget)).join(', ') || '(empty)'}`),
  ]
  return (
    <div className="widget" style={{ display: 'grid', gap: 14 }}>
      <div>
        <div className="eyebrow" style={{ marginBottom: 6 }}>
          1 · Reasoning budget
        </div>
        <div className="pill-tabs">
          {BUDGETS.map((b) => (
            <button key={b.id} className={budget.id === b.id ? 'on' : ''} onClick={() => setBudget(b)}>
              {b.label}
            </button>
          ))}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 10 }}>
        <div>
          <div className="eyebrow" style={{ marginBottom: 6 }}>
            2 · Roles
          </div>
          {SINGLE_ROLES.map((r) => (
            <label key={r.role} style={{ display: 'grid', gap: 2, marginBottom: 8 }}>
              <span style={{ fontWeight: 700, fontSize: 14 }}>
                {r.role} <span className="muted" style={{ fontWeight: 500 }}>· {r.what}</span>
              </span>
              <select className="input" style={{ padding: '8px 10px', fontSize: 14 }} value={roles[r.role]} onChange={(e) => setRoles({ ...roles, [r.role]: e.target.value as Family })}>
                {(Object.keys(FAMILY_LABEL) as Family[]).map((f) => (
                  <option key={f} value={f}>
                    {FAMILY_LABEL[f]}
                    {f === r.def ? ' (default)' : ''}
                  </option>
                ))}
              </select>
            </label>
          ))}
          {PANEL_ROLES.map((p) => (
            <div key={p} style={{ marginBottom: 8 }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>
                {p} <span className="muted" style={{ fontWeight: 500 }}>· panel, {panels[p].length} subagent{panels[p].length === 1 ? '' : 's'}</span>
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
                {(['opus', 'sol', 'grok'] as Family[]).map((f) => (
                  <button key={f} className={`chip`} onClick={() => togglePanel(p, f)} style={{ cursor: 'pointer', background: panels[p].includes(f) ? 'var(--brand-soft)' : undefined, color: panels[p].includes(f) ? 'var(--brand)' : undefined, borderColor: panels[p].includes(f) ? 'var(--brand)' : undefined }}>
                    {panels[p].includes(f) ? '✓ ' : '+ '}
                    {FAMILY_LABEL[f]}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div>
          <div className="eyebrow" style={{ marginBottom: 6 }}>
            3 · ~/.cursor/rules/pstack-models.mdc
          </div>
          <div className="term" style={{ fontSize: 12 }}>
            {rule.map((l, i) => (
              <motion.div key={l + i} initial={{ backgroundColor: 'rgba(242,177,29,0.35)' }} animate={{ backgroundColor: 'rgba(242,177,29,0)' }} transition={{ duration: 1 }} className={l.startsWith('#') || l.startsWith('---') ? 'c-dim' : ''}>
                {l.includes(':') && !l.startsWith('#') && !l.startsWith('desc') && !l.startsWith('always') ? (
                  <>
                    <span className="c-key">{l.split(':')[0]}:</span>
                    <span className="c-str">{l.slice(l.indexOf(':') + 1)}</span>
                  </>
                ) : (
                  l
                )}
              </motion.div>
            ))}
          </div>
          <p className="muted" style={{ fontSize: 13, fontWeight: 600, marginTop: 8 }}>
            The real file has more roles (how explorer, why synthesizer, swarm workers…). Any role you leave out uses its default.
          </p>
        </div>
      </div>
    </div>
  )
}
