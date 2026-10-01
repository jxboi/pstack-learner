import { existsSync, readFileSync } from 'node:fs'
import { course } from '../src/content/course'
import { GLOSSARY } from '../src/content/glossary'
import { PRINCIPLES } from '../src/content/principles'
import { seededOrder } from '../src/lib/shuffle'

const typesSrc = readFileSync('src/content/types.ts', 'utf8')
const WIDGET_IDS = [...(typesSrc.match(/export type WidgetId =([\s\S]*?)\n\n/)?.[1] ?? '').matchAll(/'([a-z-]+)'/g)].map((m) => m[1])
const errors: string[] = []
const answerSlots: number[] = [0, 0, 0, 0, 0]
let questions = 0
const keys = new Set<string>()

for (const u of course) {
  if (u.image && !existsSync(`public${u.image}`)) errors.push(`${u.id}: missing image ${u.image}`)
  for (const l of u.lessons) {
    const key = `${u.id}/${l.id}`
    if (keys.has(key)) errors.push(`duplicate lesson ${key}`)
    keys.add(key)
    if (!l.steps.length) errors.push(`${key}: no steps`)
    if (l.kind === 'quiz' && l.steps.some((s) => s.kind === 'read' || s.kind === 'widget')) errors.push(`${key}: quiz contains non-question step`)
    l.steps.forEach((s, i) => {
      const at = `${key}#${i}`
      switch (s.kind) {
        case 'read':
          if (s.image && !existsSync(`public${s.image.src}`)) errors.push(`${at}: missing image ${s.image.src}`)
          if ((s.body.match(/```/g) ?? []).length % 2) errors.push(`${at}: unbalanced code fence`)
          break
        case 'widget':
          if (!WIDGET_IDS.includes(s.widget)) errors.push(`${at}: unknown widget ${s.widget}`)
          break
        case 'mcq':
          questions++
          if (s.answer < 0 || s.answer >= s.options.length) errors.push(`${at}: answer out of range`)
          if (new Set(s.options).size !== s.options.length) errors.push(`${at}: duplicate options`)
          answerSlots[seededOrder(s.options.length, s.q).indexOf(s.answer)]++
          break
        case 'multi':
          questions++
          if (!s.answers.length || s.answers.some((a) => a < 0 || a >= s.options.length)) errors.push(`${at}: bad answers`)
          break
        case 'order':
          questions++
          if (s.items.length < 3) errors.push(`${at}: order needs 3+ items`)
          break
        case 'match':
          questions++
          if (new Set(s.pairs.map((p) => p[1])).size !== s.pairs.length) errors.push(`${at}: duplicate right side`)
          break
        case 'sort':
          questions++
          if (s.items.some((it) => it.bucket < 0 || it.bucket >= s.buckets.length)) errors.push(`${at}: bucket out of range`)
          break
        case 'spot':
          questions++
          if (!s.segments.some((g) => g.target)) errors.push(`${at}: spot has no targets`)
          break
      }
    })
  }
}
for (const t of GLOSSARY) if (t.unit && !course.some((u) => u.id === t.unit)) errors.push(`glossary ${t.term}: unknown unit ${t.unit}`)
if (PRINCIPLES.length !== 23) errors.push(`expected 23 principles, got ${PRINCIPLES.length}`)

const mcqTotal = answerSlots.reduce((a, b) => a + b, 0)
if (Math.max(...answerSlots) / mcqTotal > 0.4) errors.push(`displayed answers cluster on one letter: ${JSON.stringify(answerSlots)}`)
const lessons = course.reduce((a, u) => a + u.lessons.length, 0)
console.log(`units=${course.length} lessons=${lessons} questions=${questions} displayed-answer-slots(A..E)=${JSON.stringify(answerSlots)}`)
if (errors.length) {
  console.error(errors.join('\n'))
  process.exit(1)
}
console.log('course content OK')
