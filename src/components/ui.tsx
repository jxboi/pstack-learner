import type { Mastery } from '../lib/store'
import { MASTERY_LABEL } from '../lib/store'

export const AVATARS = ['🍠', '🦊', '🐼', '🐙', '🦉', '🐢', '🐝', '🦄', '🐧', '🐳', '🦖', '🐸', '🤖', '👾', '🧑‍🚀', '🧙']
export const HUES = [345, 20, 45, 130, 175, 205, 240, 275, 310]

export function Avatar({ emoji, hue, size = 40 }: { emoji: string; hue: number; size?: number }) {
  return (
    <span
      className="avatar"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.55,
        background: `linear-gradient(145deg, hsl(${hue} 85% 82%), hsl(${hue} 70% 66%))`,
        boxShadow: `inset 0 -${Math.max(2, size / 16)}px 0 hsl(${hue} 60% 50% / 0.35)`,
      }}
      aria-hidden
    >
      {emoji}
    </span>
  )
}

export function MasteryIcon({ level, title }: { level: Mastery; title?: string }) {
  return <span className={`mastery ${level}`} title={title ?? MASTERY_LABEL[level]} aria-label={MASTERY_LABEL[level]} role="img" />
}

export function MasteryLegend() {
  const levels: Mastery[] = ['none', 'attempted', 'familiar', 'proficient', 'mastered']
  return (
    <div className="legend">
      {levels.map((l) => (
        <span key={l}>
          <MasteryIcon level={l} /> {MASTERY_LABEL[l]}
        </span>
      ))}
    </div>
  )
}

export function Ring({
  value,
  size = 96,
  stroke = 10,
  color = 'var(--m-proficient)',
  track = 'var(--bg-2)',
  children,
}: {
  value: number
  size?: number
  stroke?: number
  color?: string
  track?: string
  children?: React.ReactNode
}) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const v = Math.max(0, Math.min(1, value))
  return (
    <div className="ring-wrap" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - v)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(.2,.8,.2,1)' }}
        />
      </svg>
      <div className="ring-label">{children}</div>
    </div>
  )
}

export const KIND_META = {
  learn: { icon: '📖', label: 'Lesson', hue: 205 },
  practice: { icon: '🎯', label: 'Practice', hue: 30 },
  quiz: { icon: '🏆', label: 'Unit quiz', hue: 275 },
} as const
