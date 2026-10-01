import { useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { course, totalMinutes } from '../content/course'
import { createProfile, deleteProfile, levelOf, switchProfile, useStore, importProfile } from '../lib/store'
import { AVATARS, Avatar, HUES } from '../components/ui'

const GOALS = [
  { xp: 30, label: 'Casual', desc: '~5 min a day' },
  { xp: 60, label: 'Regular', desc: '~10 min a day' },
  { xp: 120, label: 'Serious', desc: '~20 min a day' },
]

const FEATURES = [
  { icon: '🧩', hue: 205, title: '21 interactive widgets', text: 'Route prompts, run an arena, release a swarm, land a PR stack, and watch an overnight run unfold.' },
  { icon: '🎯', hue: 30, title: 'Practice that sticks', text: 'Multiple choice, matching, ordering, sorting and spot-the-mistake, with instant feedback and hints.' },
  { icon: '📈', hue: 275, title: 'Mastery tracking', text: 'Every lesson climbs from Attempted to Mastered. Earn XP, keep a streak, collect badges.' },
  { icon: '🛠️', hue: 150, title: 'Use it on your code', text: 'A prompt workbench turns what you learned into prompts for your own project.' },
]

export function Welcome() {
  const profileMap = useStore((s) => s.profiles)
  const profiles = useMemo(() => Object.values(profileMap), [profileMap])
  const [creating, setCreating] = useState(profiles.length === 0)
  const [name, setName] = useState('')
  const [avatar, setAvatar] = useState(AVATARS[0])
  const [hue, setHue] = useState(HUES[0])
  const [goal, setGoal] = useState(60)
  const [importMsg, setImportMsg] = useState<string | null>(null)
  const lessons = course.reduce((a, u) => a + u.lessons.length, 0)

  const onImport = (file: File) => {
    file
      .text()
      .then((t) => setImportMsg(`Welcome back, ${importProfile(t)}!`))
      .catch((e: Error) => setImportMsg(e.message))
  }

  return (
    <main className="page">
      <div className="container">
        <section className="hero">
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) auto', gap: 24, alignItems: 'center' }}>
            <div>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="chip" style={{ background: 'var(--surface)', marginBottom: 16 }}>
                🍠 For complete beginners · {course.length} units · {lessons} lessons · ~{Math.round(totalMinutes() / 5) * 5} min
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
                Learn <span style={{ color: 'var(--brand)' }}>pstack</span> from zero, one small lesson at a time.
              </motion.h1>
              <motion.p className="lede" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                pstack is a set of skills that turns a Cursor AI agent into a careful engineering team. This academy explains it in plain words, with animations, games and quizzes, until you can use it on your own projects.
              </motion.p>
              {!creating && profiles.length > 0 && (
                <button className="btn btn-primary btn-lg" onClick={() => setCreating(true)}>
                  + New learner
                </button>
              )}
            </div>
            <motion.img
              src="/pstack-logo.png"
              alt="poteto eating a sweet potato"
              initial={{ rotate: -8, scale: 0.8, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 120, damping: 12, delay: 0.15 }}
              style={{ width: 'clamp(110px, 18vw, 200px)', borderRadius: 32, boxShadow: 'var(--shadow-3)', border: '6px solid var(--surface)' }}
            />
          </div>
        </section>

        <div className="grid-2" style={{ marginTop: 24 }}>
          <div>
            {profiles.length > 0 && (
              <section className="card" style={{ padding: 22, marginBottom: 20 }}>
                <h2 style={{ fontSize: 20, marginBottom: 14 }}>Who's learning?</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))', gap: 12 }}>
                  {profiles.map((p) => (
                    <div key={p.id} style={{ position: 'relative' }}>
                      <button className="card" onClick={() => switchProfile(p.id)} style={{ width: '100%', padding: 16, cursor: 'pointer', textAlign: 'center', background: 'var(--surface-2)' }}>
                        <Avatar emoji={p.avatar} hue={p.hue} size={64} />
                        <div style={{ fontWeight: 800, marginTop: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                        <div className="muted" style={{ fontSize: 12.5, fontWeight: 700 }}>
                          Lv {levelOf(p.xp).level} · {p.xp} XP
                        </div>
                      </button>
                      <button
                        className="icon-btn"
                        aria-label={`Delete ${p.name}`}
                        title="Delete learner"
                        style={{ position: 'absolute', top: 6, right: 6, width: 26, height: 26, fontSize: 11 }}
                        onClick={() => window.confirm(`Delete ${p.name} and all their progress?`) && deleteProfile(p.id)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {creating && (
              <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ padding: 24 }}>
                <h2 style={{ fontSize: 22 }}>Create your learner profile</h2>
                <p className="muted" style={{ margin: '4px 0 18px' }}>
                  Your progress, XP, streak and badges are saved in this browser. No account needed. You can export them any time.
                </p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    createProfile({ name, avatar, hue, dailyGoal: goal })
                  }}
                  style={{ display: 'grid', gap: 18 }}
                >
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    <motion.div key={avatar + hue} initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
                      <Avatar emoji={avatar} hue={hue} size={76} />
                    </motion.div>
                    <label style={{ flex: 1, display: 'grid', gap: 6 }}>
                      <span style={{ fontWeight: 700 }}>Your name</span>
                      <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Sam" maxLength={30} autoFocus required />
                    </label>
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, marginBottom: 8 }}>Pick an avatar</div>
                    <div className="avatar-pick">
                      {AVATARS.map((a) => (
                        <button type="button" key={a} className={a === avatar ? 'on' : ''} onClick={() => setAvatar(a)} aria-label={`Avatar ${a}`}>
                          <Avatar emoji={a} hue={hue} size={48} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, marginBottom: 8 }}>Color</div>
                    <div className="hue-pick">
                      {HUES.map((h) => (
                        <button type="button" key={h} className={h === hue ? 'on' : ''} onClick={() => setHue(h)} aria-label={`Color ${h}`} style={{ background: `hsl(${h} 70% 66%)` }} />
                      ))}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, marginBottom: 8 }}>Daily goal</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
                      {GOALS.map((g) => (
                        <button type="button" key={g.xp} className={`option ${goal === g.xp ? 'selected' : ''}`} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 2 }} onClick={() => setGoal(g.xp)}>
                          <span style={{ fontWeight: 800 }}>{g.label}</span>
                          <span className="muted" style={{ fontSize: 13 }}>
                            {g.xp} XP · {g.desc}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <button className="btn btn-primary btn-lg" type="submit" disabled={!name.trim()}>
                      Start learning →
                    </button>
                    {profiles.length > 0 && (
                      <button className="btn btn-ghost btn-lg" type="button" onClick={() => setCreating(false)}>
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </motion.section>
            )}
            <p className="muted" style={{ fontSize: 14, marginTop: 14 }}>
              Moving from another device?{' '}
              <label style={{ color: 'var(--sky-ink)', fontWeight: 700, cursor: 'pointer' }}>
                Import a saved profile
                <input type="file" accept="application/json,.json" className="sr-only" onChange={(e) => e.target.files?.[0] && onImport(e.target.files[0])} />
              </label>
              {importMsg && <strong style={{ marginLeft: 8 }}>{importMsg}</strong>}
            </p>
          </div>

          <aside className="card" style={{ padding: 20 }}>
            <div className="eyebrow" style={{ marginBottom: 10 }}>
              The path
            </div>
            <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 10 }}>
              {course.map((u) => (
                <li key={u.id} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span style={{ width: 34, height: 34, borderRadius: 10, display: 'grid', placeItems: 'center', background: `hsl(${u.hue} 70% 90%)`, flex: 'none' }}>{u.icon}</span>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>
                    <span className="muted">{u.index}.</span> {u.title}
                  </span>
                </li>
              ))}
            </ol>
          </aside>
        </div>

        <section style={{ marginTop: 36 }}>
          <div className="feature-grid">
            {FEATURES.map((f, i) => (
              <motion.div key={f.title} className="card feature" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <div className="ico" style={{ background: `hsl(${f.hue} 80% 92%)` }}>
                  {f.icon}
                </div>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
