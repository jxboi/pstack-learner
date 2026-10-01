import type { Lesson, Unit } from './types'
import { foundations } from './units/foundations'
import { setup } from './units/setup'
import { potetoMode } from './units/poteto-mode'
import { understand } from './units/understand'
import { design } from './units/design'
import { build } from './units/build'
import { verify } from './units/verify'
import { overnight } from './units/overnight'
import { principles } from './units/principles'
import { makeItYours } from './units/make-it-yours'
import { capstone } from './units/capstone'

export const course: Unit[] = [foundations, setup, potetoMode, understand, design, build, verify, overnight, principles, makeItYours, capstone]

export const lessonKey = (unitId: string, lessonId: string) => `${unitId}/${lessonId}`

export const allLessonKeys = () => course.flatMap((u) => u.lessons.map((l) => lessonKey(u.id, l.id)))

export function findLesson(unitId: string, lessonId: string): { unit: Unit; lesson: Lesson; index: number } | null {
  const unit = course.find((u) => u.id === unitId)
  if (!unit) return null
  const index = unit.lessons.findIndex((l) => l.id === lessonId)
  if (index < 0) return null
  return { unit, lesson: unit.lessons[index], index }
}

export function nextLesson(unitId: string, lessonId: string): { unit: Unit; lesson: Lesson } | null {
  const keys = course.flatMap((u) => u.lessons.map((l) => ({ unit: u, lesson: l })))
  const i = keys.findIndex((k) => k.unit.id === unitId && k.lesson.id === lessonId)
  return i >= 0 && i + 1 < keys.length ? keys[i + 1] : null
}

export const totalMinutes = () => course.reduce((a, u) => a + u.lessons.reduce((b, l) => b + l.minutes, 0), 0)
