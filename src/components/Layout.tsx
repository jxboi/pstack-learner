import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { editProfile, levelOf, streakOf, switchProfile, today, useProfile, type Theme } from '../lib/store'
import { Avatar } from './ui'

const NAV = [
  { to: '/', label: 'Learn', icon: '🏠', end: true },
  { to: '/toolbox', label: 'Toolbox', icon: '🧰' },
  { to: '/glossary', label: 'Glossary', icon: '📖' },
  { to: '/profile', label: 'Profile', icon: '👤' },
]

export function useApplyTheme(theme: Theme | undefined) {
  useEffect(() => {
    const el = document.documentElement
    if (!theme || theme === 'system') delete el.dataset.theme
    else el.dataset.theme = theme
  }, [theme])
}

export function Layout() {
  const profile = useProfile()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open])

  const lvl = profile ? levelOf(profile.xp) : null
  const streak = profile ? streakOf(profile) : 0
  const todayXp = profile?.activity[today()] ?? 0
  const theme = profile?.settings.theme ?? 'system'
  const nextTheme: Record<Theme, Theme> = { system: 'light', light: 'dark', dark: 'system' }

  return (
    <>
      <header className="topbar">
        <div className="container topbar-inner">
          <Link to="/" className="brand">
            <img src="/pstack-logo.png" alt="" />
            <span>
              pstack <small>Academy</small>
            </span>
          </Link>
          {profile && (
            <nav className="nav" aria-label="Main">
              {NAV.map((n) => (
                <NavLink key={n.to} to={n.to} end={n.end}>
                  {n.label}
                </NavLink>
              ))}
            </nav>
          )}
          {profile && lvl && (
            <div className="topbar-right">
              <span className="stat-chip" title={`${streak}-day streak`} style={{ color: streak ? 'var(--warn)' : 'var(--muted)' }}>
                {streak ? '🔥' : '🩶'} {streak}
              </span>
              <span className="stat-chip hide-sm" title={`Today: ${todayXp}/${profile.dailyGoal} XP`}>
                ⚡ {profile.xp.toLocaleString()} XP
              </span>
              <div style={{ position: 'relative' }} ref={menuRef}>
                <button className="avatar-btn" onClick={() => setOpen(!open)} aria-label="Account menu" aria-expanded={open}>
                  <Avatar emoji={profile.avatar} hue={profile.hue} size={40} />
                </button>
                <AnimatePresence>
                  {open && (
                    <motion.div className="menu" initial={{ opacity: 0, y: -6, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.15 }}>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '8px 10px 12px' }}>
                        <Avatar emoji={profile.avatar} hue={profile.hue} size={44} />
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontWeight: 800, overflow: 'hidden', textOverflow: 'ellipsis' }}>{profile.name}</div>
                          <div className="muted" style={{ fontSize: 13, fontWeight: 600 }}>
                            Level {lvl.level} · {lvl.title}
                          </div>
                        </div>
                      </div>
                      <Link className="menu-item" to="/profile" onClick={() => setOpen(false)}>
                        👤 Profile & progress
                      </Link>
                      <button className="menu-item" onClick={() => editProfile({ settings: { ...profile.settings, theme: nextTheme[theme] } })}>
                        {theme === 'dark' ? '🌙' : theme === 'light' ? '☀️' : '🖥️'} Theme: {theme}
                      </button>
                      <button className="menu-item" onClick={() => editProfile({ settings: { ...profile.settings, sound: !profile.settings.sound } })}>
                        {profile.settings.sound ? '🔊' : '🔈'} Sound: {profile.settings.sound ? 'on' : 'off'}
                      </button>
                      <button
                        className="menu-item"
                        onClick={() => {
                          setOpen(false)
                          switchProfile(null)
                          navigate('/')
                        }}
                      >
                        🔁 Switch learner
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      </header>
      <Outlet />
      {profile && (
        <nav className="mobile-nav" aria-label="Main mobile">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end}>
              <span>{n.icon}</span>
              {n.label}
            </NavLink>
          ))}
        </nav>
      )}
      <footer className="footer">
        <div className="container" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <span>
            An unofficial, interactive companion to{' '}
            <a href="https://github.com/cursor/plugins/tree/main/pstack" target="_blank" rel="noreferrer">
              pstack
            </a>{' '}
            by Lauren Tan (poteto). Content and illustrations adapted from the pstack guide, MIT licensed.
          </span>
          <span>Progress is saved in this browser.</span>
        </div>
      </footer>
    </>
  )
}
