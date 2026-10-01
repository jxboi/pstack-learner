import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

/* ---------------- overnight contract ---------------- */

const LINES = [
  { id: 'bed', text: 'im going to bed.', good: true, buys: 'Session override. The agent stops asking and keeps going.' },
  { id: 'goal', text: 'migrate every caller to the new parser in a fresh worktree off main.', good: true, buys: 'The goal, plus isolation so the run cannot collide with anything else you have open.' },
  { id: 'done', text: 'done means zero old callers, all parser fixtures pass, old api deleted.', good: true, buys: 'A finish condition every iteration can check.' },
  { id: 'log', text: "keep a decision log. don't ask me before committing.", good: true, buys: 'An auditable trail, and a pre-answered permission the agent would otherwise block on.' },
  { id: 'loop', text: "/loop until done. if you're truly stuck after a few hours, stop and write up why.", good: true, buys: 'The wake mechanism, plus an escape hatch that beats eight hours of creative goal reinterpretation.' },
  { id: 'hours', text: 'work on this for 8 hours.', good: false, buys: 'A duration is not a finish condition. You wake up to motion, not a result.' },
  { id: 'enum', text: 'use /how, then /architect, then /arena, then /tdd.', good: false, buys: 'Enumerating skills overrides the playbook and often drops steps it would have kept.' },
]

export function OvernightContract() {
  const [on, setOn] = useState<string[]>([])
  const good = LINES.filter((l) => l.good)
  const goodOn = on.filter((id) => LINES.find((l) => l.id === id)!.good).length
  const badOn = on.filter((id) => !LINES.find((l) => l.id === id)!.good).length
  const safe = goodOn === good.length && badOn === 0
  const pct = Math.max(0, (goodOn / good.length) * 100 - badOn * 25)
  return (
    <div className="widget split">
      <div style={{ display: 'grid', gap: 6, alignContent: 'start' }}>
        <div className="eyebrow">Candidate lines</div>
        {LINES.map((l) => {
          const sel = on.includes(l.id)
          return (
            <button
              key={l.id}
              className="option"
              style={{ padding: '9px 12px', fontSize: 13.5, borderBottomWidth: 2, ...(sel ? { borderColor: l.good ? 'var(--good)' : 'var(--bad)', background: l.good ? 'var(--good-soft)' : 'var(--bad-soft)' } : {}) }}
              onClick={() => setOn(sel ? on.filter((x) => x !== l.id) : [...on, l.id])}
            >
              <span className="key" style={{ width: 24, height: 24 }}>
                {sel ? '✓' : '+'}
              </span>
              <span className="mono" style={{ fontSize: 12.5 }}>
                {l.text}
              </span>
            </button>
          )
        })}
      </div>
      <div>
        <div className="eyebrow" style={{ marginBottom: 6 }}>
          Your contract
        </div>
        <div className="term" style={{ minHeight: 140, fontSize: 12.5 }}>
          <span className="c-key">/poteto-mode</span>{' '}
          {on.length === 0 && <span className="c-dim">add lines from the left…</span>}
          {on.map((id) => {
            const l = LINES.find((x) => x.id === id)!
            return (
              <motion.div key={id} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} className={l.good ? '' : 'c-gold'}>
                {l.text}
              </motion.div>
            )
          })}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '10px 0' }}>
          <span style={{ fontSize: 22 }}>{safe ? '🌙' : '⚠️'}</span>
          <div className="bar" style={{ flex: 1 }}>
            <motion.div animate={{ width: `${pct}%` }} style={{ background: safe ? 'var(--good)' : 'var(--gold)' }} />
          </div>
        </div>
        <>
          <motion.div key={on.at(-1) ?? 'none'} initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontSize: 14, fontWeight: 600 }}>
            {safe ? (
              <span style={{ color: 'var(--good)' }}>Safe to leave overnight. Goal, isolation, finish line, trail, wake-up and an escape hatch.</span>
            ) : on.length ? (
              <span style={{ color: LINES.find((l) => l.id === on.at(-1))!.good ? 'var(--ink-2)' : 'var(--bad)' }}>{LINES.find((l) => l.id === on.at(-1))!.buys}</span>
            ) : (
              <span className="muted">Pick the lines that make an unattended run safe.</span>
            )}
          </motion.div>
        </>
      </div>
    </div>
  )
}

/* ---------------- night loop ---------------- */

type Row = { ts: string; phase: string; decision: string; why: string; evidence: string; result: string; kept: boolean; remaining: number }

const PLAN: Omit<Row, 'ts'>[] = [
  { phase: 'frame', decision: 'counted callers of the old parser', why: 'know the size before starting', evidence: 'scripts/count-callers.sh', result: '42 old callers', kept: true, remaining: 42 },
  { phase: 'lever', decision: 'wrote a codemod for the simple call shape', why: 'same edit 30+ times, build the lever', evidence: 'scripts/codemod.ts', result: 'dry run ok', kept: true, remaining: 42 },
  { phase: 'migrate', decision: 'ran codemod on packages/api', why: 'smallest package first', evidence: 'commit 3a9f1c2', result: 'fixtures green, 31 left', kept: true, remaining: 31 },
  { phase: 'migrate', decision: 'ran codemod on packages/web', why: 'next package', evidence: 'commit 7c21e0a', result: 'fixtures green, 14 left', kept: true, remaining: 14 },
  { phase: 'migrate', decision: 'hand-fixed date callers with a shim', why: 'codemod missed the date shape', evidence: 'worktree reset', result: 'reverted, 2 fixtures red', kept: false, remaining: 14 },
  { phase: 'migrate', decision: 'taught codemod the date shape instead', why: 'fix the lever, not each caller', evidence: 'commit b51e9d0', result: 'fixtures green, 3 left', kept: true, remaining: 3 },
  { phase: 'migrate', decision: 'migrated the last 3 callers', why: 'dynamic imports the codemod cannot see', evidence: 'commit c03d7aa', result: '0 old callers', kept: true, remaining: 0 },
  { phase: 'delete', decision: 'deleted the old parser api', why: 'migrate callers then delete legacy', evidence: 'commit e88f210', result: 'all fixtures green', kept: true, remaining: 0 },
]

export function NightLoop() {
  const [rows, setRows] = useState<Row[]>([])
  const [running, setRunning] = useState(false)
  const scroller = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!running) return
    if (rows.length >= PLAN.length) {
      setRunning(false)
      return
    }
    const t = setTimeout(() => {
      const h = 23 + rows.length
      const ts = `T${String(h % 24).padStart(2, '0')}:${String((rows.length * 17) % 60).padStart(2, '0')}`
      setRows((r) => [...r, { ts, ...PLAN[r.length] }])
    }, 1100)
    return () => clearTimeout(t)
  }, [running, rows])
  useEffect(() => {
    scroller.current?.scrollTo({ top: 9999, behavior: 'smooth' })
  }, [rows])
  const remaining = rows.at(-1)?.remaining ?? 42
  const done = rows.length >= PLAN.length
  const step = rows.length % 4
  return (
    <div className="widget">
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap', marginBottom: 12 }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {['Check finish condition', 'Smallest change', 'Verify', 'Commit or discard + log'].map((s, i) => (
            <motion.span key={s} className="chip" animate={{ scale: running && step === i ? 1.08 : 1 }} style={{ background: running && step === i ? 'var(--gold-soft)' : undefined, borderColor: running && step === i ? 'var(--gold)' : undefined }}>
              {s}
            </motion.span>
          ))}
        </div>
        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
          <div className="eyebrow">Finish condition</div>
          <div style={{ fontWeight: 800, color: remaining === 0 && done ? 'var(--good)' : 'var(--ink)' }}>old callers: {remaining}</div>
        </div>
      </div>
      <div ref={scroller} className="term" style={{ fontSize: 11.5, maxHeight: 260, overflow: 'auto', whiteSpace: 'nowrap' }}>
        <div className="c-dim">ts{'\t'}phase{'\t'}decision{'\t'}why{'\t'}evidence{'\t'}result</div>
        <AnimatePresence>
          {rows.map((r, i) => (
            <motion.div key={i} initial={{ opacity: 0, backgroundColor: 'rgba(242,177,29,0.3)' }} animate={{ opacity: 1, backgroundColor: 'rgba(0,0,0,0)' }} transition={{ duration: 0.8 }}>
              <span className="c-dim">{r.ts}</span> <span className="c-gold">{r.phase}</span> {r.decision} <span className="c-dim">· {r.why} ·</span> <span className="c-str">{r.evidence}</span> <span className={r.kept ? '' : 'c-key'}>{r.result}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <div className="widget-toolbar">
        <button className="btn btn-primary btn-sm" onClick={() => (done ? (setRows([]), setRunning(true)) : setRunning(!running))}>
          {done ? '↻ Run the night again' : running ? '⏸ Pause' : rows.length ? '▶ Resume' : '🌙 Start the overnight run'}
        </button>
      </div>
      <AnimatePresence>
        {done && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ padding: 14, marginTop: 10 }}>
            <div className="eyebrow" style={{ color: 'var(--good)' }}>
              ☀️ Morning summary · Attention
            </div>
            <ul style={{ margin: '8px 0 0', paddingLeft: 18, fontSize: 14 }}>
              <li>
                The 5th row was <strong>reverted</strong>: a hand-written shim broke 2 fixtures. The run fixed the codemod instead. Worth a look.
              </li>
              <li>3 callers used dynamic imports the codemod could not see. They were migrated by hand in commit c03d7aa.</li>
              <li>Finish condition met: 0 old callers, all fixtures pass, old api deleted.</li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
