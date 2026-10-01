import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { PLAYBOOKS, BUG_FIX_STEPS } from '../content/playbooks'

/* ---------------- router ---------------- */

const SAMPLES = [
  'users get two notifications after a retry. repro first, then fix and verify.',
  'how does the cache get invalidated? don\'t change any code.',
  'add a --json flag. text output stays byte-identical.',
  'startup takes 1.8s on this fixture. trace it, show before and after.',
  'move parsing into one module, zero behavior change.',
  'babysit this pr. get it green.',
  'im going to bed. migrate every caller to the new parser.',
  'prototype three settings layouts so we can pick one.',
]

const FIGURE = {
  id: 'figure-it-out',
  name: 'figure-it-out',
  icon: '🧭',
  plain: 'Big, cross-cutting, or step-away work. Designs a bespoke, auditable playbook with a decision log.',
}

function route(prompt: string) {
  const p = prompt.toLowerCase()
  if (!p.trim()) return null
  const big = ['migrate every', 'migration', 'going to bed', 'stepping away', 'across the codebase', 'every caller'].filter((s) => p.includes(s))
  if (big.length) return { pb: FIGURE, hits: big, why: 'Large or cross-cutting work, or work you review after stepping away, routes to figure-it-out even when a narrower playbook fits.' }
  let best: { pb: (typeof PLAYBOOKS)[number]; hits: string[] } | null = null
  for (const pb of PLAYBOOKS) {
    const hits = pb.signals.filter((s) => p.includes(s.toLowerCase()))
    if (hits.length && (!best || hits.length > best.hits.length)) best = { pb, hits }
  }
  if (!best) return { pb: FIGURE, hits: [], why: 'No bundled playbook clearly fits, so figure-it-out designs one for this task.' }
  return { ...best, why: best.pb.plain }
}

export function Router() {
  const [text, setText] = useState(SAMPLES[0])
  const [fired, setFired] = useState(0)
  const result = useMemo(() => route(text), [text])
  const gates = [...PLAYBOOKS.filter((p) => ['investigation', 'bug-fix', 'feature', 'refactoring', 'perf-issue', 'prototype', 'babysit', 'shipping'].includes(p.id)), FIGURE]
  const winner = result?.pb.id
  const inGates = gates.some((g) => g.id === winner)
  return (
    <div className="widget">
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
        {SAMPLES.map((s, i) => (
          <button
            key={i}
            className="chip"
            style={{ cursor: 'pointer', background: text === s ? 'var(--brand-soft)' : undefined, color: text === s ? 'var(--brand)' : undefined }}
            onClick={() => {
              setText(s)
              setFired((f) => f + 1)
            }}
          >
            {s.length > 34 ? s.slice(0, 32) + '…' : s}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'stretch' }}>
        <span className="mono" style={{ alignSelf: 'center', color: 'var(--brand)', fontWeight: 700, whiteSpace: 'nowrap' }}>
          /poteto-mode
        </span>
        <input className="input mono" style={{ fontSize: 14 }} value={text} onChange={(e) => setText(e.target.value)} onBlur={() => setFired((f) => f + 1)} placeholder="type a task…" aria-label="Prompt" />
      </div>

      <div style={{ position: 'relative', margin: '18px 0 6px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: 8 }}>
        {gates.map((g) => {
          const on = g.id === winner
          return (
            <motion.div
              key={`${g.id}-${on ? fired : 0}`}
              initial={on ? { scale: 0.9 } : false}
              animate={{ scale: on ? [0.9, 1.08, 1] : 1 }}
              transition={{ duration: 0.45 }}
              style={{
                padding: '10px 8px',
                borderRadius: 12,
                textAlign: 'center',
                fontSize: 13,
                fontWeight: 800,
                border: '2px solid',
                borderColor: on ? 'var(--gold)' : 'var(--line-2)',
                background: on ? 'var(--gold-soft)' : 'var(--surface)',
                color: on ? 'var(--ink)' : 'var(--muted)',
                boxShadow: on ? '0 0 0 4px color-mix(in srgb, var(--gold) 25%, transparent)' : 'none',
                opacity: on ? 1 : 0.7,
              }}
            >
              <div style={{ fontSize: 22 }}>{g.icon}</div>
              {g.name}
            </motion.div>
          )
        })}
      </div>
      {!inGates && result && <p className="muted" style={{ fontSize: 13, fontWeight: 600 }}>Routed to a playbook not shown above. All 23 are in the glossary.</p>}

      <>
        {result && (
          <motion.div key={result.pb.id + fired} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="card" style={{ padding: 16, marginTop: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 28 }}>{result.pb.icon}</span>
              <div>
                <div className="eyebrow">Matched playbook</div>
                <div style={{ fontWeight: 800, fontSize: 18 }}>{result.pb.name}</div>
              </div>
            </div>
            <p style={{ margin: '10px 0 6px', color: 'var(--ink-2)' }}>{result.why}</p>
            {result.hits.length > 0 && (
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                <span className="muted" style={{ fontSize: 13, fontWeight: 700 }}>
                  Signals:
                </span>
                {result.hits.map((h) => (
                  <span key={h} className="chip mono" style={{ background: 'var(--gold-soft)' }}>
                    "{h}"
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </>
      <p className="muted" style={{ fontSize: 12.5, margin: '10px 0 0' }}>
        This is a simplified keyword model. The real poteto-mode is an agent reading your words for intent, but the idea is the same.
      </p>
    </div>
  )
}

/* ---------------- todo fill ---------------- */

type Todo = { text: string; state: 'pending' | 'doing' | 'done'; note?: string }

const TODO_SCRIPT: Todo[] = [
  ...BUG_FIX_STEPS.map((t) => ({ text: t, state: 'pending' as const })),
  { text: 'Find where retries call notify()', state: 'pending' },
  { text: 'Add idempotency key per job', state: 'pending' },
]

export function TodoFill() {
  const [t, setT] = useState(0)
  const [playing, setPlaying] = useState(true)
  const total = TODO_SCRIPT.length + 9
  useEffect(() => {
    if (!playing || t >= total) return
    const id = setTimeout(() => setT((x) => x + 1), t < TODO_SCRIPT.length ? 380 : 900)
    return () => clearTimeout(id)
  }, [t, playing, total])

  const items: Todo[] = TODO_SCRIPT.slice(0, Math.min(t, TODO_SCRIPT.length)).map((x) => ({ ...x }))
  const phase = t - TODO_SCRIPT.length
  const order = [0, 1, 6, 2, 7, 3, 4, 5]
  if (phase > 0) {
    order.slice(0, phase).forEach((idx) => {
      if (items[idx]) items[idx].state = 'done'
    })
    const cur = order[phase]
    if (cur !== undefined && items[cur]) items[cur].state = 'doing'
    if (phase >= 4 && items[2]) items[2].note = 'skip: architect (the fix stays inside one function)'
  }

  return (
    <div className="widget">
      <div className="card" style={{ padding: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span className="eyebrow">Todos · Bug fix playbook</span>
          <span className="chip">{items.filter((i) => i.state === 'done').length}/{TODO_SCRIPT.length}</span>
        </div>
        <div style={{ display: 'grid', gap: 6 }}>
          <AnimatePresence>
            {items.map((it, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '6px 4px' }}>
                <span
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 6,
                    flex: 'none',
                    marginTop: 2,
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: 12,
                    color: 'white',
                    border: '2px solid',
                    borderColor: it.state === 'done' ? 'var(--good)' : it.state === 'doing' ? 'var(--gold)' : 'var(--line-2)',
                    background: it.state === 'done' ? 'var(--good)' : 'transparent',
                  }}
                >
                  {it.state === 'done' ? '✓' : it.state === 'doing' ? <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} style={{ width: 8, height: 8, borderRadius: 9, border: '2px solid var(--gold)', borderTopColor: 'transparent', display: 'block' }} /> : ''}
                </span>
                <div>
                  <div style={{ fontSize: 14.5, fontWeight: 600, textDecoration: it.state === 'done' ? 'line-through' : 'none', color: it.state === 'done' ? 'var(--muted)' : 'var(--ink)' }}>
                    {i < BUG_FIX_STEPS.length && <span className="muted mono" style={{ fontSize: 12 }}>{i + 1}. </span>}
                    {it.text}
                  </div>
                  {it.note && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mono" style={{ fontSize: 12, color: 'var(--warn)', background: 'var(--warn-soft)', padding: '2px 8px', borderRadius: 6, marginTop: 4, display: 'inline-block' }}>
                      {it.note}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        {t >= TODO_SCRIPT.length && <div className="muted" style={{ fontSize: 12.5, fontWeight: 600, marginTop: 8, borderTop: '1px dashed var(--line-2)', paddingTop: 8 }}>The first 6 items are the playbook, copied verbatim. The last 2 are task-specific todos.</div>}
      </div>
      <div className="widget-toolbar">
        <button className="btn btn-primary btn-sm" onClick={() => (t >= total ? (setT(0), setPlaying(true)) : setPlaying(!playing))}>
          {t >= total ? '↻ Replay' : playing ? '⏸ Pause' : '▶ Play'}
        </button>
      </div>
    </div>
  )
}

/* ---------------- prompt grader ---------------- */

const INGREDIENTS = [
  { id: 'mode', text: '/poteto-mode', pts: 10, good: true, tip: 'Routes through a playbook, so the rigor comes for free.' },
  { id: 'symptom', text: 'the export writes duplicate rows when a retry lands mid-run.', pts: 25, good: true, tip: 'A concrete symptom, not "it\'s broken".' },
  { id: 'repro', text: 'repro first,', pts: 20, good: true, tip: 'A real constraint the Bug fix playbook honors.' },
  { id: 'check', text: 'then fix and verify the row count matches the source.', pts: 30, good: true, tip: 'A check that can pass or fail.' },
  { id: 'constraint', text: "don't change the public export API.", pts: 15, good: true, tip: 'Saves time by ruling out an approach up front.' },
  { id: 'enum', text: 'use /how then /architect then /arena then /tdd.', pts: -25, good: false, tip: 'Pitfall: listing skills overrides the playbook\'s own sequence.' },
  { id: 'duration', text: 'work on it for 2 hours.', pts: -20, good: false, tip: 'Pitfall: a duration is not a finish condition.' },
  { id: 'vague', text: 'make it better.', pts: -15, good: false, tip: 'Pitfall: "better" gives the agent nothing to check.' },
]

export function PromptGrader() {
  const [on, setOn] = useState<Set<string>>(new Set())
  const base = 'fix the export.'
  const active = INGREDIENTS.filter((i) => on.has(i.id))
  const score = Math.max(0, Math.min(100, active.reduce((a, i) => a + i.pts, 0)))
  const parts = [on.has('mode') ? '/poteto-mode' : null, on.has('symptom') ? null : base, ...INGREDIENTS.filter((i) => i.id !== 'mode' && on.has(i.id)).map((i) => i.text)].filter((x): x is string => !!x)
  const label = score >= 90 ? 'Excellent' : score >= 65 ? 'Strong' : score >= 35 ? 'Getting there' : 'Weak'
  const color = score >= 65 ? 'var(--good)' : score >= 35 ? 'var(--gold)' : 'var(--bad)'
  return (
    <div className="widget">
      <div className="term" style={{ minHeight: 60, fontSize: 14 }}>
        {parts.map((p, i) => (
          <motion.span key={p + i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={p.startsWith('/') ? 'c-key' : INGREDIENTS.find((x) => x.text === p)?.good === false ? 'c-gold' : ''}>
            {p}{' '}
          </motion.span>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '12px 0' }}>
        <div className="bar" style={{ flex: 1, height: 14 }}>
          <motion.div animate={{ width: `${score}%` }} style={{ background: color }} />
        </div>
        <span style={{ fontWeight: 800, color, minWidth: 120, textAlign: 'right' }}>
          {score}/100 · {label}
        </span>
      </div>
      <div style={{ display: 'grid', gap: 6 }}>
        {INGREDIENTS.map((i) => {
          const sel = on.has(i.id)
          return (
            <button
              key={i.id}
              onClick={() => {
                const next = new Set(on)
                if (sel) next.delete(i.id)
                else next.add(i.id)
                setOn(next)
              }}
              className="option"
              style={{ padding: '10px 12px', fontSize: 14, borderBottomWidth: 2, ...(sel ? { borderColor: i.good ? 'var(--good)' : 'var(--bad)', background: i.good ? 'var(--good-soft)' : 'var(--bad-soft)' } : {}) }}
            >
              <span className="key" style={{ width: 26, height: 26, ...(sel ? { background: i.good ? 'var(--good)' : 'var(--bad)', borderColor: 'transparent', color: 'white' } : {}) }}>
                {sel ? '✓' : '+'}
              </span>
              <span style={{ flex: 1 }}>
                <span className="mono" style={{ fontSize: 13 }}>
                  {i.text}
                </span>
                {sel && <div style={{ fontSize: 12.5, fontWeight: 600, color: i.good ? 'var(--good)' : 'var(--bad)', marginTop: 2 }}>{i.tip}</div>}
              </span>
              <span style={{ fontWeight: 800, fontSize: 13, color: i.pts > 0 ? 'var(--good)' : 'var(--bad)' }}>{i.pts > 0 ? `+${i.pts}` : i.pts}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ---------------- why detective ---------------- */

const SOURCES = [
  { id: 'git', name: 'Source control', icon: '🌳', finding: 'Commit 4f2a91c "cap retries at 5" by @maya, linked to PR #812.', kind: 'evidence' as const },
  { id: 'issues', name: 'Issue tracker', icon: '🎫', finding: 'INC-233: a retry storm took down the billing API at 9 retries.', kind: 'evidence' as const },
  { id: 'docs', name: 'Long-form docs', icon: '📚', finding: 'RFC "Retry policy v2" recommends 3 to 5 retries with jitter.', kind: 'evidence' as const },
  { id: 'chat', name: 'Team chat', icon: '💬', finding: '"5 felt safe after the incident" in #payments. Opinion, not data.', kind: 'inference' as const },
  { id: 'obs', name: 'Observability', icon: '📊', finding: '99.7% of successful calls succeed by retry 3 today.', kind: 'evidence' as const },
  { id: 'errors', name: 'Error tracking', icon: '🚨', finding: 'Nothing relevant found.', kind: 'null' as const },
  { id: 'analytics', name: 'Analytics', icon: '🗄️', finding: 'No MCP connected. Not searched.', kind: 'null' as const },
]

export function WhyDetective() {
  const [phase, setPhase] = useState<'idle' | 'running' | 'done'>('idle')
  const [doneIds, setDoneIds] = useState<Set<string>>(new Set())
  useEffect(() => {
    if (phase !== 'running') return
    const timers = SOURCES.map((s, i) =>
      setTimeout(() => {
        setDoneIds((d) => new Set(d).add(s.id))
        if (i === SOURCES.length - 1) setTimeout(() => setPhase('done'), 500)
      }, 500 + ((i * 397) % 1700) + i * 160),
    )
    return () => timers.forEach(clearTimeout)
  }, [phase])
  return (
    <div className="widget">
      <div className="term" style={{ fontSize: 14, marginBottom: 12 }}>
        <span className="c-key">/why</span> was the retry limit set to five? does the reason still hold?
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 8 }}>
        {SOURCES.map((s) => {
          const done = doneIds.has(s.id)
          const running = phase === 'running' && !done
          return (
            <motion.div key={s.id} layout className="card" style={{ padding: 10, borderColor: done ? (s.kind === 'evidence' ? 'var(--good)' : s.kind === 'inference' ? 'var(--gold)' : 'var(--line-2)') : undefined }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 800, fontSize: 13 }}>
                <span style={{ fontSize: 18 }}>{s.icon}</span>
                {s.name}
                {running && <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} style={{ marginLeft: 'auto' }}>🔎</motion.span>}
                {done && <span style={{ marginLeft: 'auto' }}>{s.kind === 'evidence' ? '✅' : s.kind === 'inference' ? '🟡' : '∅'}</span>}
              </div>
              {done && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ margin: '6px 0 0', fontSize: 12.5, color: 'var(--ink-2)' }}>
                  {s.finding}
                </motion.p>
              )}
            </motion.div>
          )
        })}
      </div>
      {phase === 'idle' && (
        <div className="widget-toolbar">
          <button className="btn btn-primary btn-sm" onClick={() => setPhase('running')}>
            🕵️ Dispatch investigators in parallel
          </button>
        </div>
      )}
      <AnimatePresence>
        {phase === 'done' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ padding: 16, marginTop: 12 }}>
            <div className="eyebrow">Synthesized report</div>
            <p style={{ margin: '6px 0' }}>
              <strong>Direct evidence:</strong> the limit came from incident INC-233 (commit 4f2a91c, PR #812) and matches the retry RFC. Today, 99.7% of calls succeed by retry 3.
            </p>
            <p style={{ margin: '6px 0' }}>
              <strong>Inference:</strong> the team <em>appears to</em> have picked 5 as a safety margin, per a chat message. Opinion, not data.
            </p>
            <p style={{ margin: '6px 0' }}>
              <strong>Null results:</strong> error tracking had nothing. Analytics was not searched, because no connector was available.
            </p>
            <p style={{ margin: '6px 0 0', color: 'var(--good)', fontWeight: 700 }}>Verdict: the reason still holds. Lowering to 3 is plausible but needs a test against the incident pattern.</p>
            <button className="btn btn-ghost btn-sm" style={{ marginTop: 10 }} onClick={() => (setPhase('idle'), setDoneIds(new Set()))}>
              ↻ Run again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
