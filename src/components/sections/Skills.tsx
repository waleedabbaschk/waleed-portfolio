import { useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { skills } from '../../lib/content'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const categories = ['All', ...Array.from(new Set(skills.map((s) => s.category)))]

// Har family ka apna rang (tile + pill ka dot)
const FAMILY: Record<string, { tile: string; dot: string }> = {
  Languages: { tile: 'bg-ink text-cream', dot: '#12121f' },
  Frontend: { tile: 'bg-[#5c544f] text-cream', dot: '#5c544f' },
  Backend: { tile: 'bg-[#8d827b] text-cream', dot: '#8d827b' },
  DevOps: { tile: 'bg-[#cfc6b6] text-ink', dot: '#cfc6b6' },
  'AI & Automation': { tile: 'bg-[#d9c4c8] text-ink', dot: '#d9c4c8' },
}
const FALLBACK = { tile: 'bg-[#cfc6b6] text-ink', dot: '#cfc6b6' }
const family = (c: string) => FAMILY[c] ?? FALLBACK

export default function Skills() {
  const wrap = useRef<HTMLElement>(null)
  const [filter, setFilter] = useState('All')
  const [activeName, setActiveName] = useState<string | null>(null)

  const matches = (category: string) => filter === 'All' || category === filter
  const active =
    skills.find((s) => s.name === activeName && matches(s.category)) ??
    skills.find((s) => matches(s.category))

  useGSAP(
    () => {
      if (reduced()) return
      gsap.from('.skills-reveal', {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: { trigger: wrap.current, start: 'top 70%' },
      })
      gsap.from('.skill-tile', {
        y: 30,
        scale: 0.85,
        opacity: 0,
        duration: 0.6,
        ease: 'back.out(1.6)',
        stagger: { amount: 0.9 },
        clearProps: 'opacity,transform',
        scrollTrigger: { trigger: '.skill-grid', start: 'top 85%', once: true },
      })
    },
    { scope: wrap },
  )

  useGSAP(
    () => {
      if (reduced()) return
      gsap.fromTo(
        '.skill-logo',
        { scale: 0.5, rotate: -15, opacity: 0 },
        { scale: 1, rotate: 0, opacity: 1, duration: 0.6, ease: 'back.out(2)' },
      )
      gsap.fromTo(
        '.skill-text',
        { y: 14, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, stagger: 0.07, ease: 'power2.out' },
      )
      gsap.to('.skill-float', {
        y: -8,
        duration: 2.2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      })
    },
    { scope: wrap, dependencies: [active?.name], revertOnUpdate: true },
  )

  return (
    <section
      id="skills"
      ref={wrap}
      className="min-h-screen border-t border-black/5 bg-[linear-gradient(180deg,#faf8f2_0%,#f7f4ea_100%)]"
    >
      <div className="mx-auto max-w-[1800px] px-6 py-16 md:px-12 md:py-24 xl:px-[5vw]">
        <p className="skills-reveal flex items-center text-xs uppercase tracking-[0.3em] text-neutral-500">
          02
          <span className="mx-3 inline-block h-px w-10 bg-black/25" />
          Skills
        </p>

        <h2 className="skills-reveal mt-6 text-[clamp(2.5rem,5.6vw,6.5rem)] font-bold leading-[1.02] tracking-tighter">
          The periodic table{' '}
          <span className="font-serif font-normal italic text-neutral-500">of my stack.</span>
        </h2>

        <p className="skills-reveal mt-5 max-w-xl text-neutral-600 xl:text-lg">
          {skills.length} elements in {categories.length - 1} families. Hover or tap a tile to see
          its logo, or pick a family to light it up.
        </p>

        <div className="skills-reveal mt-8 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setFilter(c)}
              aria-pressed={filter === c}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[clamp(0.8rem,0.95vw,1rem)] transition ${
                filter === c
                  ? 'border-ink bg-ink text-cream'
                  : 'border-black/10 bg-white/50 text-neutral-700 hover:border-ink'
              }`}
            >
              {c !== 'All' && (
                <span
                  aria-hidden="true"
                  className="size-2.5 rounded-[3px] border border-black/10"
                  style={{ backgroundColor: family(c).dot }}
                />
              )}
              {c}
            </button>
          ))}
        </div>

        {/* Phone: flex-column (sticky logo kaam kare). Desktop: 2 column grid, logo right */}
        <div className="mt-10 flex flex-col gap-6 md:mt-12 lg:grid lg:grid-cols-[2.4fr_1fr] lg:items-center lg:gap-12 xl:gap-[5vw]">
          {/* Logo: phone par tiles ke upar sticky, desktop par right side (bina box) */}
          {active && (
            <div className="skills-reveal sticky top-20 z-10 flex items-center gap-5 rounded-2xl border border-black/10 bg-white/80 p-4 text-left backdrop-blur lg:static lg:order-last lg:min-h-[22rem] lg:flex-col lg:justify-center lg:gap-0 lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:text-center lg:backdrop-blur-none">
              <div className="skill-float shrink-0">
                {active.logo ? (
                  <img
                    key={active.logo}
                    src={active.logo}
                    alt=""
                    className="skill-logo size-20 object-contain lg:size-[clamp(8rem,14vw,17rem)]"
                  />
                ) : (
                  <span className="skill-logo grid size-20 place-items-center text-4xl font-bold tracking-tight lg:size-[clamp(8rem,14vw,17rem)] lg:text-[clamp(4rem,7vw,8rem)]">
                    {active.symbol}
                  </span>
                )}
              </div>

              <div className="min-w-0">
                <p className="skill-text text-base font-semibold lg:mt-6 lg:text-[clamp(1.1rem,1.5vw,1.75rem)]">
                  {active.name}
                </p>
                <p className="skill-text mt-1 text-[10px] uppercase tracking-[0.25em] text-neutral-500 lg:text-xs">
                  {active.category}
                </p>
                <p className="skill-text mt-2 text-sm text-neutral-600 lg:mx-auto lg:mt-4 lg:max-w-xs lg:text-base">
                  {active.note}
                </p>
              </div>
            </div>
          )}

          {/* Periodic table: har tile ka text tile ki apni width ke hisaab se scale hota hai */}
          <div className="skill-grid grid min-w-0 grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-8 xl:gap-3">
            {skills.map((s, i) => (
              <button
                key={s.name}
                type="button"
                onMouseEnter={() => setActiveName(s.name)}
                onFocus={() => setActiveName(s.name)}
                onClick={() => setActiveName(s.name)}
                className={`skill-tile @container flex aspect-square min-w-0 flex-col justify-between overflow-hidden rounded-xl p-2 text-left transition-[opacity,box-shadow,transform] lg:p-3 ${
                  family(s.category).tile
                } ${matches(s.category) ? 'opacity-100' : 'opacity-25'} ${
                  active?.name === s.name
                    ? '-translate-y-0.5 ring-2 ring-ink ring-offset-2 ring-offset-[#f9f6ef]'
                    : 'hover:-translate-y-0.5'
                }`}
              >
                <span className="text-[length:max(0.45rem,9cqw)] leading-none opacity-60">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-[length:max(1rem,33cqw)] font-bold leading-none tracking-tight">
                  {s.symbol}
                </span>
                <span className="text-[length:max(0.55rem,12cqw)] leading-tight opacity-80">
                  {s.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}