import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { achievements } from '../../lib/content'
import type { Achievement } from '../../types/content'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const pad = (n: number) => String(n).padStart(2, '0')

function Icon({ name }: { name: Achievement['icon'] }) {
  const common = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className: 'size-7',
    'aria-hidden': true,
  }
  if (name === 'award')
    return (
      <svg {...common}>
        <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4Z" />
        <path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3" />
      </svg>
    )
  if (name === 'book')
    return (
      <svg {...common}>
        <path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5Z" />
        <path d="M8 7h7" />
      </svg>
    )
  return (
    <svg {...common}>
      <rect x="3" y="4" width="18" height="13" rx="2" />
      <path d="M8 9h8M8 12h5" />
      <path d="m15 17 1 4 2-1.5L20 21l-1-4" />
    </svg>
  )
}

export default function Achievements() {
  const wrap = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (reduced()) return
      gsap.from('.ach-reveal', {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: { trigger: wrap.current, start: 'top 70%' },
      })
      gsap.from('.ach-card', {
        y: 40,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.12,
        clearProps: 'opacity,transform',
        scrollTrigger: { trigger: '.ach-list', start: 'top 85%', once: true },
      })
    },
    { scope: wrap },
  )

  return (
    <section
      id="achievements"
      ref={wrap}
      className="border-t border-black/5 bg-[linear-gradient(180deg,#f4ecc4_0%,#f6f0d4_60%,#f6f2e0_100%)]"
    >
      <div className="mx-auto max-w-[1800px] px-6 py-24 md:px-12 xl:px-[5vw]">
        <p className="ach-reveal flex items-center text-xs uppercase tracking-[0.3em] text-neutral-500">
          07
          <span className="mx-3 inline-block h-px w-10 bg-black/25" />
          Achievements
        </p>

        <h2 className="ach-reveal mt-6 text-[clamp(2.5rem,5.6vw,6.5rem)] font-bold leading-[1.02] tracking-tighter">
          Proud{' '}
          <span className="font-serif font-normal italic text-neutral-500">moments.</span>
        </h2>

        <ul className="ach-list mt-14 flex snap-x gap-5 overflow-x-auto pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {achievements.map((a, i) => (
            <li
              key={a.id}
              className="ach-card flex min-h-[18rem] w-[min(82vw,26rem)] shrink-0 snap-start flex-col justify-between rounded-3xl border border-black/10 bg-white/70 p-7 xl:w-auto xl:flex-1"
            >
              <div className="flex items-start justify-between">
                <span className="grid size-14 place-items-center rounded-2xl border border-black/10 bg-white">
                  <Icon name={a.icon} />
                </span>
                <span className="text-xs text-neutral-400">
                  {pad(i + 1)} / {pad(achievements.length)}
                </span>
              </div>

              <div className="mt-10">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold xl:text-2xl">{a.title}</h3>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.25em] text-neutral-500">
                      {a.type}
                    </p>
                  </div>
                  {a.stat && (
                    <span className="text-5xl font-bold tracking-tighter">{a.stat}</span>
                  )}
                </div>
                <p className="mt-4 text-neutral-600">{a.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}