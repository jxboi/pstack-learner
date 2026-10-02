import { Link, Navigate, useParams } from 'react-router-dom'
import { motion } from 'motion/react'
import { course, lessonKey } from '../content/course'
import { masteryOf, unitMastery, useProfile } from '../lib/store'
import { KIND_META, MasteryIcon, MasteryLegend, Ring } from '../components/ui'
import { GLOSSARY } from '../content/glossary'

export function UnitPage() {
  const { unitId } = useParams()
  const profile = useProfile()
  const unit = course.find((u) => u.id === unitId)
  if (!unit || !profile) return <Navigate to="/" replace />
  const m = unitMastery(profile, unit.id)
  const prev = course[unit.index - 2]
  const next = course[unit.index]
  const terms = GLOSSARY.filter((t) => t.unit === unit.id)
  const firstOpen = unit.lessons.find((l) => !profile.lessons[lessonKey(unit.id, l.id)]) ?? unit.lessons[0]

  return (
    <main className="page">
      <div className="container">
        <Link to="/" style={{ fontWeight: 700, color: 'var(--muted)', textDecoration: 'none', fontSize: 14 }}>
          ← Course map
        </Link>
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="unit-hero"
          style={{ marginTop: 12, background: `linear-gradient(120deg, hsl(${unit.hue} 55% 38%), hsl(${unit.hue} 60% 52%))` }}
        >
          {unit.image && <div className="hero-img" style={{ backgroundImage: `url(${unit.image})` }} />}
          <div style={{ position: 'relative', maxWidth: 600 }}>
            <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.85 }}>
              Unit {unit.index} of {course.length}
            </div>
            <h1 style={{ margin: '6px 0 8px' }}>
              {unit.icon} {unit.title}
            </h1>
            <p style={{ margin: 0, fontSize: 17, opacity: 0.95 }}>{unit.tagline}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 20, flexWrap: 'wrap' }}>
              <Link to={`/learn/${unit.id}/${firstOpen.id}`} className="btn btn-lg" style={{ background: 'white', color: `hsl(${unit.hue} 55% 30%)` }}>
                {m === 0 ? 'Start unit' : m === 100 ? 'Review' : 'Continue'} →
              </Link>
              <span style={{ fontWeight: 800 }}>{m}% mastered</span>
            </div>
          </div>
        </motion.section>

        <div className="grid-2" style={{ marginTop: 24 }}>
          <div>
            <div className="card" style={{ padding: 8 }}>
              {unit.lessons.map((l, i) => {
                const rec = profile.lessons[lessonKey(unit.id, l.id)]
                const saved = profile.progress?.[lessonKey(unit.id, l.id)]
                const level = masteryOf(rec)
                const meta = KIND_META[l.kind]
                return (
                  <motion.div key={l.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <Link to={`/learn/${unit.id}/${l.id}`} className="lesson-item">
                      <div className="lesson-kind" style={{ background: `hsl(${meta.hue} 80% 92%)` }}>
                        {meta.icon}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="eyebrow" style={{ fontSize: 11 }}>
                          {meta.label} · {l.minutes} min
                        </div>
                        <h4>{l.title}</h4>
                        <p>{l.summary}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 'none' }}>
                        {saved ? (
                          <span className="chip" style={{ fontSize: 12, fontWeight: 700 }}>
                            Step {saved.index + 1}/{l.steps.length}
                          </span>
                        ) : (
                          rec && <span className="muted" style={{ fontSize: 12.5, fontWeight: 700 }}>{Math.round(rec.best * 100)}%</span>
                        )}
                        <MasteryIcon level={level} />
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
            <div style={{ marginTop: 14 }}>
              <MasteryLegend />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, marginTop: 24, flexWrap: 'wrap' }}>
              {prev ? (
                <Link to={`/unit/${prev.id}`} className="btn btn-ghost">
                  ← {prev.icon} {prev.title}
                </Link>
              ) : (
                <span />
              )}
              {next && (
                <Link to={`/unit/${next.id}`} className="btn btn-ghost">
                  {next.icon} {next.title} →
                </Link>
              )}
            </div>
          </div>
          <aside style={{ display: 'grid', gap: 16 }}>
            <div className="card" style={{ padding: 20, display: 'flex', gap: 16, alignItems: 'center' }}>
              <Ring value={m / 100} size={86} stroke={9} color={`hsl(${unit.hue} 60% 50%)`}>
                <span>{m}%</span>
              </Ring>
              <div>
                <div style={{ fontWeight: 800 }}>Unit mastery</div>
                <div className="muted" style={{ fontSize: 14, fontWeight: 600 }}>
                  {unit.lessons.filter((l) => profile.lessons[lessonKey(unit.id, l.id)]).length}/{unit.lessons.length} lessons done
                </div>
              </div>
            </div>
            <div className="card" style={{ padding: 20 }}>
              <div className="eyebrow" style={{ marginBottom: 10 }}>
                By the end you can
              </div>
              <ul style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 6, fontSize: 15 }}>
                {unit.goals.map((g) => (
                  <li key={g}>{g}</li>
                ))}
              </ul>
            </div>
            {terms.length > 0 && (
              <div className="card" style={{ padding: 20 }}>
                <div className="eyebrow" style={{ marginBottom: 10 }}>
                  Key terms
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {terms.map((t) => (
                    <Link key={t.term} to={`/glossary?q=${encodeURIComponent(t.term)}`} className="chip mono" style={{ textDecoration: 'none' }} title={t.plain}>
                      {t.term}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </main>
  )
}
