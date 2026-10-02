import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { course, findLesson, lessonKey } from '../content/course'
import type { Profile } from '../lib/store'
import { courseMastery, levelOf, masteryOf, streakOf, today, unitMastery } from '../lib/store'
import { BADGES, type BadgeId } from '../lib/badges'
import { Avatar, KIND_META, MasteryIcon, MasteryLegend, Ring } from '../components/ui'

function nextUp(p: Profile) {
  // Resume the lesson the learner left mid-way before suggesting a new one.
  const [lu, ll] = p.lastLesson?.split('/') ?? []
  const last = p.lastLesson && p.progress?.[p.lastLesson] ? findLesson(lu, ll) : null
  if (last) return { unit: last.unit, lesson: last.lesson }
  for (const u of course) for (const l of u.lessons) if (!p.lessons[lessonKey(u.id, l.id)]) return { unit: u, lesson: l }
  for (const u of course) for (const l of u.lessons) if (masteryOf(p.lessons[lessonKey(u.id, l.id)]) !== 'mastered') return { unit: u, lesson: l }
  return null
}

export function Dashboard({ profile }: { profile: Profile }) {
  const lvl = levelOf(profile.xp)
  const streak = streakOf(profile)
  const todayXp = profile.activity[today()] ?? 0
  const mastery = courseMastery(profile)
  const up = nextUp(profile)
  const done = Object.keys(profile.lessons).length
  const total = course.reduce((a, u) => a + u.lessons.length, 0)
  const earned = (Object.keys(BADGES) as BadgeId[]).filter((b) => profile.badges[b])
  const hour = new Date().getHours()
  const greet = hour < 5 ? 'Burning the midnight oil' : hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
  const started = up && profile.started[lessonKey(up.unit.id, up.lesson.id)]
  const saved = up && profile.progress?.[lessonKey(up.unit.id, up.lesson.id)]

  return (
    <main className="page">
      <div className="container">
        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card dash-hero" style={{ padding: 24, display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap', background: `linear-gradient(120deg, color-mix(in srgb, hsl(${profile.hue} 80% 80%) 30%, var(--surface)), var(--surface) 60%)` }}>
          <Avatar emoji={profile.avatar} hue={profile.hue} size={72} />
          <div style={{ flex: 1, minWidth: 220 }}>
            <div className="eyebrow">
              Level {lvl.level} · {lvl.title}
            </div>
            <h1 style={{ fontSize: 'clamp(24px,3.5vw,32px)', fontWeight: 800, margin: '4px 0 10px', color: 'var(--ink)' }}>
              {greet}, {profile.name}!
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="bar" style={{ flex: 1, maxWidth: 360, height: 12 }}>
                <div style={{ width: `${(lvl.into / lvl.span) * 100}%`, background: 'linear-gradient(90deg,var(--gold),#f59e0b)' }} />
              </div>
              <span className="muted" style={{ fontSize: 13, fontWeight: 700 }}>
                {lvl.span - lvl.into} XP to level {lvl.level + 1}
              </span>
            </div>
          </div>
          {up && (
            <Link to={`/learn/${up.unit.id}/${up.lesson.id}`} className="btn btn-primary btn-lg">
              {done === 0 && !saved ? 'Start the course' : started ? 'Continue' : 'Next lesson'} →
            </Link>
          )}
        </motion.section>

        <div className="grid-2" style={{ marginTop: 24 }}>
          <div>
            {up && (
              <Link to={`/learn/${up.unit.id}/${up.lesson.id}`} className="card up-next" style={{ borderColor: `hsl(${up.unit.hue} 60% 70%)` }}>
                <div className="lesson-kind" style={{ background: `hsl(${up.unit.hue} 80% 92%)` }}>
                  {up.unit.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="eyebrow">
                    {saved ? 'Keep going' : 'Up next'} · Unit {up.unit.index}
                  </div>
                  <h3>{up.lesson.title}</h3>
                  <div className="tag">
                    {KIND_META[up.lesson.kind].label} · {up.lesson.minutes} min · {up.lesson.summary}
                  </div>
                  {saved && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10 }}>
                      <div className="bar" style={{ flex: 1, maxWidth: 240, height: 8 }}>
                        <div style={{ width: `${(saved.index / up.lesson.steps.length) * 100}%`, background: 'linear-gradient(90deg,var(--gold),#f59e0b)' }} />
                      </div>
                      <span className="muted" style={{ fontSize: 12.5, fontWeight: 700 }}>
                        Step {saved.index + 1} of {up.lesson.steps.length}
                      </span>
                    </div>
                  )}
                </div>
                <span className="up-next-arrow" aria-hidden>
                  →
                </span>
              </Link>
            )}

            <div className="section-title">
              <h2>Your course map</h2>
              <span className="muted" style={{ fontSize: 14, fontWeight: 700 }}>
                {done}/{total} lessons
              </span>
            </div>
            <div>
              {course.map((u, i) => {
                const m = unitMastery(profile, u.id)
                const complete = u.lessons.every((l) => profile.lessons[lessonKey(u.id, l.id)])
                return (
                  <motion.div key={u.id} className="unit-row" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
                    <div className="unit-node">
                      <div className="unit-badge" style={{ background: `linear-gradient(145deg, hsl(${u.hue} 80% 86%), hsl(${u.hue} 65% 70%))` }}>
                        {u.icon}
                        {complete && (
                          <span style={{ position: 'absolute', right: -6, bottom: -6, width: 26, height: 26, borderRadius: 99, background: 'var(--good)', color: 'white', display: 'grid', placeItems: 'center', fontSize: 13, border: '3px solid var(--bg)' }}>✓</span>
                        )}
                      </div>
                    </div>
                    <Link to={`/unit/${u.id}`} className="card unit-card">
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="eyebrow">Unit {u.index}</div>
                        <h3>{u.title}</h3>
                        <div className="tag">{u.tagline}</div>
                        <div className="unit-lessons">
                          {u.lessons.map((l) => (
                            <MasteryIcon key={l.id} level={masteryOf(profile.lessons[lessonKey(u.id, l.id)])} title={l.title} />
                          ))}
                        </div>
                      </div>
                      <Ring value={m / 100} size={58} stroke={7}>
                        <span style={{ fontSize: 13 }}>{m}%</span>
                      </Ring>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
            <div style={{ marginTop: 18 }}>
              <MasteryLegend />
            </div>
          </div>

          <aside style={{ display: 'grid', gap: 16, position: 'sticky', top: 84 }}>
            <div className="card" style={{ padding: 20 }}>
              <div className="eyebrow" style={{ marginBottom: 12 }}>
                Today
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                <Ring value={todayXp / profile.dailyGoal} size={92} stroke={10} color="var(--gold)">
                  <span style={{ fontSize: 22 }}>{todayXp >= profile.dailyGoal ? '⭐' : '⚡'}</span>
                </Ring>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 20 }}>
                    {todayXp}/{profile.dailyGoal} XP
                  </div>
                  <div className="muted" style={{ fontSize: 14, fontWeight: 600 }}>
                    {todayXp >= profile.dailyGoal ? 'Daily goal reached!' : 'Daily goal'}
                  </div>
                  <div style={{ marginTop: 8, fontWeight: 800, color: streak ? 'var(--warn)' : 'var(--muted)' }}>
                    {streak ? `🔥 ${streak}-day streak` : '🩶 Start a streak today'}
                  </div>
                </div>
              </div>
            </div>
            <div className="card" style={{ padding: 20 }}>
              <div className="eyebrow" style={{ marginBottom: 12 }}>
                Course mastery
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                <Ring value={mastery / 100} size={92} stroke={10}>
                  <span style={{ fontSize: 20 }}>{mastery}%</span>
                </Ring>
                <div style={{ fontSize: 14, color: 'var(--ink-2)', fontWeight: 600 }}>
                  Lessons climb from <em>Attempted</em> to <em>Mastered</em> with your best first-try score. Retry any lesson to level it up.
                </div>
              </div>
            </div>
            <div className="card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
                <span className="eyebrow">Badges</span>
                <Link to="/profile" style={{ fontSize: 13, fontWeight: 700, color: 'var(--sky-ink)' }}>
                  {earned.length}/{Object.keys(BADGES).length} · see all
                </Link>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {(Object.keys(BADGES) as BadgeId[]).slice(0, 8).map((b) => (
                  <span
                    key={b}
                    title={`${BADGES[b].title}: ${BADGES[b].desc}`}
                    style={{ width: 42, height: 42, borderRadius: 99, display: 'grid', placeItems: 'center', fontSize: 20, background: profile.badges[b] ? `hsl(${BADGES[b].hue} 85% 88%)` : 'var(--bg-2)', filter: profile.badges[b] ? 'none' : 'grayscale(1)', opacity: profile.badges[b] ? 1 : 0.4 }}
                  >
                    {BADGES[b].icon}
                  </span>
                ))}
              </div>
            </div>
            <Link to="/toolbox" className="card" style={{ padding: 18, textDecoration: 'none', display: 'flex', gap: 12, alignItems: 'center', background: 'var(--sky)' }}>
              <span style={{ fontSize: 28 }}>🧰</span>
              <span>
                <strong style={{ color: 'var(--sky-ink)' }}>Toolbox</strong>
                <span style={{ display: 'block', fontSize: 13.5, color: 'var(--sky-ink)', fontWeight: 600 }}>Prompt workbench, principle deck, all 23 playbooks.</span>
              </span>
            </Link>
          </aside>
        </div>
      </div>
    </main>
  )
}
