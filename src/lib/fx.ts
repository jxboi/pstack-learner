import confetti from 'canvas-confetti'
import { getActiveProfile } from './store'

let ctx: AudioContext | null = null

function tone(freqs: number[], dur = 0.12, type: OscillatorType = 'sine', gain = 0.06) {
  if (getActiveProfile()?.settings.sound === false) return
  try {
    ctx ??= new AudioContext()
    const t0 = ctx.currentTime
    freqs.forEach((f, i) => {
      const osc = ctx!.createOscillator()
      const g = ctx!.createGain()
      osc.type = type
      osc.frequency.value = f
      const start = t0 + i * dur * 0.8
      g.gain.setValueAtTime(0, start)
      g.gain.linearRampToValueAtTime(gain, start + 0.01)
      g.gain.exponentialRampToValueAtTime(0.0001, start + dur * 1.6)
      osc.connect(g).connect(ctx!.destination)
      osc.start(start)
      osc.stop(start + dur * 1.8)
    })
  } catch {
    /* audio unavailable */
  }
}

export const sfx = {
  correct: () => tone([660, 880], 0.09, 'triangle'),
  wrong: () => tone([220, 180], 0.12, 'sine', 0.05),
  complete: () => tone([523, 659, 784, 1046], 0.1, 'triangle'),
  tap: () => tone([520], 0.04, 'sine', 0.025),
}

export function celebrate(big = false) {
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  if (reduce) return
  const colors = ['#8a2f4f', '#f2b11d', '#7c5cf0', '#12935a', '#d6ecf9']
  confetti({ particleCount: big ? 160 : 90, spread: big ? 100 : 70, origin: { y: 0.6 }, colors, disableForReducedMotion: true })
  if (big) {
    setTimeout(() => confetti({ particleCount: 80, angle: 60, spread: 60, origin: { x: 0 }, colors }), 250)
    setTimeout(() => confetti({ particleCount: 80, angle: 120, spread: 60, origin: { x: 1 }, colors }), 400)
  }
}
