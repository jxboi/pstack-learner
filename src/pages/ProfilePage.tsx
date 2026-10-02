import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { course, lessonKey } from '../content/course'
import type { Profile, Theme } from '../lib/store'
import { courseMastery, editProfile, exportProfile, levelOf, masteryOf, resetProgress, streakOf, today, unitMastery, switchProfile, deleteProfile } from '../lib/store'
import { BADGES, type BadgeId } from '../lib/badges'
import { AVATARS, Avatar, HUES, MasteryIcon } from '../components/ui'

function Heatmap({ profile }: { profile: Profile }) {
  const weeks = 18
  const end = new Date()
  const start = new Date(end)
  start.setDate(end.getDate() - (weeks * 7 - 1) - end.getDay())
  const days: { d: string; xp: number }[] = []
  for (let t = new Date(start); t <= end; t.setDate(t.getDate() + 1)) {
    const k = today(t)
    days.push({ d: k, xp: profile.activity[k] ?? 0 })
  }
  const max = Math.max(profile.dailyGoal, ...days.map((d) => d.xp))
  const active = days.filter((d) => d.xp > 0).length
  return (
    <div>
      <div className="heatmap" role="img" aria-label={`Activity: ${active} active days in the last ${weeks} weeks`}>
        {days.map((d) => (
          <div
            key={d.d}
            title={`${d.d}: ${d.xp} XP`}
            style={d.xp ? { background: `color-mix(in srgb, var(--m-mastered) ${25 + Math.round((d.xp / max) * 75)}%, var(--bg-2))` } : undefined}
          />
        ))}
      </div>
      <div className="muted" style={{ fontSize: 13, fontWeight: 600, marginTop: 6 }}>
        {active} active day{active === 1 ? '' : 's'} in the last {weeks} weeks
      </div>
    </div>
  )
}

const fmtDate = (iso: string) => new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })

// How far along a locked badge is, for the ones with a count to show.
function badgeProgress(b: BadgeId, p: Profile): [number, number] | null {
  const done = Object.keys(p.lessons).length
  const total = course.reduce((a, u) => a + u.lessons.length, 0)
  const bestUnit = Math.max(...course.map((u) => u.lessons.filter((l) => p.lessons[lessonKey(u.id, l.id)]).length / u.lessons.length))
  const principles = course.find((u) => u.id === 'principles')
  switch (b) {
    case 'ten-lessons':
      return [done, 10]
    case 'streak-3':
      return [streakOf(p), 3]
    case 'streak-7':
      return [streakOf(p), 7]
    case 'xp-500':
      return [p.xp, 500]
    case 'xp-1500':
      return [p.xp, 1500]
    case 'graduate':
      return [done, total]
    case 'unit-complete':
      return [Math.round(bestUnit * 100), 100]
    case 'principled':
      return principles ? [principles.lessons.filter((l) => masteryOf(p.lessons[lessonKey(principles.id, l.id)]) === 'mastered').length, principles.lessons.length] : null
    default:
      return null
  }
}

export function ProfilePage({ profile }: { profile: Profile }) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(profile.name)
  const lvl = levelOf(profile.xp)
  const done = Object.keys(profile.lessons).length
  const mastered = Object.values(profile.lessons).filter((r) => masteryOf(r) === 'mastered').length
  const quizzes = course.flatMap((u) => u.lessons.filter((l) => l.kind === 'quiz').map((l) => profile.lessons[lessonKey(u.id, l.id)])).filter(Boolean)
  const avgQuiz = quizzes.length ? Math.round((quizzes.reduce((a, r) => a + r!.best, 0) / quizzes.length) * 100) : 0
  const joined = fmtDate(profile.createdAt)

  const download = () => {
    const blob = new Blob([exportProfile()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `pstack-academy-${profile.name.toLowerCase().replace(/\W+/g, '-')}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <main className="page">
      <div className="container">
        <section className="card" style={{ padding: 24, display: 'flex', gap: 22, alignItems: 'center', flexWrap: 'wrap', background: `linear-gradient(120deg, color-mix(in srgb, hsl(${profile.hue} 80% 80%) 30%, var(--surface)), var(--surface) 70%)` }}>
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
            <Avatar emoji={profile.avatar} hue={profile.hue} size={96} />
          </motion.div>
          <div style={{ flex: 1, minWidth: 220 }}>
            <h1 style={{ fontSize: 30, fontWeight: 800, color: 'var(--ink)' }}>{profile.name}</h1>
            <div className="muted" style={{ fontWeight: 700 }}>
              Level {lvl.level} · {lvl.title} · joined {joined}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10 }}>
              <div className="bar" style={{ flex: 1, maxWidth: 320 }}>
                <div style={{ width: `${(lvl.into / lvl.span) * 100}%`, background: 'linear-gradient(90deg,var(--gold),#f59e0b)' }} />
              </div>
              <span className="muted" style={{ fontSize: 13, fontWeight: 700 }}>
                {lvl.into}/{lvl.span} XP
              </span>
            </div>
          </div>
          <button className="btn btn-ghost" onClick={() => setEditing(!editing)}>
            ✏️ {editing ? 'Done' : 'Edit profile'}
          </button>
        </section>

        {editing && (
          <motion.section initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ padding: 22, marginTop: 16, display: 'grid', gap: 16 }}>
            <label style={{ display: 'grid', gap: 6, maxWidth: 360 }}>
              <span style={{ fontWeight: 700 }}>Name</span>
              <input className="input" value={name} maxLength={30} onChange={(e) => setName(e.target.value)} onBlur={() => name.trim() && editProfile({ name: name.trim() })} />
            </label>
            <div>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>Avatar</div>
              <div className="avatar-pick">
                {AVATARS.map((a) => (
                  <button key={a} className={a === profile.avatar ? 'on' : ''} onClick={() => editProfile({ avatar: a })} aria-label={`Avatar ${a}`}>
                    <Avatar emoji={a} hue={profile.hue} size={44} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>Color</div>
              <div className="hue-pick">
                {HUES.map((h) => (
                  <button key={h} className={h === profile.hue ? 'on' : ''} onClick={() => editProfile({ hue: h })} aria-label={`Color ${h}`} style={{ background: `hsl(${h} 70% 66%)` }} />
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontWeight: 700, marginBottom: 8 }}>Daily goal</div>
                <div className="pill-tabs">
                  {[30, 60, 120].map((g) => (
                    <button key={g} className={profile.dailyGoal === g ? 'on' : ''} onClick={() => editProfile({ dailyGoal: g })}>
                      {g} XP
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontWeight: 700, marginBottom: 8 }}>Theme</div>
                <div className="pill-tabs">
                  {(['system', 'light', 'dark'] as Theme[]).map((t) => (
                    <button key={t} className={profile.settings.theme === t ? 'on' : ''} onClick={() => editProfile({ settings: { ...profile.settings, theme: t } })}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontWeight: 700, marginBottom: 8 }}>Sound effects</div>
                <div className="pill-tabs">
                  {[true, false].map((s) => (
                    <button key={String(s)} className={profile.settings.sound === s ? 'on' : ''} onClick={() => editProfile({ settings: { ...profile.settings, sound: s } })}>
                      {s ? 'on' : 'off'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>
        )}

        <div className="stat-grid" style={{ marginTop: 20 }}>
          {[
            ['⚡', profile.xp.toLocaleString(), 'Total XP'],
            ['🔥', streakOf(profile), 'Day streak'],
            ['📚', `${done}`, 'Lessons done'],
            ['⭐', `${mastered}`, 'Lessons mastered'],
            ['🎯', `${courseMastery(profile)}%`, 'Course mastery'],
            ['🏆', quizzes.length ? `${avgQuiz}%` : '–', 'Avg quiz score'],
          ].map(([i, v, k]) => (
            <div key={String(k)} className="card stat-tile">
              <div style={{ fontSize: 20 }}>{i}</div>
              <div className="v">{v}</div>
              <div className="k">{k}</div>
            </div>
          ))}
        </div>

        <div className="grid-2" style={{ marginTop: 24 }}>
          <div style={{ display: 'grid', gap: 20 }}>
            <section className="card" style={{ padding: 22 }}>
              <h2 style={{ fontSize: 19, marginBottom: 14 }}>Unit progress</h2>
              <div style={{ display: 'grid', gap: 14 }}>
                {course.map((u) => {
                  const m = unitMastery(profile, u.id)
                  return (
                    <Link key={u.id} to={`/unit/${u.id}`} style={{ textDecoration: 'none', display: 'grid', gap: 6 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, fontWeight: 700, fontSize: 14.5 }}>
                        <span>
                          {u.icon} {u.title}
                        </span>
                        <span style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                          {u.lessons.map((l) => (
                            <MasteryIcon key={l.id} level={masteryOf(profile.lessons[lessonKey(u.id, l.id)])} title={l.title} />
                          ))}
                        </span>
                      </div>
                      <div className="bar">
                        <div style={{ width: `${m}%`, background: `linear-gradient(90deg, hsl(${u.hue} 70% 65%), hsl(${u.hue} 60% 45%))` }} />
                      </div>
                    </Link>
                  )
                })}
              </div>
            </section>
            <section className="card" style={{ padding: 22 }}>
              <h2 style={{ fontSize: 19, marginBottom: 14 }}>Badges</h2>
              <div className="badge-grid">
                {(Object.keys(BADGES) as BadgeId[]).map((b) => {
                  const got = profile.badges[b]
                  const prog = got ? null : badgeProgress(b, profile)
                  return (
                    <div key={b} className={`card badge ${got ? '' : 'locked'}`}>
                      <div className="medal" style={{ background: `radial-gradient(circle at 30% 30%, hsl(${BADGES[b].hue} 90% 92%), hsl(${BADGES[b].hue} 70% 72%))` }}>
                        {BADGES[b].icon}
                      </div>
                      <h4>{BADGES[b].title}</h4>
                      <p>{BADGES[b].desc}</p>
                      {got && <p style={{ color: 'var(--good)', fontWeight: 700 }}>Earned {fmtDate(got)}</p>}
                      {prog && prog[0] > 0 && (
                        <div style={{ marginTop: 8 }}>
                          <div className="bar" style={{ height: 6 }}>
                            <div style={{ width: `${Math.min(100, (prog[0] / prog[1]) * 100)}%`, background: `hsl(${BADGES[b].hue} 65% 55%)` }} />
                          </div>
                          <p style={{ fontWeight: 700 }}>
                            {b === 'unit-complete' ? `${prog[0]}% of a unit` : `${Math.min(prog[0], prog[1]).toLocaleString()} / ${prog[1].toLocaleString()}`}
                          </p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </section>
          </div>
          <aside style={{ display: 'grid', gap: 16 }}>
            <section className="card" style={{ padding: 20 }}>
              <div className="eyebrow" style={{ marginBottom: 12 }}>
                Activity
              </div>
              <Heatmap profile={profile} />
            </section>
            <section className="card" style={{ padding: 20, display: 'grid', gap: 10 }}>
              <div className="eyebrow">Your data</div>
              <p className="muted" style={{ margin: 0, fontSize: 14 }}>
                Progress lives in this browser. Export it to back it up or move to another device.
              </p>
              <button className="btn btn-ghost btn-sm" onClick={download}>
                ⬇️ Export progress (.json)
              </button>
              <button className="btn btn-ghost btn-sm" onClick={() => switchProfile(null)}>
                🔁 Switch learner
              </button>
              <button className="btn btn-ghost btn-sm" style={{ color: 'var(--bad)' }} onClick={() => window.confirm('Reset all progress, XP and badges for this learner?') && resetProgress()}>
                ↺ Reset progress
              </button>
              <button className="btn btn-ghost btn-sm" style={{ color: 'var(--bad)' }} onClick={() => window.confirm(`Delete ${profile.name} permanently?`) && deleteProfile(profile.id)}>
                🗑 Delete learner
              </button>
            </section>
          </aside>
        </div>
      </div>
    </main>
  )
}
