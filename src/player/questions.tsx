import { Fragment, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'motion/react'
import type { McqStep, MultiStep, OrderStep, MatchStep, SortStep, SpotStep } from '../content/types'
import { Inline, CodeBlock } from '../components/Markdown'
import { sfx } from '../lib/fx'
import { seededOrder } from '../lib/shuffle'

export type QProps<S> = {
  step: S
  checked: boolean
  onChange: (ready: boolean, correct: boolean) => void
}

const LETTERS = 'ABCDEFGH'

// Clicking an answer must not focus it: Enter should check the answer, not re-press the tile.
const keepFocus = (e: React.MouseEvent) => e.preventDefault()

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function shuffledIndices(n: number, avoidIdentity = true) {
  const base = Array.from({ length: n }, (_, i) => i)
  if (n < 2) return base
  let s = shuffle(base)
  let guard = 0
  while (avoidIdentity && s.every((v, i) => v === i) && guard++ < 10) s = shuffle(base)
  return s
}

function useKeyPick(count: number, enabled: boolean, pick: (i: number) => void) {
  useEffect(() => {
    if (!enabled) return
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const k = e.key.toUpperCase()
      const pos = /^[1-9]$/.test(k) ? Number(k) - 1 : LETTERS.indexOf(k)
      if (pos >= 0 && pos < count) pick(pos)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [count, enabled, pick])
}

export function Mcq({ step, checked, onChange }: QProps<McqStep>) {
  const order = useMemo(() => seededOrder(step.options.length, step.q), [step])
  const [sel, setSel] = useState<number | null>(null)
  const [ruledOut, setRuledOut] = useState<Set<number>>(new Set())
  const wasChecked = useRef(checked)
  useEffect(() => {
    // On "Try again", rule out the wrong pick so the learner chooses afresh.
    if (wasChecked.current && !checked && sel !== null && sel !== step.answer) {
      setRuledOut((r) => new Set(r).add(sel))
      setSel(null)
      onChange(false, false)
    }
    wasChecked.current = checked
  }, [checked, sel, step.answer, onChange])
  const pick = (i: number) => {
    if (checked || ruledOut.has(i)) return
    sfx.tap()
    setSel(i)
    onChange(true, i === step.answer)
  }
  useKeyPick(step.options.length, !checked, (pos) => pick(order[pos]))
  return (
    <>
      {step.code && <CodeBlock code={step.code} />}
      <div className="options" role="radiogroup">
        {order.map((i, pos) => {
          const o = step.options[i]
          const out = ruledOut.has(i)
          let cls = 'option'
          if (checked && sel === i) cls += i === step.answer ? ' right' : ' wrong'
          else if (sel === i) cls += ' selected'
          else if (out) cls += ' ruled-out'
          return (
            <button key={i} className={cls} onClick={() => pick(i)} onMouseDown={keepFocus} disabled={checked || out} role="radio" aria-checked={sel === i}>
              <span className="key">{LETTERS[pos]}</span>
              <span>
                <Inline text={o} />
              </span>
            </button>
          )
        })}
      </div>
    </>
  )
}

export function Multi({ step, checked, onChange }: QProps<MultiStep>) {
  const [sel, setSel] = useState<Set<number>>(new Set())
  const selRef = useRef(sel)
  const toggle = (i: number) => {
    if (checked) return
    sfx.tap()
    const next = new Set(selRef.current)
    if (next.has(i)) next.delete(i)
    else next.add(i)
    selRef.current = next
    setSel(next)
    const correct = next.size === step.answers.length && step.answers.every((a) => next.has(a))
    onChange(next.size > 0, correct)
  }
  const order = useMemo(() => seededOrder(step.options.length, step.q), [step])
  useKeyPick(step.options.length, !checked, (pos) => toggle(order[pos]))
  return (
    <>
      <p className="muted" style={{ marginTop: -8, fontWeight: 600, fontSize: 14 }}>
        Select all that apply.
      </p>
      <div className="options">
        {order.map((i, pos) => {
          const o = step.options[i]
          const on = sel.has(i)
          const shouldBe = step.answers.includes(i)
          let cls = 'option'
          if (checked) {
            if (on && shouldBe) cls += ' right'
            else if (on && !shouldBe) cls += ' wrong'
            else if (!on && shouldBe) cls += ' selected'
          } else if (on) cls += ' selected'
          return (
            <button key={i} className={cls} onClick={() => toggle(i)} onMouseDown={keepFocus} disabled={checked} role="checkbox" aria-checked={on}>
              <span className="key">{on ? '✓' : LETTERS[pos]}</span>
              <span>
                <Inline text={o} />
              </span>
            </button>
          )
        })}
      </div>
    </>
  )
}

export function Order({ step, checked, onChange }: QProps<OrderStep>) {
  const [order, setOrder] = useState<number[]>(() => shuffledIndices(step.items.length))
  useEffect(() => {
    onChange(true, order.every((v, i) => v === i))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order])
  const move = (pos: number, dir: -1 | 1) => {
    const to = pos + dir
    if (to < 0 || to >= order.length || checked) return
    sfx.tap()
    const next = [...order]
    ;[next[pos], next[to]] = [next[to], next[pos]]
    setOrder(next)
  }
  return (
    <div className="order-list">
      {order.map((itemIdx, pos) => {
        let cls = 'order-item'
        if (checked) cls += itemIdx === pos ? ' right' : ' wrong'
        return (
          <motion.div layout transition={{ type: 'spring', stiffness: 500, damping: 38 }} key={itemIdx} className={cls}>
            <span className="num">{pos + 1}</span>
            <span>
              <Inline text={step.items[itemIdx]} />
            </span>
            <span className="moves">
              <button className="icon-btn" aria-label="Move up" onClick={() => move(pos, -1)} onMouseDown={keepFocus} disabled={checked || pos === 0}>
                ▲
              </button>
              <button className="icon-btn" aria-label="Move down" onClick={() => move(pos, 1)} onMouseDown={keepFocus} disabled={checked || pos === order.length - 1}>
                ▼
              </button>
            </span>
          </motion.div>
        )
      })}
    </div>
  )
}

const PAIR_HUES = [205, 30, 150, 275, 345, 95]

export function Match({ step, checked, onChange }: QProps<MatchStep>) {
  const rightOrder = useMemo(() => shuffledIndices(step.pairs.length), [step])
  const [pairs, setPairs] = useState<Record<number, number>>({})
  const pairsRef = useRef(pairs)
  const [selLeft, setSelLeft] = useState<number | null>(null)
  const pairedRight = new Map(Object.entries(pairs).map(([l, r]) => [r, Number(l)]))

  const commit = (next: Record<number, number>) => {
    pairsRef.current = next
    setPairs(next)
    const complete = Object.keys(next).length === step.pairs.length
    onChange(complete, complete && Object.entries(next).every(([l, r]) => Number(l) === r))
  }
  const clickLeft = (l: number) => {
    if (checked) return
    sfx.tap()
    if (pairsRef.current[l] !== undefined) {
      const next = { ...pairsRef.current }
      delete next[l]
      commit(next)
      setSelLeft(l)
      return
    }
    setSelLeft(selLeft === l ? null : l)
  }
  const clickRight = (r: number) => {
    if (checked) return
    sfx.tap()
    const ownerKey = Object.entries(pairsRef.current).find(([, v]) => v === r)?.[0]
    const owner = ownerKey === undefined ? undefined : Number(ownerKey)
    const next = { ...pairsRef.current }
    if (owner !== undefined) {
      delete next[owner]
      if (selLeft === null) {
        commit(next)
        return
      }
    }
    const l = selLeft ?? [...step.pairs.keys()].find((i) => next[i] === undefined)
    if (l === undefined) return
    commit({ ...next, [l]: r })
    setSelLeft(null)
  }

  const order = Object.keys(pairs).map(Number)
  const colorOf = (l: number) => PAIR_HUES[order.indexOf(l) % PAIR_HUES.length]
  const tint = (l: number) => (checked ? undefined : { borderColor: `hsl(${colorOf(l)} 60% 55%)`, background: `color-mix(in srgb, hsl(${colorOf(l)} 70% 55%) 10%, var(--surface))` })
  const dot = (l: number) => (
    <span className="pair-dot" style={{ background: `hsl(${colorOf(l)} 65% 50%)` }}>
      {order.indexOf(l) + 1}
    </span>
  )

  return (
    <>
      <p className="muted" style={{ marginTop: -8, fontWeight: 600, fontSize: 14 }}>
        Tap an item on the left, then its partner on the right. Tap a pair again to undo.
      </p>
      <div className="match-grid">
        {step.pairs.map(([left], l) => {
          const paired = pairs[l] !== undefined
          let cls = 'match-tile'
          if (checked && paired) cls += pairs[l] === l ? ' right' : ' wrong'
          else if (selLeft === l) cls += ' selected'
          const r = rightOrder[l]
          const owner = pairedRight.get(r)
          let rcls = 'match-tile'
          if (checked && owner !== undefined) rcls += owner === r ? ' right' : ' wrong'
          else if (selLeft !== null && owner === undefined) rcls += ' armed'
          return (
            <Fragment key={l}>
              <button className={cls} onClick={() => clickLeft(l)} onMouseDown={keepFocus} disabled={checked} style={paired && selLeft !== l ? tint(l) : undefined}>
                {paired && dot(l)}
                <Inline text={left} />
              </button>
              <button className={rcls} onClick={() => clickRight(r)} onMouseDown={keepFocus} disabled={checked} style={owner !== undefined ? tint(owner) : undefined}>
                {owner !== undefined && dot(owner)}
                <Inline text={step.pairs[r][1]} />
              </button>
            </Fragment>
          )
        })}
      </div>
    </>
  )
}

export function Sort({ step, checked, onChange }: QProps<SortStep>) {
  const itemOrder = useMemo(() => shuffledIndices(step.items.length, false), [step])
  const [placed, setPlaced] = useState<Record<number, number>>({})
  const placedRef = useRef(placed)
  const [sel, setSel] = useState<number | null>(null)
  // Hold the pool at its starting height so the boxes below don't jump up under the pointer as it empties.
  const poolRef = useRef<HTMLDivElement>(null)
  const [poolHeight, setPoolHeight] = useState<number>()
  useLayoutEffect(() => setPoolHeight(poolRef.current?.offsetHeight), [])

  const commit = (next: Record<number, number>) => {
    placedRef.current = next
    setPlaced(next)
    const complete = Object.keys(next).length === step.items.length
    onChange(complete, complete && step.items.every((it, i) => next[i] === it.bucket))
  }
  const pickItem = (i: number) => {
    if (checked) return
    sfx.tap()
    if (placedRef.current[i] !== undefined) {
      const next = { ...placedRef.current }
      delete next[i]
      commit(next)
      setSel(i)
      return
    }
    setSel(sel === i ? null : i)
  }
  const dropIn = (b: number) => {
    if (checked) return
    const target = sel ?? itemOrder.find((i) => placedRef.current[i] === undefined)
    if (target === undefined) return
    sfx.tap()
    commit({ ...placedRef.current, [target]: b })
    setSel(null)
  }
  const pool = itemOrder.filter((i) => placed[i] === undefined)

  const chip = (i: number) => {
    let cls = 'sort-chip'
    if (checked) cls += placed[i] === step.items[i].bucket ? ' right' : ' wrong'
    else if (sel === i) cls += ' selected'
    return (
      <motion.button
        layout
        layoutId={`sort-${i}`}
        transition={{ type: 'spring', stiffness: 500, damping: 36 }}
        key={i}
        className={cls}
        onClick={(e) => {
          e.stopPropagation()
          pickItem(i)
        }}
        onMouseDown={keepFocus}
        disabled={checked}
      >
        <Inline text={step.items[i].text} />
      </motion.button>
    )
  }

  return (
    <>
      <p className="muted" style={{ marginTop: -8, fontWeight: 600, fontSize: 14 }}>
        Tap an item, then tap the box it belongs in. Tap a placed item to move it back.
      </p>
      <div className="sort-pool" aria-label="Unsorted items" ref={poolRef} style={{ minHeight: poolHeight }}>
        {pool.length ? pool.map(chip) : <span className="muted" style={{ fontSize: 14, fontWeight: 600, alignSelf: 'center' }}>All sorted. Press Check.</span>}
      </div>
      <div className="sort-buckets">
        {step.buckets.map((b, bi) => (
          <div
            key={bi}
            className={`bucket ${sel !== null && !checked ? 'armed' : ''}`}
            onClick={() => dropIn(bi)}
            onMouseDown={keepFocus}
            role="button"
            tabIndex={checked ? -1 : 0}
            aria-label={`Put in ${b}`}
            onKeyDown={(e) => {
              if (e.key !== 'Enter' && e.key !== ' ') return
              e.preventDefault()
              e.stopPropagation()
              dropIn(bi)
            }}
          >
            <h5>{b}</h5>
            {itemOrder.filter((i) => placed[i] === bi).map(chip)}
          </div>
        ))}
      </div>
      {checked && step.items.some((it, i) => placed[i] !== it.bucket) && (
        <div className="spot-notes">
          {step.items.map((it, i) =>
            placed[i] !== it.bucket ? (
              <div key={i} className="spot-note">
                <strong>{it.text}</strong> belongs in <strong>{step.buckets[it.bucket]}</strong>.
              </div>
            ) : null,
          )}
        </div>
      )}
    </>
  )
}

export function Spot({ step, checked, onChange }: QProps<SpotStep>) {
  const [sel, setSel] = useState<Set<number>>(new Set())
  const selRef = useRef(sel)
  const targets = step.segments.map((s, i) => (s.target ? i : -1)).filter((i) => i >= 0)
  const toggle = (i: number) => {
    if (checked) return
    sfx.tap()
    const next = new Set(selRef.current)
    if (next.has(i)) next.delete(i)
    else next.add(i)
    selRef.current = next
    setSel(next)
    const correct = next.size === targets.length && targets.every((t) => next.has(t))
    onChange(next.size > 0, correct)
  }
  return (
    <>
      <p className="muted" style={{ marginTop: -8, fontWeight: 600, fontSize: 14 }}>
        Tap the problem phrases. There {targets.length === 1 ? 'is 1' : `are ${targets.length}`}.
      </p>
      <div className={`spot-text ${step.mono ? 'mono' : ''}`}>
        {step.segments.map((s, i) => {
          let cls = 'spot-seg'
          if (checked) {
            if (sel.has(i) && s.target) cls += ' right'
            else if (sel.has(i) && !s.target) cls += ' wrong'
            else if (!sel.has(i) && s.target) cls += ' missed'
          } else if (sel.has(i)) cls += ' selected'
          // Keep surrounding spaces outside the tappable span so each phrase reads as its own target.
          const [, lead, core, trail] = s.text.match(/^(\s*)([\s\S]*?)(\s*)$/) ?? ['', '', s.text, '']
          return (
            <Fragment key={i}>
              {lead}
              <span
                className={cls}
                onClick={() => toggle(i)}
                onMouseDown={keepFocus}
                role="button"
                aria-pressed={sel.has(i)}
                tabIndex={checked ? -1 : 0}
                onKeyDown={(e) => {
                  if (e.key !== 'Enter' && e.key !== ' ') return
                  e.preventDefault()
                  e.stopPropagation()
                  toggle(i)
                }}
              >
                {core}
              </span>
              {trail}
            </Fragment>
          )
        })}
      </div>
      {checked && (
        <div className="spot-notes">
          {step.segments
            .filter((s) => s.target && s.why)
            .map((s, i) => (
              <div key={i} className="spot-note">
                <strong>"{s.text.trim()}"</strong> {s.why}
              </div>
            ))}
        </div>
      )}
    </>
  )
}
