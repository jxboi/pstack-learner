import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { PRINCIPLES, PRINCIPLE_CATEGORIES, type PrincipleCategory } from '../content/principles'

/* ---------------- principle cards ---------------- */

export function PrincipleCards() {
  const [cat, setCat] = useState<PrincipleCategory | 'All'>('All')
  const [flipped, setFlipped] = useState<Set<string>>(new Set())
  const [copied, setCopied] = useState<string | null>(null)
  const list = PRINCIPLES.filter((p) => cat === 'All' || p.category === cat)
  const toggle = (id: string) =>
    setFlipped((f) => {
      const n = new Set(f)
      if (n.has(id)) n.delete(id)
      else n.add(id)
      return n
    })
  const hueOf = (c: PrincipleCategory) => PRINCIPLE_CATEGORIES.find((x) => x.id === c)!.hue
  return (
    <div className="widget" style={{ padding: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
        <div className="pill-tabs">
          {(['All', ...PRINCIPLE_CATEGORIES.map((c) => c.id)] as const).map((c) => (
            <button key={c} className={cat === c ? 'on' : ''} onClick={() => setCat(c)}>
              {c}
            </button>
          ))}
        </div>
        <span className="chip" style={{ marginLeft: 'auto' }}>
          🃏 {flipped.size}/{PRINCIPLES.length} flipped
        </span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 10 }}>
        {list.map((p) => {
          const isFlipped = flipped.has(p.id)
          const hue = hueOf(p.category)
          return (
            <div key={p.id} style={{ perspective: 900, minHeight: 210 }}>
              <motion.div
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 22 }}
                style={{ position: 'relative', width: '100%', height: '100%', minHeight: 210, transformStyle: 'preserve-3d', cursor: 'pointer' }}
                onClick={() => toggle(p.id)}
                role="button"
                aria-label={`Flip ${p.name}`}
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && toggle(p.id)}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backfaceVisibility: 'hidden',
                    borderRadius: 14,
                    padding: 14,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    background: `linear-gradient(150deg, hsl(${hue} 75% 88%), hsl(${hue} 60% 74%))`,
                    color: `hsl(${hue} 60% 18%)`,
                    boxShadow: 'var(--shadow-1)',
                  }}
                >
                  <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.75 }}>{p.category}</span>
                  <span style={{ fontSize: 19, fontWeight: 800, lineHeight: 1.2 }}>{p.name}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, opacity: 0.7 }}>tap to flip ↻</span>
                </div>
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    borderRadius: 14,
                    padding: 12,
                    background: 'var(--surface)',
                    border: `2px solid hsl(${hue} 60% 60%)`,
                    fontSize: 12.5,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                    overflow: 'auto',
                  }}
                >
                  <strong style={{ fontSize: 13.5 }}>{p.name}</strong>
                  <span>{p.plain}</span>
                  <span className="muted">
                    <strong>e.g.</strong> {p.example.replace(/`/g, '')}
                  </span>
                  <button
                    className="mono"
                    onClick={async (e) => {
                      e.stopPropagation()
                      try {
                        await navigator.clipboard.writeText(p.steer)
                        setCopied(p.id)
                        setTimeout(() => setCopied(null), 1200)
                      } catch {
                        /* clipboard blocked */
                      }
                    }}
                    style={{ marginTop: 'auto', textAlign: 'left', fontSize: 11, border: 0, borderRadius: 8, padding: '6px 8px', background: 'var(--code-bg)', color: 'var(--code-ink)', cursor: 'copy' }}
                  >
                    {copied === p.id ? '✓ copied' : `› ${p.steer}`}
                  </button>
                </div>
              </motion.div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ---------------- eval blind ---------------- */

const SETUP = [
  { text: 'workdir: ~/evals/run-3/candidate-B/', leak: true, fix: 'workdir: ~/projects/notes-app/', why: '"evals" and "candidate" tell the agent it is being tested.' },
  { text: 'model under test: claude-opus-5-5', leak: false, fix: '', why: '' },
  { text: 'prompt: "You are being evaluated on skill-following. Add pagination to the users list."', leak: true, fix: 'prompt: "add pagination to the users list. keep the api the same."', why: 'The observer effect: never tell a candidate it is being evaluated.' },
  { text: 'prompt suffix: "At the end, list every skill and principle you applied."', leak: true, fix: '(removed) grade chain-following from the files it actually opened', why: 'Chain-eliciting cue. Self-reports are not evidence.' },
  { text: 'context: "Two other candidates are working on this too."', leak: true, fix: '(removed)', why: 'Candidates must never know others exist.' },
  { text: 'skills available: the project\'s normal .cursor/skills/', leak: false, fix: '', why: '' },
  { text: 'judge sees outputs labeled: "opus", "sol", "grok"', leak: true, fix: 'judge sees outputs labeled: "X", "Y", "Z"', why: 'The judge sees sanitized labels, never model names.' },
  { text: 'rubric: given to the judge only', leak: false, fix: '', why: '' },
]

export function EvalBlind() {
  const [flagged, setFlagged] = useState<Set<number>>(new Set())
  const [reveal, setReveal] = useState(false)
  const leaks = SETUP.filter((s) => s.leak).length
  const found = [...flagged].filter((i) => SETUP[i].leak).length
  const falsePos = [...flagged].filter((i) => !SETUP[i].leak).length
  return (
    <div className="widget">
      <div style={{ display: 'grid', gap: 6 }}>
        {SETUP.map((s, i) => {
          const f = flagged.has(i)
          const show = reveal || f
          return (
            <div key={i}>
              <button
                className="option mono"
                style={{
                  fontSize: 12.5,
                  padding: '9px 12px',
                  borderBottomWidth: 2,
                  fontWeight: 500,
                  ...(show && f ? { borderColor: s.leak ? 'var(--good)' : 'var(--bad)', background: s.leak ? 'var(--good-soft)' : 'var(--bad-soft)' } : {}),
                  ...(reveal && !f && s.leak ? { borderColor: 'var(--warn)', background: 'var(--warn-soft)' } : {}),
                }}
                onClick={() => !reveal && setFlagged((x) => (x.has(i) ? new Set([...x].filter((y) => y !== i)) : new Set(x).add(i)))}
              >
                <span className="key" style={{ width: 24, height: 24, fontFamily: 'var(--font)' }}>
                  {f ? '🚩' : ''}
                </span>
                <span style={{ textDecoration: show && s.leak ? 'line-through' : 'none', opacity: show && s.leak ? 0.7 : 1 }}>{s.text}</span>
              </button>
              <AnimatePresence>
                {show && s.leak && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ fontSize: 12.5, padding: '4px 12px 2px 46px' }}>
                    <div className="mono" style={{ color: 'var(--good)' }}>→ {s.fix}</div>
                    <div className="muted" style={{ fontWeight: 600 }}>
                      {s.why}
                    </div>
                  </motion.div>
                )}
                {f && !s.leak && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontSize: 12.5, padding: '4px 12px 2px 46px', color: 'var(--bad)', fontWeight: 600 }}>
                    This line is fine. It does not reveal the experiment to the candidate.
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
      <div className="widget-toolbar">
        <span style={{ fontWeight: 800, color: found === leaks && !falsePos ? 'var(--good)' : 'var(--ink)' }}>
          🚩 {found}/{leaks} leaks found{falsePos ? ` · ${falsePos} false alarm${falsePos > 1 ? 's' : ''}` : ''}
        </span>
        <button className="btn btn-ghost btn-sm" onClick={() => setReveal(!reveal)}>
          {reveal ? 'Hide answers' : 'Reveal all'}
        </button>
      </div>
    </div>
  )
}

/* ---------------- prompt workbench ---------------- */

type Goal = { id: string; label: string; icon: string; fields: { key: string; label: string; placeholder: string }[]; build: (v: Record<string, string>) => string; tip: string }

const GOALS: Goal[] = [
  {
    id: 'bug',
    label: 'Fix a bug',
    icon: '🐞',
    fields: [
      { key: 'symptom', label: 'What goes wrong?', placeholder: 'checkout charges the card twice when the user double-clicks pay' },
      { key: 'check', label: 'How will you know it is fixed?', placeholder: 'one charge per order in the stripe test dashboard' },
    ],
    build: (v) => `/poteto-mode ${v.symptom || '<symptom>'}. repro first, then fix and verify: ${v.check || '<check>'}. if there's a cheap test path, /tdd it.`,
    tip: 'Routes to Bug fix: reproduce, binary-search the cause, verify on the same surface, failing repro committed first.',
  },
  {
    id: 'feature',
    label: 'Add a feature',
    icon: '✨',
    fields: [
      { key: 'what', label: 'What should exist?', placeholder: 'a --json flag on the report command' },
      { key: 'keep', label: 'What must NOT change?', placeholder: 'the text output stays byte-identical' },
      { key: 'check', label: 'Evidence you want', placeholder: 'the json parses and both run against the sample project' },
    ],
    build: (v) => `/poteto-mode add ${v.what || '<feature>'}. ${v.keep || '<what stays the same>'}. ${v.check ? `verify: ${v.check}.` : 'verify both.'} show me the evidence.`,
    tip: 'Routes to Feature: /how, /architect, a named data shape, delegated build, verification.',
  },
  {
    id: 'refactor',
    label: 'Refactor',
    icon: '🧹',
    fields: [
      { key: 'move', label: 'What structure change?', placeholder: 'move all date parsing into one module' },
      { key: 'pin', label: 'How to pin behavior?', placeholder: 'record the current output of the fixtures' },
    ],
    build: (v) => `/poteto-mode ${v.move || '<structure change>'}, zero behavior change. ${v.pin || 'record the current output'} first and prove it's unchanged after.`,
    tip: 'Routes to Refactoring: pin the contract, subtract first, small green steps, prove equivalence.',
  },
  {
    id: 'perf',
    label: 'Make it faster',
    icon: '⏱️',
    fields: [
      { key: 'metric', label: 'The measurement', placeholder: 'cold start takes 1.8s' },
      { key: 'where', label: 'On what input?', placeholder: 'the large-workspace fixture' },
    ],
    build: (v) => `/poteto-mode ${v.metric || '<measurement>'} on ${v.where || '<fixture>'}. trace it, fix the measured cause, show me before and after.`,
    tip: 'Routes to Perf issue: baseline trace, hypotheses from the trace, before/after numbers.',
  },
  {
    id: 'understand',
    label: 'Understand code',
    icon: '🔎',
    fields: [{ key: 'topic', label: 'What do you want to understand?', placeholder: 'how session refresh works and why it retries 5 times' }],
    build: (v) => `/teach me ${v.topic || '<topic>'}. convince me with evidence, and separate what the code shows from what you infer.`,
    tip: '/teach runs /how and /why and builds one explanation diagram by diagram.',
  },
  {
    id: 'review',
    label: 'Review my branch',
    icon: '🧐',
    fields: [{ key: 'focus', label: 'Any focus?', placeholder: 'concurrency in the job runner' }],
    build: (v) => `/interrogate the whole branch, but skeptically${v.focus ? `, especially ${v.focus}` : ''}. don't change anything yet. no nitpicks unless it's an actual bug or regression.`,
    tip: 'Multi-model adversarial review, sorted into Act on, Consider, Noted, Dismissed.',
  },
  {
    id: 'overnight',
    label: 'Overnight run',
    icon: '🌙',
    fields: [
      { key: 'goal', label: 'The goal', placeholder: 'migrate every caller to the new logger' },
      { key: 'done', label: 'Done means…', placeholder: 'zero imports of old-logger, all tests pass, old package deleted' },
    ],
    build: (v) => `/poteto-mode im going to bed. ${v.goal || '<goal>'} in a fresh worktree off main.\ndone means ${v.done || '<checkable condition>'}.\nkeep a decision log. don't ask me before committing.\n/loop until done. if you're truly stuck after a few hours, stop and write up why.`,
    tip: 'Routes through figure-it-out with a decision log. Read the Attention section in the morning.',
  },
]

export function PromptWorkbench() {
  const [goalId, setGoalId] = useState('bug')
  const [vals, setVals] = useState<Record<string, Record<string, string>>>({})
  const [copied, setCopied] = useState(false)
  const goal = GOALS.find((g) => g.id === goalId)!
  const v = vals[goalId] ?? {}
  const prompt = useMemo(() => goal.build(v), [goal, v])
  const filled = goal.fields.every((f) => v[f.key]?.trim())
  return (
    <div className="widget">
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
        {GOALS.map((g) => (
          <button key={g.id} className="chip" onClick={() => setGoalId(g.id)} style={{ cursor: 'pointer', fontSize: 14, padding: '7px 12px', background: g.id === goalId ? 'var(--brand)' : undefined, color: g.id === goalId ? 'var(--brand-ink)' : undefined, borderColor: g.id === goalId ? 'transparent' : undefined }}>
            {g.icon} {g.label}
          </button>
        ))}
      </div>
      <div style={{ display: 'grid', gap: 10 }}>
        {goal.fields.map((f) => (
          <label key={f.key} style={{ display: 'grid', gap: 4 }}>
            <span style={{ fontWeight: 700, fontSize: 14 }}>{f.label}</span>
            <input className="input" placeholder={f.placeholder} value={v[f.key] ?? ''} onChange={(e) => setVals({ ...vals, [goalId]: { ...v, [f.key]: e.target.value } })} />
          </label>
        ))}
      </div>
      <div style={{ position: 'relative', marginTop: 14 }}>
        <pre className="term" style={{ whiteSpace: 'pre-wrap', margin: 0, fontSize: 13.5, paddingRight: 80 }}>
          <span className="c-key">{prompt.split(' ')[0]}</span> {prompt.slice(prompt.indexOf(' ') + 1)}
        </pre>
        <button
          className="btn btn-sm"
          style={{ position: 'absolute', top: 8, right: 8, background: filled ? 'var(--gold)' : 'rgb(255 255 255 / 15%)', color: filled ? '#000' : 'var(--code-ink)' }}
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(prompt)
              setCopied(true)
              setTimeout(() => setCopied(false), 1400)
            } catch {
              /* clipboard blocked */
            }
          }}
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <p style={{ fontSize: 13.5, margin: '10px 0 0', color: 'var(--ink-2)', fontWeight: 600 }}>💡 {goal.tip}</p>
      {!filled && <p className="muted" style={{ fontSize: 13, margin: '4px 0 0' }}>Fill every field with your own project's details. The placeholders are examples.</p>}
    </div>
  )
}
