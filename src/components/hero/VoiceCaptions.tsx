import { useEffect, useRef } from 'react'
import { voiceClock } from '../../lib/voiceClock'

type Word = { t: string; at: number; accent?: boolean }
type Phrase = { out: number | null; lines: Word[][] }

// at = jis second par lafz aana shuru hota hai (awaaz se naapa gaya)
// out = jis second par poora jumla fade out hona shuru ho (null = aakhir tak rahe)
const PHRASES: Phrase[] = [
  {
    out: 1.25,
    lines: [
      [
        { t: 'I am', at: 0.12 },
        { t: 'Waleed', at: 0.53, accent: true },
        { t: 'Abbas.', at: 0.92, accent: true },
      ],
    ],
  },
  {
    out: 4.45,
    lines: [
      [
        { t: 'Full', at: 1.44 },
        { t: 'stack', at: 1.72 },
        { t: 'developer', at: 1.95, accent: true },
      ],
      [
        { t: 'and', at: 2.62 },
        { t: 'AI', at: 2.84 },
        { t: 'agent', at: 3.32 },
        { t: 'maker.', at: 3.65, accent: true },
      ],
    ],
  },
  {
    out: null,
    lines: [
      [
        { t: 'I build', at: 5.07 },
        { t: 'agents,', at: 5.54, accent: true },
      ],
      [
        { t: 'full', at: 6.28 },
        { t: 'websites,', at: 6.48, accent: true },
      ],
      [
        { t: 'and', at: 6.95 },
        { t: 'apps.', at: 7.1, accent: true },
      ],
    ],
  },
]

const IN = 0.28
const OUT = 0.3
const ease = (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : 1 - Math.pow(1 - x, 3))

export default function VoiceCaptions() {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = root.current
    if (!el) return

    const hint = el.querySelector<HTMLElement>('[data-hint]')
    const items = Array.from(el.querySelectorAll<HTMLElement>('[data-p]')).map((node) => ({
      node,
      p: Number(node.dataset.p),
      at: Number(node.dataset.at),
    }))

    const update = (t: number) => {
      if (hint) hint.style.opacity = String(1 - ease(t / 0.15))
      for (const it of items) {
        const ph = PHRASES[it.p]
        const inn = ease((t - it.at) / IN)
        const out = ph.out === null ? 1 : 1 - ease((t - ph.out) / OUT)
        const o = inn * out
        const y = (1 - inn) * 26 - (1 - out) * 16
        const blur = (1 - o) * 8
        it.node.style.opacity = String(o)
        it.node.style.transform = `translateY(${y.toFixed(1)}px)`
        it.node.style.filter = blur > 0.05 ? `blur(${blur.toFixed(1)}px)` : 'none'
      }
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      update(99)
      return
    }

    return voiceClock.subscribe(update)
  }, [])

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="pointer-events-none absolute left-6 right-6 top-[17svh] z-10 h-[20svh] md:left-12 md:right-[36%] md:top-1/2 md:h-[34svh] md:-translate-y-1/2"
    >
      <div
        data-hint
        className="absolute inset-0 flex items-center justify-center"
      >
        <span className="animate-pulse text-xs uppercase tracking-[0.25em] text-neutral-400">
          Scroll ↓
        </span>
      </div>

      {PHRASES.map((ph, pi) => (
        <div key={pi} className="absolute inset-0 flex flex-col items-center justify-center">
          {ph.lines.map((line, li) => (
            <div
              key={li}
              className="flex flex-wrap items-baseline justify-center gap-x-[0.28em] text-center text-[clamp(1.75rem,4.4vw,4.25rem)] font-bold leading-[1.05] tracking-tight"
            >
              {line.map((w) => (
                <span
                  key={w.at}
                  data-p={pi}
                  data-at={w.at}
                  style={{ opacity: 0 }}
                  className={`inline-block will-change-transform ${
                    w.accent ? 'font-serif text-[1.08em] font-normal italic' : ''
                  }`}
                >
                  {w.t}
                </span>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}