export type WidgetId =
  | 'agent-loop'
  | 'skill-anatomy'
  | 'slop-vs-clean'
  | 'repo-explorer'
  | 'model-roles'
  | 'router'
  | 'todo-fill'
  | 'prompt-grader'
  | 'why-detective'
  | 'arena-sim'
  | 'swarm-sim'
  | 'design-ladder'
  | 'comment-sicko'
  | 'tdd-cycle'
  | 'stack-lander'
  | 'babysit-queue'
  | 'overnight-contract'
  | 'night-loop'
  | 'principle-cards'
  | 'eval-blind'
  | 'prompt-workbench'

export type ReadStep = {
  kind: 'read'
  title: string
  body: string
  image?: { src: string; alt: string; credit?: string }
  callout?: { tone: 'tip' | 'warn' | 'analogy' | 'key'; text: string }
}

export type WidgetStep = {
  kind: 'widget'
  title: string
  intro?: string
  widget: WidgetId
}

export type McqStep = {
  kind: 'mcq'
  q: string
  code?: string
  options: string[]
  answer: number
  explain: string
  hint?: string
}

export type MultiStep = {
  kind: 'multi'
  q: string
  options: string[]
  answers: number[]
  explain: string
  hint?: string
}

export type OrderStep = {
  kind: 'order'
  q: string
  items: string[]
  explain: string
  hint?: string
}

export type MatchStep = {
  kind: 'match'
  q: string
  pairs: [string, string][]
  explain: string
  hint?: string
}

export type SortStep = {
  kind: 'sort'
  q: string
  buckets: string[]
  items: { text: string; bucket: number }[]
  explain: string
  hint?: string
}

export type SpotStep = {
  kind: 'spot'
  q: string
  segments: { text: string; target?: boolean; why?: string }[]
  explain: string
  hint?: string
  mono?: boolean
}

export type RecapStep = {
  kind: 'recap'
  title: string
  points: string[]
}

export type QuestionStep = McqStep | MultiStep | OrderStep | MatchStep | SortStep | SpotStep
export type Step = ReadStep | WidgetStep | RecapStep | QuestionStep

export type LessonKind = 'learn' | 'practice' | 'quiz'

export type Lesson = {
  id: string
  title: string
  kind: LessonKind
  minutes: number
  summary: string
  steps: Step[]
}

export type Unit = {
  id: string
  index: number
  title: string
  tagline: string
  icon: string
  hue: number
  image?: string
  goals: string[]
  lessons: Lesson[]
}

export const isQuestion = (s: Step): s is QuestionStep =>
  s.kind === 'mcq' || s.kind === 'multi' || s.kind === 'order' || s.kind === 'match' || s.kind === 'sort' || s.kind === 'spot'
