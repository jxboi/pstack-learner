import { useSyncExternalStore } from 'react'
import { BADGES, type BadgeId } from './badges'
import { course, lessonKey, allLessonKeys } from '../content/course'

export type LessonRecord = {
  best: number
  attempts: number
  completedAt: string
  lastAt: string
}

export type Theme = 'system' | 'light' | 'dark'

export type LessonProgress = { index: number; firstTry: Record<number, boolean> }

export type Profile = {
  id: string
  name: string
  avatar: string
  hue: number
  createdAt: string
  dailyGoal: number
  xp: number
  lessons: Record<string, LessonRecord>
  started: Record<string, string>
  activity: Record<string, number>
  badges: Partial<Record<BadgeId, string>>
  lastLesson?: string
  progress?: Record<string, LessonProgress>
  settings: { theme: Theme; sound: boolean }
}

type State = {
  version: 1
  activeId: string | null
  profiles: Record<string, Profile>
}

const KEY = 'pstack-academy:v1'
const empty: State = { version: 1, activeId: null, profiles: {} }

function load(): State {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return empty
    const parsed = JSON.parse(raw) as State
    if (parsed?.version !== 1 || typeof parsed.profiles !== 'object') return empty
    return parsed
  } catch {
    return empty
  }
}

let state: State = load()
const listeners = new Set<() => void>()

function commit(next: State) {
  state = next
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    /* storage unavailable: progress lives for this tab only */
  }
  listeners.forEach((l) => l())
}

function subscribe(l: () => void) {
  listeners.add(l)
  return () => listeners.delete(l)
}

export function useStore<T>(select: (s: State) => T): T {
  return useSyncExternalStore(subscribe, () => select(state))
}

export function useProfile(): Profile | null {
  return useStore((s) => (s.activeId ? s.profiles[s.activeId] ?? null : null))
}

export const today = (d = new Date()) => {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function updateActive(fn: (p: Profile) => Profile) {
  if (!state.activeId) return
  const p = state.profiles[state.activeId]
  if (!p) return
  commit({ ...state, profiles: { ...state.profiles, [p.id]: fn(p) } })
}

export function createProfile(input: { name: string; avatar: string; hue: number; dailyGoal: number }) {
  const id = Math.random().toString(36).slice(2, 10)
  const profile: Profile = {
    id,
    name: input.name.trim() || 'Learner',
    avatar: input.avatar,
    hue: input.hue,
    dailyGoal: input.dailyGoal,
    createdAt: new Date().toISOString(),
    xp: 0,
    lessons: {},
    started: {},
    activity: {},
    badges: {},
    settings: { theme: 'system', sound: true },
  }
  commit({ ...state, activeId: id, profiles: { ...state.profiles, [id]: profile } })
  return id
}

export function switchProfile(id: string | null) {
  commit({ ...state, activeId: id })
}

export function deleteProfile(id: string) {
  const profiles = { ...state.profiles }
  delete profiles[id]
  commit({ ...state, profiles, activeId: state.activeId === id ? null : state.activeId })
}

export function editProfile(patch: Partial<Pick<Profile, 'name' | 'avatar' | 'hue' | 'dailyGoal' | 'settings'>>) {
  updateActive((p) => ({ ...p, ...patch }))
}

export function resetProgress() {
  updateActive((p) => ({ ...p, xp: 0, lessons: {}, started: {}, activity: {}, badges: {}, lastLesson: undefined, progress: {} }))
}

export function markStarted(key: string) {
  updateActive((p) => ({
    ...p,
    lastLesson: key,
    started: p.started[key] ? p.started : { ...p.started, [key]: new Date().toISOString() },
  }))
}

export function saveLessonProgress(key: string, entry: LessonProgress | null) {
  updateActive((p) => {
    const progress = { ...p.progress }
    if (entry) progress[key] = entry
    else delete progress[key]
    return { ...p, progress }
  })
}

export function addXp(amount: number) {
  if (amount <= 0) return
  const d = today()
  updateActive((p) => ({ ...p, xp: p.xp + amount, activity: { ...p.activity, [d]: (p.activity[d] ?? 0) + amount } }))
}

export type CompletionResult = { xpGained: number; newBadges: BadgeId[]; firstTime: boolean; improved: boolean }

export function completeLesson(key: string, score: number, kind: 'learn' | 'practice' | 'quiz', bonusXp = 0): CompletionResult {
  const p = state.activeId ? state.profiles[state.activeId] : null
  if (!p) return { xpGained: 0, newBadges: [], firstTime: false, improved: false }
  const prev = p.lessons[key]
  const now = new Date().toISOString()
  const firstTime = !prev
  const improved = !!prev && score > prev.best
  const base = kind === 'quiz' ? 40 : kind === 'practice' ? 25 : 20
  let xpGained = (firstTime ? base : Math.round(base / 2)) + bonusXp
  if (score >= 1 && (firstTime || improved)) xpGained += 20
  const record: LessonRecord = {
    best: Math.max(prev?.best ?? 0, score),
    attempts: (prev?.attempts ?? 0) + 1,
    completedAt: prev?.completedAt ?? now,
    lastAt: now,
  }
  const d = today()
  const progress = { ...p.progress }
  delete progress[key]
  const next: Profile = {
    ...p,
    progress,
    xp: p.xp + xpGained,
    lessons: { ...p.lessons, [key]: record },
    activity: { ...p.activity, [d]: (p.activity[d] ?? 0) + xpGained },
    lastLesson: key,
  }
  const earned = evaluateBadges(next, { score, kind, hour: new Date().getHours() })
  const newBadges = earned.filter((b) => !p.badges[b])
  for (const b of newBadges) next.badges = { ...next.badges, [b]: now }
  commit({ ...state, profiles: { ...state.profiles, [p.id]: next } })
  return { xpGained, newBadges, firstTime, improved }
}

export function exportProfile(): string {
  const p = state.activeId ? state.profiles[state.activeId] : null
  return JSON.stringify({ format: 'pstack-academy-profile', version: 1, profile: p }, null, 2)
}

export function importProfile(json: string): string {
  const data = JSON.parse(json) as { format?: string; profile?: Profile }
  if (data.format !== 'pstack-academy-profile' || !data.profile?.name) throw new Error('That file is not a pstack academy profile.')
  const id = Math.random().toString(36).slice(2, 10)
  const profile: Profile = { ...data.profile, id }
  commit({ ...state, activeId: id, profiles: { ...state.profiles, [id]: profile } })
  return profile.name
}

export type Mastery = 'none' | 'attempted' | 'familiar' | 'proficient' | 'mastered'

export const MASTERY_POINTS: Record<Mastery, number> = { none: 0, attempted: 25, familiar: 50, proficient: 80, mastered: 100 }
export const MASTERY_LABEL: Record<Mastery, string> = {
  none: 'Not started',
  attempted: 'Attempted',
  familiar: 'Familiar',
  proficient: 'Proficient',
  mastered: 'Mastered',
}

export function masteryOf(rec: LessonRecord | undefined): Mastery {
  if (!rec) return 'none'
  if (rec.best >= 1) return 'mastered'
  if (rec.best >= 0.85) return 'proficient'
  if (rec.best >= 0.6) return 'familiar'
  return 'attempted'
}

export function unitMastery(p: Profile, unitId: string): number {
  const unit = course.find((u) => u.id === unitId)
  if (!unit) return 0
  const total = unit.lessons.reduce((acc, l) => acc + MASTERY_POINTS[masteryOf(p.lessons[lessonKey(unit.id, l.id)])], 0)
  return Math.round(total / unit.lessons.length)
}

export function courseMastery(p: Profile): number {
  const keys = allLessonKeys()
  const total = keys.reduce((acc, k) => acc + MASTERY_POINTS[masteryOf(p.lessons[k])], 0)
  return Math.round(total / keys.length)
}

export function streakOf(p: Profile): number {
  let count = 0
  const d = new Date()
  if (!p.activity[today(d)]) d.setDate(d.getDate() - 1)
  while (p.activity[today(d)]) {
    count++
    d.setDate(d.getDate() - 1)
  }
  return count
}

export const LEVELS = [
  'Curious Visitor',
  'Repo Tourist',
  'Prompt Apprentice',
  'Playbook Runner',
  'Evidence Collector',
  'Principled Engineer',
  'Arena Judge',
  'Overnight Operator',
  'pstack Sensei',
]

export function levelOf(xp: number) {
  const level = Math.floor(Math.sqrt(xp / 60)) + 1
  const floor = 60 * (level - 1) ** 2
  const ceil = 60 * level ** 2
  return {
    level,
    title: LEVELS[Math.min(level - 1, LEVELS.length - 1)],
    into: xp - floor,
    span: ceil - floor,
  }
}

function evaluateBadges(p: Profile, ctx: { score: number; kind: string; hour: number }): BadgeId[] {
  const out: BadgeId[] = []
  const done = Object.keys(p.lessons).length
  if (done >= 1) out.push('first-step')
  if (done >= 10) out.push('ten-lessons')
  if (ctx.kind === 'quiz' && ctx.score >= 1) out.push('flawless')
  if (ctx.hour >= 22 || ctx.hour < 5) out.push('night-owl')
  const streak = streakOf(p)
  if (streak >= 3) out.push('streak-3')
  if (streak >= 7) out.push('streak-7')
  if (p.xp >= 500) out.push('xp-500')
  if (p.xp >= 1500) out.push('xp-1500')
  const unitsDone = course.filter((u) => u.lessons.every((l) => p.lessons[lessonKey(u.id, l.id)]))
  if (unitsDone.length >= 1) out.push('unit-complete')
  if (unitsDone.length === course.length) out.push('graduate')
  const principles = course.find((u) => u.id === 'principles')
  if (principles && principles.lessons.every((l) => masteryOf(p.lessons[lessonKey(principles.id, l.id)]) === 'mastered')) {
    out.push('principled')
  }
  return out.filter((b) => b in BADGES)
}

export function getActiveProfile(): Profile | null {
  return state.activeId ? state.profiles[state.activeId] ?? null : null
}
