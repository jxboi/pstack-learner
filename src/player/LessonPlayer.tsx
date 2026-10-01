import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { Link, useNavigate } from 'react-router-dom'
import type { Lesson, Step, Unit } from '../content/types'
import { isQuestion } from '../content/types'
import { lessonKey, nextLesson } from '../content/course'
import { completeLesson, markStarted, masteryOf, MASTERY_LABEL, useProfile, type CompletionResult } from '../lib/store'
import { BADGES } from '../lib/badges'
import { Markdown, Inline } from '../components/Markdown'
import { MasteryIcon } from '../components/ui'
import { Mcq, Multi, Order, Match, Sort, Spot } from './questions'
import { WIDGETS } from '../widgets'
import { celebrate, sfx } from '../lib/fx'

type Status = 'idle' | 'correct' | 'wrong'

const CALLOUT_ICON = { tip: '💡', warn: '⚠️', analogy: '🧠', key: '🔑' } as const

function StepView({ step, checked, onChange }: { step: Step; checked: boolean; onChange: (r: boolean, c: boolean) => void }) {
  switch (step.kind) {
    case 'read':
      return (
        <>
          <h2 className="step-title">{step.title}</h2>
          {step.image && (
            <figure className="step-figure">
              <img src={step.image.src} alt={step.image.alt} loading="lazy" style={step.image.src.endsWith('logo.png') ? { maxWidth: 220, margin: '0 auto' } : undefined} />
              {step.image.credit && <figcaption>{step.image.credit}</figcaption>}
            </figure>
          )}
          <Markdown text={step.body} />
          {step.callout && (
            <div className={`callout ${step.callout.tone}`}>
              <span className="ico">{CALLOUT_ICON[step.callout.tone]}</span>
              <div>
                <Inline text={step.callout.text} />
              </div>
            </div>
          )}
        </>
      )
    case 'widget': {
      const W = WIDGETS[step.widget]
      return (
        <>
          <div className="eyebrow" style={{ color: 'var(--brand)', marginBottom: 6 }}>
            Interactive
          </div>
          <h2 className="step-title">{step.title}</h2>
          {step.intro && (
            <p style={{ marginTop: -6, color: 'var(--ink-2)' }}>
              <Inline text={step.intro} />
            </p>
          )}
          <W />
        </>
      )
    }
    case 'recap':
      return (
        <>
          <div className="eyebrow" style={{ color: 'var(--good)', marginBottom: 6 }}>
            Recap
          </div>
          <h2 className="step-title">{step.title}</h2>
          <ul className="recap-list">
            {step.points.map((p, i) => (
              <motion.li key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 * i }}>
                <span className="tick">✓</span>
                <span>
                  <Inline text={p} />
                </span>
              </motion.li>
            ))}
          </ul>
        </>
      )
    default: {
      const props = { checked, onChange }
      return (
        <>
          <div className="eyebrow" style={{ marginBottom: 8 }}>
            {step.kind === 'mcq' ? 'Choose one' : step.kind === 'multi' ? 'Choose all that apply' : step.kind === 'order' ? 'Put in order' : step.kind === 'match' ? 'Match pairs' : step.kind === 'sort' ? 'Sort into groups' : 'Spot it'}
          </div>
          <h2 className="step-q">
            <Inline text={step.q} />
          </h2>
          {step.kind === 'mcq' && <Mcq step={step} {...props} />}
          {step.kind === 'multi' && <Multi step={step} {...props} />}
          {step.kind === 'order' && <Order step={step} {...props} />}
          {step.kind === 'match' && <Match step={step} {...props} />}
          {step.kind === 'sort' && <Sort step={step} {...props} />}
          {step.kind === 'spot' && <Spot step={step} {...props} />}
        </>
      )
    }
  }
}

export function LessonPlayer({ unit, lesson }: { unit: Unit; lesson: Lesson }) {
  const navigate = useNavigate()
  const profile = useProfile()
  const key = lessonKey(unit.id, lesson.id)
  const [index, setIndex] = useState(0)
  const [status, setStatus] = useState<Status>('idle')
  const [ready, setReady] = useState(false)
  const correctRef = useRef(false)
  const [attempts, setAttempts] = useState(0)
  const [firstTry, setFirstTry] = useState<Record<number, boolean>>({})
  const [done, setDone] = useState<null | (CompletionResult & { score: number })>(null)
  const [showHint, setShowHint] = useState(false)
  const [runId, setRunId] = useState(0)

  const step = lesson.steps[index]
  const question = isQuestion(step)
  const questionCount = useMemo(() => lesson.steps.filter(isQuestion).length, [lesson])

  useEffect(() => {
    markStarted(key)
  }, [key])

  const onChange = useCallback((r: boolean, c: boolean) => {
    setReady(r)
    correctRef.current = c
  }, [])

  const finish = useCallback(
    (ft: Record<number, boolean>) => {
      const right = Object.values(ft).filter(Boolean).length
      const score = questionCount ? right / questionCount : 1
      const result = completeLesson(key, score, lesson.kind, right * 5)
      sfx.complete()
      celebrate(score >= 1 || lesson.kind === 'quiz')
      setDone({ ...result, score })
    },
    [key, lesson.kind, questionCount],
  )

  const advance = useCallback(() => {
    if (index + 1 >= lesson.steps.length) {
      finish(firstTry)
      return
    }
    setIndex(index + 1)
    setStatus('idle')
    setReady(false)
    setAttempts(0)
    setShowHint(false)
    correctRef.current = false
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [index, lesson.steps.length, finish, firstTry])

  const check = useCallback(() => {
    if (!ready) return
    const ok = correctRef.current
    if (ok) {
      sfx.correct()
      setStatus('correct')
      if (attempts === 0) setFirstTry((f) => ({ ...f, [index]: true }))
    } else {
      sfx.wrong()
      setStatus('wrong')
      if (attempts === 0) setFirstTry((f) => ({ ...f, [index]: false }))
    }
    setAttempts((a) => a + 1)
  }, [ready, attempts, index])

  const retry = () => {
    setStatus('idle')
    setShowHint(false)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Enter' || done) return
      if (e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement) return
      if (e.target instanceof HTMLButtonElement && !e.target.dataset.primary) return
      e.preventDefault()
      if (!question || status === 'correct') advance()
      else if (status === 'idle') check()
      else retry()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [question, status, advance, check, done])

  const restart = () => {
    setIndex(0)
    setStatus('idle')
    setReady(false)
    setAttempts(0)
    setFirstTry({})
    setDone(null)
    setRunId((r) => r + 1)
  }

  const progress = done ? 1 : (index + (status === 'correct' || !question ? 0.5 : 0)) / lesson.steps.length
  const nxt = nextLesson(unit.id, lesson.id)

  if (done) {
    const rec = profile?.lessons[key]
    const level = masteryOf(rec)
    const pct = Math.round(done.score * 100)
    return (
      <div className="player">
        <div className="container" style={{ maxWidth: 760 }}>
          <div className="player-top">
            <Link to={`/unit/${unit.id}`} className="player-close" aria-label="Close">
              ✕
            </Link>
            <div className="player-progress">
              <div style={{ width: '100%' }} />
            </div>
          </div>
        </div>
        <div className="player-body">
          <motion.div className="card complete" initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }}>
            <motion.div className="big" initial={{ rotate: -20, scale: 0 }} animate={{ rotate: 0, scale: 1 }} transition={{ delay: 0.15, type: 'spring', stiffness: 300, damping: 12 }}>
              {pct === 100 ? '🏆' : pct >= 70 ? '🎉' : '💪'}
            </motion.div>
            <h2>{pct === 100 ? 'Perfect!' : pct >= 70 ? 'Lesson complete!' : 'Nice effort!'}</h2>
            <p className="muted" style={{ margin: 0 }}>
              {lesson.title}
            </p>
            <div className="complete-stats">
              <div className="complete-stat" style={{ borderColor: 'var(--gold)' }}>
                <div className="k">XP earned</div>
                <div className="v" style={{ color: 'var(--warn)' }}>
                  +{done.xpGained}
                </div>
              </div>
              <div className="complete-stat" style={{ borderColor: 'var(--good)' }}>
                <div className="k">{questionCount ? 'First-try score' : 'Completed'}</div>
                <div className="v" style={{ color: 'var(--good)' }}>
                  {questionCount ? `${pct}%` : '✓'}
                </div>
              </div>
              <div className="complete-stat" style={{ borderColor: 'var(--m-proficient)' }}>
                <div className="k">Mastery</div>
                <div className="v" style={{ fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: 39 }}>
                  <MasteryIcon level={level} /> {MASTERY_LABEL[level]}
                </div>
              </div>
            </div>
            {done.newBadges.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <div className="eyebrow" style={{ marginBottom: 10 }}>
                  New badge{done.newBadges.length > 1 ? 's' : ''} unlocked
                </div>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                  {done.newBadges.map((b, i) => (
                    <motion.div
                      key={b}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 + i * 0.15 }}
                      className="chip"
                      style={{ padding: '8px 14px', fontSize: 15, background: `hsl(${BADGES[b].hue} 80% 92%)`, color: `hsl(${BADGES[b].hue} 60% 28%)`, borderColor: 'transparent' }}
                    >
                      <span style={{ fontSize: 20 }}>{BADGES[b].icon}</span> {BADGES[b].title}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
            {pct < 100 && questionCount > 0 && (
              <p className="muted" style={{ fontSize: 14 }}>
                Retry for a perfect first-try score to reach <strong>Mastered</strong>.
              </p>
            )}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginTop: 8 }}>
              <button className="btn btn-ghost" onClick={restart}>
                ↻ Retry
              </button>
              <button className="btn btn-ghost" onClick={() => navigate(`/unit/${unit.id}`)}>
                Back to unit
              </button>
              {nxt && (
                <button className="btn btn-primary" onClick={() => navigate(`/learn/${nxt.unit.id}/${nxt.lesson.id}`)}>
                  Next: {nxt.lesson.title} →
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  const hint = question ? (step as { hint?: string }).hint : undefined
  const explain = question ? (step as { explain: string }).explain : ''

  return (
    <div className="player">
      <div className="player-top-bar">
        <div className="container" style={{ maxWidth: 760 }}>
          <div className="player-top">
            <Link to={`/unit/${unit.id}`} className="player-close" aria-label="Close lesson">
              ✕
            </Link>
            <div className="player-progress" role="progressbar" aria-valuenow={Math.round(progress * 100)} aria-valuemin={0} aria-valuemax={100}>
              <div style={{ width: `${Math.max(3, progress * 100)}%` }} />
            </div>
            <span className="chip" title="Step">
              {index + 1}/{lesson.steps.length}
            </span>
          </div>
        </div>
      </div>
      <div className="player-body">
        <div key={`${runId}-${index}`} data-step={index} className="card step-card step-enter">
            <motion.div animate={status === 'wrong' ? { x: [0, -10, 10, -6, 6, 0] } : { x: 0 }} transition={{ duration: 0.4 }}>
              <StepView step={step} checked={status !== 'idle'} onChange={onChange} />
            </motion.div>
            {question && hint && status === 'idle' && (
              <>
                {!showHint ? (
                  <button className="hint-btn" onClick={() => setShowHint(true)}>
                    💡 Need a hint?
                  </button>
                ) : (
                  <div className="callout tip">
                    <span className="ico">💡</span>
                    <div>{hint}</div>
                  </div>
                )}
              </>
            )}
        </div>
      </div>

      <div className={`player-foot ${status === 'correct' ? 'correct' : status === 'wrong' ? 'wrong' : ''}`}>
        <div className="player-foot-inner">
          <div className="feedback" aria-live="polite">
            {status === 'correct' && (
              <motion.div initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                <h4>✓ {attempts > 1 ? 'Got it!' : ['Correct!', 'Nice!', 'Exactly!', 'Spot on!'][index % 4]}</h4>
                <Markdown text={explain} />
              </motion.div>
            )}
            {status === 'wrong' && (
              <motion.div initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                <h4>✗ Not quite</h4>
                {attempts >= 2 ? <Markdown text={explain} /> : <Markdown text={hint ?? 'Take another look and try again. You can do this.'} />}
              </motion.div>
            )}
            {status === 'idle' && !question && <span className="muted idle-hint" style={{ fontWeight: 600, fontSize: 14 }}>Press Enter or Continue when you are ready.</span>}
            {status === 'idle' && question && !ready && <span className="muted idle-hint" style={{ fontWeight: 600, fontSize: 14 }}>Answer to continue.</span>}
          </div>
          {!question && (
            <button className="btn btn-primary btn-lg" data-primary="1" onClick={advance}>
              {index + 1 >= lesson.steps.length ? 'Finish' : 'Continue'}
            </button>
          )}
          {question && status === 'idle' && (
            <button className="btn btn-primary btn-lg" data-primary="1" onClick={check} disabled={!ready}>
              Check
            </button>
          )}
          {question && status === 'correct' && (
            <button className="btn btn-good btn-lg" data-primary="1" onClick={advance} autoFocus>
              {index + 1 >= lesson.steps.length ? 'Finish' : 'Continue'}
            </button>
          )}
          {question && status === 'wrong' && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {attempts >= 2 && (
                <button className="btn btn-ghost btn-lg" onClick={advance}>
                  Skip
                </button>
              )}
              <button className="btn btn-bad btn-lg" data-primary="1" onClick={retry} autoFocus>
                Try again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
