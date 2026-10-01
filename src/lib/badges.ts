export type BadgeId =
  | 'first-step'
  | 'ten-lessons'
  | 'flawless'
  | 'night-owl'
  | 'streak-3'
  | 'streak-7'
  | 'xp-500'
  | 'xp-1500'
  | 'unit-complete'
  | 'graduate'
  | 'principled'

export const BADGES: Record<BadgeId, { title: string; icon: string; desc: string; hue: number }> = {
  'first-step': { title: 'First Step', icon: '👣', desc: 'Finish your first lesson.', hue: 160 },
  'ten-lessons': { title: 'On a Roll', icon: '🛼', desc: 'Finish 10 lessons.', hue: 200 },
  flawless: { title: 'Flawless', icon: '💎', desc: 'Score 100% on a unit quiz.', hue: 265 },
  'night-owl': { title: 'Night Owl', icon: '🦉', desc: 'Finish a lesson between 10pm and 5am. Like an overnight run.', hue: 240 },
  'streak-3': { title: 'Warming Up', icon: '🔥', desc: 'Learn 3 days in a row.', hue: 20 },
  'streak-7': { title: 'Habit Formed', icon: '🌋', desc: 'Learn 7 days in a row.', hue: 5 },
  'xp-500': { title: 'Energized', icon: '⚡', desc: 'Earn 500 XP.', hue: 45 },
  'xp-1500': { title: 'Supercharged', icon: '🚀', desc: 'Earn 1,500 XP.', hue: 290 },
  'unit-complete': { title: 'Unit Cleared', icon: '🏁', desc: 'Finish every lesson in one unit.', hue: 130 },
  principled: { title: 'Principled', icon: '🧭', desc: 'Master every lesson in the Principles unit.', hue: 185 },
  graduate: { title: 'pstack Graduate', icon: '🎓', desc: 'Finish every lesson in the course.', hue: 320 },
}
