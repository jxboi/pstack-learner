import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

/* ---------------- arena ---------------- */

const CANDIDATES = [
  {
    id: 'A',
    title: 'Hash everything',
    sketch: 'key = sha256(JSON.stringify(request))',
    scores: { Correctness: 3, Simplicity: 5, Evolvability: 2 },
    idea: 'One-line key derivation. Very simple to call.',
  },
  {
    id: 'B',
    title: 'Versioned tuple',
    sketch: 'key = `v2:${tenant}:${route}:${hash(params)}`',
    scores: { Correctness: 5, Simplicity: 4, Evolvability: 5 },
    idea: 'A version prefix lets you invalidate everything by bumping v2 to v3.',
  },
  {
    id: 'C',
    title: 'Typed CacheKey object',
    sketch: 'new CacheKey({ tenant, route, params }).toString()',
    scores: { Correctness: 5, Simplicity: 2, Evolvability: 4 },
    idea: 'A branded CacheKey type means raw strings cannot be passed by mistake.',
  },
]

type ArenaPhase = 'brief' | 'running' | 'judged' | 'based' | 'grafted' | 'verified'

export function ArenaSim() {
  const [phase, setPhase] = useState<ArenaPhase>('brief')
  const [base, setBase] = useState<string | null>(null)
  const [graft, setGraft] = useState<string | null>(null)
  useEffect(() => {
    if (phase === 'running') {
      const t = setTimeout(() => setPhase('judged'), 1800)
      return () => clearTimeout(t)
    }
  }, [phase])
  const total = (c: (typeof CANDIDATES)[number]) => Object.values(c.scores).reduce((a, b) => a + b, 0)
  const best = CANDIDATES.reduce((a, b) => (total(b) > total(a) ? b : a))
  const steps: [ArenaPhase, string][] = [
    ['running', 'Candidates'],
    ['judged', 'Cross-judge'],
    ['based', 'Pick base'],
    ['grafted', 'Graft'],
    ['verified', 'Verify'],
  ]
  const order: ArenaPhase[] = ['brief', 'running', 'judged', 'based', 'grafted', 'verified']
  const at = order.indexOf(phase)
  return (
    <div className="widget">
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
        {steps.map(([p, l], i) => (
          <span key={p} className="chip" style={{ background: at > i ? 'var(--good-soft)' : at === i + 1 ? 'var(--gold-soft)' : undefined, color: at > i ? 'var(--good)' : undefined }}>
            {at > i + 1 || phase === 'verified' ? '✓' : i + 1} {l}
          </span>
        ))}
      </div>
      <div className="term" style={{ fontSize: 13, marginBottom: 12 }}>
        <span className="c-key">/arena</span> design the cache key format. it's expensive to change later.
      </div>
      {phase === 'brief' ? (
        <button className="btn btn-primary btn-sm" onClick={() => setPhase('running')}>
          ⚔️ Send to the panel (3 candidates)
        </button>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))', gap: 10 }}>
          {CANDIDATES.map((c, i) => {
            const isBase = base === c.id
            const canPick = phase === 'judged'
            const canGraft = phase === 'based' && !isBase
            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.25 }}
                className="card"
                style={{
                  padding: 12,
                  cursor: canPick || canGraft ? 'pointer' : 'default',
                  borderWidth: 2,
                  borderColor: isBase ? 'var(--brand)' : graft === c.id ? 'var(--gold)' : undefined,
                  position: 'relative',
                }}
                onClick={() => {
                  if (canPick) {
                    setBase(c.id)
                    setPhase('based')
                  } else if (canGraft) {
                    setGraft(c.id)
                    setPhase('grafted')
                  }
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="eyebrow">Candidate {c.id}</span>
                  {isBase && <span className="chip" style={{ background: 'var(--brand)', color: 'var(--brand-ink)', borderColor: 'transparent' }}>BASE</span>}
                  {graft === c.id && <span className="chip" style={{ background: 'var(--gold)', color: '#000', borderColor: 'transparent' }}>GRAFT</span>}
                </div>
                <div style={{ fontWeight: 800, margin: '4px 0', display: 'flex', justifyContent: 'space-between', gap: 6 }}>
                  <span>{c.title}</span>
                  {phase !== 'running' && <span className="muted" style={{ fontSize: 13 }}>{total(c)}/15</span>}
                </div>
                {phase === 'running' ? (
                  <motion.div className="mono" style={{ fontSize: 12, color: 'var(--muted)' }} animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.2 }}>
                    writing in its own worktree…
                  </motion.div>
                ) : (
                  <>
                    <div className="mono" style={{ fontSize: 11.5, background: 'var(--code-bg)', color: 'var(--code-ink)', padding: 8, borderRadius: 8, wordBreak: 'break-word' }}>
                      {c.sketch}
                    </div>
                    <div style={{ display: 'grid', gap: 4, marginTop: 8 }}>
                      {Object.entries(c.scores).map(([k, v]) => (
                        <div key={k} style={{ display: 'grid', gridTemplateColumns: '92px 1fr 26px', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700 }}>
                          <span className="muted">{k}</span>
                          <div className="bar" style={{ height: 7 }}>
                            <motion.div initial={{ width: 0 }} animate={{ width: `${v * 20}%` }} transition={{ delay: 0.3 + i * 0.15 }} />
                          </div>
                          <span style={{ textAlign: 'right' }}>{v}/5</span>
                        </div>
                      ))}
                    </div>
                    <p style={{ fontSize: 12.5, margin: '8px 0 0', color: 'var(--ink-2)' }}>💡 {c.idea}</p>
                  </>
                )}
              </motion.div>
            )
          })}
        </div>
      )}
      <>
        <motion.div key={phase} initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: 12, fontWeight: 600, fontSize: 14.5 }}>
          {phase === 'judged' && <span>⚖️ The judge (a different model family) scored them. Now <strong>you</strong> read each one and click the one to use as the <strong>base</strong>.</span>}
          {phase === 'based' && (
            <span>
              {base === best.id ? '✅ Good pick, that is also the top score. ' : `🤔 The judge scored ${best.id} higher, but you can override if you read the code and disagree. `}
              Now click a <strong>losing</strong> candidate to graft its best idea into the base.
            </span>
          )}
          {phase === 'grafted' && (
            <div>
              <span>
                🧬 Grafting <strong>{CANDIDATES.find((c) => c.id === graft)!.idea}</strong> into {base}.
              </span>
              <div style={{ marginTop: 8 }}>
                <button className="btn btn-good btn-sm" onClick={() => setPhase('verified')}>
                  ✓ Verify the merged design
                </button>
              </div>
            </div>
          )}
          {phase === 'verified' && (
            <div className="card" style={{ padding: 14, borderColor: 'var(--good)' }}>
              <div className="eyebrow" style={{ color: 'var(--good)' }}>
                Result
              </div>
              <div className="mono" style={{ fontSize: 13, marginTop: 6, wordBreak: 'break-word' }}>
                base {base}: {CANDIDATES.find((c) => c.id === base)!.sketch}
              </div>
              <div style={{ fontSize: 13.5, marginTop: 4, fontWeight: 600 }}>
                + grafted from {graft}: {CANDIDATES.find((c) => c.id === graft)!.idea}
              </div>
              <div className="mono" style={{ fontSize: 12.5, marginTop: 6, color: 'var(--good)' }}>
                ✓ verify: 1,000 sample requests, 0 key collisions, invalidation by version bump works
              </div>
              <p style={{ margin: '8px 0 0', fontSize: 14 }}>One base, the best ideas from the others, then verified. That is arena.</p>
              <button className="btn btn-ghost btn-sm" style={{ marginTop: 8 }} onClick={() => (setPhase('brief'), setBase(null), setGraft(null))}>
                ↻ Run again
              </button>
            </div>
          )}
        </motion.div>
      </>
    </div>
  )
}

/* ---------------- swarm ---------------- */

const PKGS = ['auth', 'billing', 'search', 'ui-kit', 'export', 'notify', 'admin', 'cli']
type Verdict = 'PASS' | 'ISSUES' | 'BLOCKED'
const VERDICT_STYLE: Record<Verdict, { bg: string; fg: string; icon: string }> = {
  PASS: { bg: 'var(--good-soft)', fg: 'var(--good)', icon: '✅' },
  ISSUES: { bg: 'var(--warn-soft)', fg: 'var(--warn)', icon: '⚠️' },
  BLOCKED: { bg: 'var(--bad-soft)', fg: 'var(--bad)', icon: '⛔' },
}
const DETAILS: Record<string, string> = {
  ISSUES: 'check.sh: 2 lint errors in src/index.ts',
  BLOCKED: 'missing DATABASE_URL, could not start',
}

function rollVerdicts(): Record<string, Verdict> {
  const out: Record<string, Verdict> = {}
  const issues = Math.floor(Math.random() * PKGS.length)
  let blocked = Math.floor(Math.random() * PKGS.length)
  if (blocked === issues) blocked = (blocked + 3) % PKGS.length
  PKGS.forEach((p, i) => (out[p] = i === issues ? 'ISSUES' : i === blocked ? 'BLOCKED' : 'PASS'))
  return out
}

export function SwarmSim() {
  const [run, setRun] = useState(0)
  const [verdicts, setVerdicts] = useState<Record<string, Verdict>>({})
  const [arrived, setArrived] = useState<Record<string, boolean>>({})
  const [finished, setFinished] = useState<Set<string>>(new Set())
  useEffect(() => {
    if (!run) return
    const v = rollVerdicts()
    setVerdicts(v)
    setArrived({})
    setFinished(new Set())
    const timers: ReturnType<typeof setTimeout>[] = []
    PKGS.forEach((p, i) => {
      timers.push(setTimeout(() => setArrived((a) => ({ ...a, [p]: true })), 100 + i * 70))
      timers.push(setTimeout(() => setFinished((f) => new Set(f).add(p)), 900 + Math.random() * 1800))
    })
    return () => timers.forEach(clearTimeout)
  }, [run])
  const done = run > 0 && finished.size === PKGS.length
  const count = (v: Verdict) => PKGS.filter((p) => verdicts[p] === v).length
  return (
    <div className="widget">
      <div className="term" style={{ fontSize: 13, marginBottom: 12 }}>
        <span className="c-key">/swarm</span> check every package under packages/ against its check.sh. one worker per package. one report.
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(120px,1fr))', gap: 8 }}>
        {PKGS.map((p) => {
          const fin = finished.has(p)
          const v = verdicts[p]
          const st = fin && v ? VERDICT_STYLE[v] : null
          return (
            <motion.div key={p} className="card" layout style={{ padding: 10, background: st?.bg, borderColor: st ? st.fg : undefined, minHeight: 82, position: 'relative' }}>
              <div className="mono" style={{ fontSize: 12.5, fontWeight: 700 }}>
                packages/{p}
              </div>
              <AnimatePresence>
                {run > 0 && arrived[p] && !fin && (
                  <motion.div initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} style={{ fontSize: 22, marginTop: 4 }}>
                    <motion.span animate={{ rotate: [0, -8, 8, 0] }} transition={{ repeat: Infinity, duration: 0.6 }} style={{ display: 'inline-block' }}>
                      🤖
                    </motion.span>
                  </motion.div>
                )}
              </AnimatePresence>
              {st && (
                <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ fontWeight: 800, color: st.fg, fontSize: 13, marginTop: 6 }}>
                  {st.icon} {v}
                </motion.div>
              )}
            </motion.div>
          )
        })}
      </div>
      <div className="widget-toolbar">
        <button className="btn btn-primary btn-sm" onClick={() => setRun((r) => r + 1)} disabled={run > 0 && !done}>
          {run ? '↻ Run the swarm again' : '🐝 Release the swarm'}
        </button>
        {run > 0 && !done && <span className="muted" style={{ fontWeight: 600, fontSize: 13 }}>Parent is waiting for {PKGS.length - finished.size} worker(s)…</span>}
      </div>
      <AnimatePresence>
        {done && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="term" style={{ marginTop: 12, fontSize: 13 }}>
            <div className="c-gold">## Swarm report · {PKGS.length} workers, 0 dropouts</div>
            <div>
              <span className="c-str">PASS</span> {count('PASS')} · <span className="c-gold">ISSUES</span> {count('ISSUES')} · <span className="c-key">BLOCKED</span> {count('BLOCKED')}
            </div>
            {PKGS.filter((p) => verdicts[p] !== 'PASS').map((p) => (
              <div key={p}>
                - packages/{p}: <span className={verdicts[p] === 'BLOCKED' ? 'c-key' : 'c-gold'}>{verdicts[p]}</span> <span className="c-dim">{DETAILS[verdicts[p]]}</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ---------------- design ladder ---------------- */

const RUNGS = [
  { id: 'none', label: 'No design ceremony', icon: '🙂', note: 'Most changes. Just do it well.' },
  { id: 'interrogate', label: '/interrogate alone', icon: '🔍', note: 'Small finished change you are unsure about.' },
  { id: 'arena', label: '/arena directly', icon: '⚔️', note: 'Standalone decision: naming, format, algorithm.' },
  { id: 'architect', label: '/architect (+ /arena)', icon: '🏗️', note: 'Crosses function boundaries or moves ownership.' },
  { id: 'both', label: '/architect, then /interrogate', icon: '🏛️', note: 'Contested and expensive to reverse.' },
]

const SITUATIONS = [
  { text: 'Fix a typo in an error message', rung: 'none' },
  { text: 'A 20-line change you finished but feel uneasy about', rung: 'interrogate' },
  { text: 'Choose the file format for saved drafts', rung: 'arena' },
  { text: 'New import pipeline used by three services', rung: 'architect' },
  { text: 'Redesign how billing and accounts share state', rung: 'both' },
  { text: 'Run every package\'s checks in parallel', rung: 'swarm' },
]

export function DesignLadder() {
  const [sel, setSel] = useState(0)
  const target = SITUATIONS[sel].rung
  return (
    <div className="widget split">
      <div style={{ display: 'grid', gap: 6, alignContent: 'start' }}>
        <div className="eyebrow">Situation</div>
        {SITUATIONS.map((s, i) => (
          <button key={i} className={`option ${sel === i ? 'selected' : ''}`} style={{ padding: '10px 12px', fontSize: 14 }} onClick={() => setSel(i)}>
            {s.text}
          </button>
        ))}
      </div>
      <div style={{ display: 'grid', gap: 6, alignContent: 'start' }}>
        <div className="eyebrow">Scrutiny ladder (low → high)</div>
        {RUNGS.map((r, i) => {
          const on = r.id === target
          return (
            <motion.div key={r.id} animate={{ x: on ? 6 : 0, scale: on ? 1.02 : 1 }} className="card" style={{ padding: '10px 12px', borderWidth: 2, borderColor: on ? 'var(--gold)' : undefined, background: on ? 'var(--gold-soft)' : undefined, marginLeft: i * 6 }}>
              <div style={{ fontWeight: 800, fontSize: 14 }}>
                {r.icon} {r.label}
              </div>
              <div className="muted" style={{ fontSize: 12.5, fontWeight: 600 }}>
                {r.note}
              </div>
            </motion.div>
          )
        })}
        <motion.div animate={{ scale: target === 'swarm' ? 1.02 : 1 }} className="card" style={{ padding: '10px 12px', borderWidth: 2, borderStyle: 'dashed', borderColor: target === 'swarm' ? 'var(--gold)' : undefined, background: target === 'swarm' ? 'var(--gold-soft)' : undefined }}>
          <div style={{ fontWeight: 800, fontSize: 14 }}>🐝 /swarm (side track)</div>
          <div className="muted" style={{ fontSize: 12.5, fontWeight: 600 }}>
            Not more design, just coverage: slices, matrices, races.
          </div>
        </motion.div>
      </div>
    </div>
  )
}
