import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { learning } from '../../lib/content'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const pad = (n: number) => String(n).padStart(2, '0')

const STATUS = {
  learning: { label: 'Learning now', dot: 'bg-emerald-500' },
  exploring: { label: 'Exploring', dot: 'bg-amber-400' },
  future: { label: 'Future goal', dot: 'bg-neutral-400' },
} as const

export default function Learning() {
  const wrap = useRef<HTMLElement>(null)
  const activeCount = learning.filter((l) => l.status === 'learning').length

  useGSAP(
    () => {
      if (reduced()) return
      gsap.from('.learn-reveal', {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: { trigger: wrap.current, start: 'top 70%' },
      })
      gsap.from('.learn-row', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
        stagger: 0.08,
        clearProps: 'opacity,transform',
        scrollTrigger: { trigger: '.learn-list', start: 'top 85%', once: true },
      })
    },
    { scope: wrap },
  )

  return (
    <section
      id="learning"
      ref={wrap}
      className="border-t border-black/5 bg-[linear-gradient(180deg,#f4ecc4_0%,#f6f0d4_60%,#f6f2e0_100%)]"
    >
      <div className="mx-auto max-w-[1800px] px-6 py-24 md:px-12 xl:px-[5vw]">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.4fr] xl:gap-[5vw]">
          {/* Left: sticky heading */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <p className="learn-reveal flex items-center text-xs uppercase tracking-[0.3em] text-neutral-500">
              05
              <span className="mx-3 inline-block h-px w-10 bg-black/25" />
              Learning
            </p>

            <h2 className="learn-reveal mt-6 text-[clamp(2.5rem,5.6vw,6.5rem)] font-bold leading-[0.98] tracking-tighter">
              Always
              <br />
              <span className="font-serif font-normal italic text-neutral-500">learning.</span>
            </h2>

            <p className="learn-reveal mt-6 max-w-sm text-neutral-600 xl:text-lg">
              {learning.length} topics across web, AI and security. {activeCount} of them I&apos;m
              working on right now.
            </p>

            <ul className="learn-reveal mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs uppercase tracking-[0.15em] text-neutral-500">
              {Object.values(STATUS).map((s) => (
                <li key={s.label} className="flex items-center gap-2">
                  <span aria-hidden="true" className={`size-2 rounded-full ${s.dot}`} />
                  {s.label}
                </li>
              ))}
            </ul>
          </div>

          {/* Right: rows */}
          <ul className="learn-list">
            {learning.map((item, i) => {
              const s = STATUS[item.status]
              return (
                <li
                  key={item.id}
                  className="learn-row group flex items-center gap-5 rounded-xl border-b border-black/10 px-4 py-5 transition-colors duration-300 hover:bg-ink hover:text-cream md:gap-8 md:px-6 xl:py-6"
                >
                  <span className="w-8 shrink-0 text-xs opacity-50">{pad(i + 1)}</span>

                  <div className="min-w-0 flex-1">
                    <p className="text-lg font-semibold tracking-tight xl:text-2xl">{item.title}</p>
                    <p className="mt-1 text-sm text-neutral-500 transition-colors duration-300 group-hover:text-cream/70 xl:text-base">
                      {item.note}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] sm:hidden">
                      <span aria-hidden="true" className={`size-2 rounded-full ${s.dot}`} />
                      {s.label}
                    </span>
                  </div>

                  <span className="hidden shrink-0 items-center gap-2 text-xs uppercase tracking-[0.15em] sm:inline-flex">
                    <span aria-hidden="true" className={`size-2 rounded-full ${s.dot}`} />
                    {s.label}
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}