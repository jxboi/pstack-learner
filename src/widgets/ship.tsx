import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

/* ---------------- comment sicko ---------------- */

const CODE: { text: string; comment?: { keep: boolean; why: string } }[] = [
  { text: '// Copyright 2026 Acme Inc. Licensed under MIT.', comment: { keep: true, why: 'License header. On the keep list.' } },
  { text: '' },
  { text: '/** Returns the user’s display name. Never throws. */', comment: { keep: true, why: 'A doc comment defining a public API contract. Kept.' } },
  { text: 'export function displayName(user: User): string {' },
  { text: '  // get the name', comment: { keep: false, why: 'Narration. The code already says this.' } },
  { text: '  const name = user.profile.name' },
  { text: '  // Phase 2: fallback logic', comment: { keep: false, why: 'Phase-narrating banner. Kill.' } },
  { text: '  if (!name) return user.email' },
  { text: '  // const legacy = user.legacyName ?? ""', comment: { keep: false, why: 'Commented-out corpse. Git remembers it.' } },
  { text: '  // Safari drops trailing NBSP in titles, see https://bugs.webkit.org/1234', comment: { keep: true, why: 'Behavior forced by an external platform, with a link. Kept.' } },
  { text: '  return name.replace(/\\u00a0+$/, "")' },
  { text: '}' },
  { text: '' },
  { text: '// HACK: this is weird because our cache returns stale ids, do not touch', comment: { keep: false, why: 'A surprise in our own code. Kill it and flag MUST KILL: fix the cache, or encode the constraint as a test.' } },
  { text: 'export const freshId = (id: string) => id.split(":").pop()!' },
]

export function CommentSicko() {
  const [marked, setMarked] = useState<Set<number>>(new Set())
  const [judged, setJudged] = useState(false)
  const comments = CODE.map((l, i) => (l.comment ? i : -1)).filter((i) => i >= 0)
  const kills = comments.filter((i) => !CODE[i].comment!.keep)
  const right = comments.filter((i) => (CODE[i].comment!.keep ? !marked.has(i) : marked.has(i))).length
  const toggle = (i: number) =>
    setMarked((m) => {
      const n = new Set(m)
      if (n.has(i)) n.delete(i)
      else n.add(i)
      return n
    })
  return (
    <div className="widget">
      <div className="term" style={{ padding: 8 }}>
        {CODE.map((l, i) => {
          const c = l.comment
          const isMarked = marked.has(i)
          let bg = 'transparent'
          if (judged && c) bg = c.keep === !isMarked ? 'rgb(63 207 139 / 18%)' : 'rgb(255 122 110 / 22%)'
          else if (isMarked) bg = 'rgb(255 122 110 / 18%)'
          return (
            <div key={i}>
              <div
                role={c ? 'button' : undefined}
                tabIndex={c && !judged ? 0 : -1}
                onClick={() => c && !judged && toggle(i)}
                onKeyDown={(e) => e.key === 'Enter' && c && !judged && toggle(i)}
                className="diff-line"
                style={{
                  padding: '1px 6px',
                  borderRadius: 4,
                  cursor: c && !judged ? 'pointer' : 'default',
                  background: bg,
                  textDecoration: isMarked ? 'line-through' : 'none',
                  color: c ? (isMarked ? '#ff9b91' : '#8b86a5') : undefined,
                  minHeight: '1.65em',
                }}
              >
                {l.text || ' '}
                {c && !judged && <span style={{ float: 'right', opacity: 0.6, fontSize: 11 }}>{isMarked ? '🗑' : '·'}</span>}
              </div>
              {judged && c && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ fontSize: 11.5, color: c.keep === !isMarked ? '#b6f0c2' : '#ffb3a8', padding: '0 6px 4px 18px', fontFamily: 'var(--font)' }}>
                  {c.keep === !isMarked ? '✓' : '✗'} {c.why}
                </motion.div>
              )}
            </div>
          )
        })}
      </div>
      <div className="widget-toolbar">
        {!judged ? (
          <>
            <button className="btn btn-bad btn-sm" onClick={() => setJudged(true)} disabled={!marked.size}>
              😈 Unleash Comment Sicko
            </button>
            <span className="muted" style={{ fontSize: 13, fontWeight: 600 }}>
              Marked {marked.size} for deletion
            </span>
          </>
        ) : (
          <>
            <motion.span initial={{ scale: 0.6 }} animate={{ scale: 1 }} style={{ fontWeight: 800, color: right === comments.length ? 'var(--good)' : 'var(--warn)' }}>
              {right === comments.length ? '"Yes... Ha ha ha... Yes!" Perfect: ' : 'Sicko says: '}
              {right}/{comments.length} calls right · the right answer deletes {kills.length} and keeps {comments.length - kills.length}
            </motion.span>
            <button className="btn btn-ghost btn-sm" onClick={() => (setJudged(false), setMarked(new Set()))}>
              ↻ Try again
            </button>
          </>
        )}
      </div>
    </div>
  )
}

/* ---------------- tdd cycle ---------------- */

const TDD = [
  {
    phase: 'Reproduce',
    color: 'var(--muted)',
    title: 'Confirm the bug exists',
    term: ['$ node cli.js export --retry', 'wrote 2 rows for job 42   ← should be 1'],
  },
  {
    phase: 'Red',
    color: 'var(--bad)',
    title: 'Write the smallest failing test',
    term: ['test("retry writes one row", () => {', '  expect(runExport({ retries: 1 }).rows).toBe(1)', '})', '', '$ npm test export', '✗ retry writes one row  expected 1, received 2'],
  },
  {
    phase: 'Green',
    color: 'var(--good)',
    title: 'Make the minimal fix',
    term: ['- await write(row)', '+ await write(row, { key: job.id })', '', '$ npm test export', '✓ retry writes one row'],
  },
  {
    phase: 'Commit',
    color: 'var(--m-proficient)',
    title: 'Sequence the story for reviewers',
    term: ['$ git log --oneline', 'b7e1c0d fix(export): dedupe retried writes by job id', 'a12f9e3 test(export): failing repro for duplicate row on retry'],
  },
]

export function TddCycle() {
  const [i, setI] = useState(0)
  const s = TDD[i]
  return (
    <div className="widget">
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
        {TDD.map((t, k) => (
          <button key={t.phase} onClick={() => setI(k)} className="chip" style={{ cursor: 'pointer', borderColor: k === i ? t.color : undefined, color: k === i ? t.color : undefined, fontSize: 14, padding: '6px 12px' }}>
            {k + 1}. {t.phase}
          </button>
        ))}
      </div>
      <>
        <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ width: 16, height: 16, borderRadius: 99, background: s.color, display: 'inline-block' }} />
            <strong style={{ fontSize: 17 }}>{s.title}</strong>
          </div>
          <div className="term">
            {s.term.map((l, k) => (
              <div key={k} className={`diff-line ${l.startsWith('+') ? 'diff-add' : l.startsWith('-') ? 'diff-del' : ''} ${l.startsWith('✗') ? 'c-key' : l.startsWith('✓') ? 'c-str' : l.startsWith('$') ? 'c-gold' : ''}`}>
                {l || ' '}
              </div>
            ))}
          </div>
          {i === 3 && <p style={{ margin: '10px 0 0', fontSize: 14, fontWeight: 600 }}>Read bottom-up: the failing test lands first, then the fix. A reviewer can check out each commit and watch it go red, then green.</p>}
        </motion.div>
      </>
      <div className="widget-toolbar">
        <button className="btn btn-ghost btn-sm" onClick={() => setI(Math.max(0, i - 1))} disabled={i === 0}>
          ← Back
        </button>
        <button className="btn btn-primary btn-sm" onClick={() => setI(Math.min(TDD.length - 1, i + 1))} disabled={i === TDD.length - 1}>
          Next →
        </button>
      </div>
    </div>
  )
}

/* ---------------- stack lander ---------------- */

const PRS = [
  { n: 101, title: 'scaffold: parser module' },
  { n: 102, title: 'parser: handle dates' },
  { n: 103, title: 'migrate callers to parser' },
  { n: 104, title: 'delete legacy parser' },
  { n: 105, title: 'docs: parser guide' },
]

export function StackLander() {
  const [ok, setOk] = useState<boolean[]>([true, true, false, true, true])
  const [landed, setLanded] = useState(0)
  const [landing, setLanding] = useState(false)
  let ceiling = 0
  while (ceiling < ok.length && ok[ceiling]) ceiling++
  useEffect(() => {
    if (!landing) return
    if (landed >= ceiling) {
      setLanding(false)
      return
    }
    const t = setTimeout(() => setLanded((l) => l + 1), 750)
    return () => clearTimeout(t)
  }, [landing, landed, ceiling])
  const reset = () => (setLanded(0), setLanding(false))
  return (
    <div className="widget split">
      <div>
        <div className="eyebrow" style={{ marginBottom: 6 }}>
          Stack (top → bottom). Tap a verdict to flip it.
        </div>
        <div style={{ display: 'grid', gap: 6 }}>
          {[...PRS].reverse().map((pr) => {
            const idx = PRS.indexOf(pr)
            const isLanded = idx < landed
            const landable = idx < ceiling
            return (
              <motion.div
                key={pr.n}
                layout
                animate={{ opacity: isLanded ? 0.35 : 1, x: isLanded ? 30 : 0 }}
                className="card"
                style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10, borderWidth: 2, borderColor: landable && !isLanded ? 'var(--good)' : undefined }}
              >
                <span className="mono" style={{ fontWeight: 700, fontSize: 13 }}>
                  #{pr.n}
                </span>
                <span style={{ flex: 1, fontSize: 14, fontWeight: 600 }}>{pr.title}</span>
                {isLanded ? (
                  <span className="chip" style={{ background: 'var(--m-proficient)', color: 'white', borderColor: 'transparent' }}>
                    merged
                  </span>
                ) : (
                  <button
                    className="chip"
                    disabled={landing || landed > 0}
                    onClick={() => setOk((cur) => cur.map((v, k) => (k === idx ? !v : v)))}
                    style={{ cursor: 'pointer', background: ok[idx] ? 'var(--good-soft)' : 'var(--bad-soft)', color: ok[idx] ? 'var(--good)' : 'var(--bad)', borderColor: 'transparent' }}
                  >
                    {ok[idx] ? '✓ PASS' : '✗ unverified'}
                  </button>
                )}
              </motion.div>
            )
          })}
          <div className="mono" style={{ textAlign: 'center', fontSize: 12, color: 'var(--muted)', fontWeight: 700, padding: 6, borderTop: '3px solid var(--line-2)' }}>
            main
          </div>
        </div>
      </div>
      <div>
        <div className="card" style={{ padding: 16 }}>
          <div className="eyebrow">Shipping verdict</div>
          <p style={{ margin: '8px 0', fontSize: 15 }}>
            Contiguous verified run from the bottom: <strong>{ceiling === 0 ? 'none' : PRS.slice(0, ceiling).map((p) => `#${p.n}`).join(', ')}</strong>
          </p>
          {ceiling < PRS.length && (
            <p style={{ margin: '8px 0', fontSize: 14, color: 'var(--bad)', fontWeight: 600 }}>
              Ceiling: #{PRS[ceiling].n} is unverified. {PRS.slice(ceiling + 1).some((_, k) => ok[ceiling + 1 + k]) ? 'Verified PRs above it wait, because landing them would pull the gap in underneath.' : ''}
            </p>
          )}
          <button className="btn btn-good btn-sm" onClick={() => (landed >= ceiling ? reset() : setLanding(true))} disabled={landing || ceiling === 0}>
            {landed > 0 && landed >= ceiling ? '↻ Reset' : `🚢 Land ${ceiling} PR${ceiling === 1 ? '' : 's'}, one at a time`}
          </button>
        </div>
        <p className="muted" style={{ fontSize: 13, fontWeight: 600, marginTop: 10 }}>
          Each verdict comes from a fresh agent that did not write the PR. After every merge, Shipping re-checks the next PR before landing it.
        </p>
      </div>
    </div>
  )
}

/* ---------------- babysit queue ---------------- */

type Blocker = { id: string; kind: 'conflict' | 'thread' | 'ci'; text: string; answer: string; options: string[]; why: string }

const BLOCKERS: Blocker[] = [
  { id: 'c1', kind: 'conflict', text: 'Merge conflict with main in parser.ts', options: ['Force-push a rebase myself', 'Report which branch needs a rebase, and stop'], answer: 'Report which branch needs a rebase, and stop', why: 'A conflict is the one blocker Babysit reports rather than resolves. It never mutates stack topology.' },
  { id: 't1', kind: 'thread', text: 'Reviewer: "retry path can double-write" (with a repro)', options: ['Fix it, red-first', 'Dismiss'], answer: 'Fix it, red-first', why: 'A real finding with a repro. Fix it with a failing test first.' },
  { id: 't2', kind: 'thread', text: 'Bot: "add a null check on config.timeout"', options: ['Fix it, red-first', 'Dismiss with the disproof'], answer: 'Dismiss with the disproof', why: 'The config boundary already validates timeout. Dismiss and post the proof on the thread.' },
  { id: 'ci1', kind: 'ci', text: 'CI: e2e failed once with a network timeout', options: ['One fresh build', 'Retry it until green'], answer: 'One fresh build', why: 'Flake earns exactly one fresh build. An identical second failure means it was never flake.' },
  { id: 'ci2', kind: 'ci', text: 'CI: unit test fails in code this PR changed', options: ['Commit a fix', 'Retry the job'], answer: 'Commit a fix', why: 'A failure in the diff’s own code gets a commit, not a retry.' },
]
const KIND_ORDER = ['conflict', 'thread', 'ci'] as const
const KIND_LABEL = { conflict: '1 · Conflicts', thread: '2 · Review threads', ci: '3 · CI' }

export function BabysitQueue() {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [pushed, setPushed] = useState(false)
  const done = BLOCKERS.every((b) => answers[b.id])
  const correct = BLOCKERS.filter((b) => answers[b.id] === b.answer).length
  return (
    <div className="widget">
      {KIND_ORDER.map((k) => (
        <div key={k} style={{ marginBottom: 12 }}>
          <div className="eyebrow" style={{ marginBottom: 6 }}>
            {KIND_LABEL[k]}
          </div>
          <div style={{ display: 'grid', gap: 8 }}>
            {BLOCKERS.filter((b) => b.kind === k).map((b) => {
              const a = answers[b.id]
              return (
                <div key={b.id} className="card" style={{ padding: 12, borderColor: a ? (a === b.answer ? 'var(--good)' : 'var(--bad)') : undefined }}>
                  <div style={{ fontWeight: 700, fontSize: 14.5 }}>{b.text}</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
                    {b.options.map((o) => (
                      <button
                        key={o}
                        className="btn btn-sm"
                        disabled={!!a}
                        onClick={() => setAnswers((cur) => ({ ...cur, [b.id]: o }))}
                        style={{
                          background: a === o ? (o === b.answer ? 'var(--good)' : 'var(--bad)') : 'var(--surface-2)',
                          color: a === o ? 'white' : 'var(--ink)',
                          border: '1.5px solid var(--line-2)',
                          opacity: a && a !== o ? 0.5 : 1,
                        }}
                      >
                        {o}
                      </button>
                    ))}
                  </div>
                  {a && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ margin: '8px 0 0', fontSize: 13, color: a === b.answer ? 'var(--good)' : 'var(--bad)', fontWeight: 600 }}>
                      {a === b.answer ? '✓ ' : `✗ Better: "${b.answer}". `}
                      {b.why}
                    </motion.p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}
      <div className="widget-toolbar">
        <button className="btn btn-primary btn-sm" disabled={!done || pushed} onClick={() => setPushed(true)}>
          📦 Batch every fix into one push
        </button>
        {done && (
          <span style={{ fontWeight: 700, fontSize: 14 }}>
            {correct}/{BLOCKERS.length} handled the Babysit way
          </span>
        )}
      </div>
      <AnimatePresence>
        {pushed && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ padding: 14, marginTop: 10, borderColor: 'var(--good)' }}>
            <strong style={{ color: 'var(--good)' }}>✓ Checks restarted once. All green.</strong>
            <p style={{ margin: '6px 0 0', fontSize: 14 }}>
              Status: <strong>merge-ready</strong>. Babysit stops here and does <strong>not</strong> merge. To land it, say "land the stack", which routes to Shipping.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
