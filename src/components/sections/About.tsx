import { useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { profile } from '../../lib/content'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Back of the ID card ("What I am"). Everything here comes from facts already on the site.
const backItems = [
  { title: profile.roles[0], note: 'React \u00b7 Node.js \u00b7 REST APIs' },
  { title: profile.roles[1], note: 'n8n \u00b7 AI APIs \u00b7 Agents' },
  { title: 'Cybersecurity learner', note: 'Ethical, lab-based only' },
  { title: 'CS student', note: profile.education },
  { title: 'Hafiz-e-Quran', note: 'Memorized the entire Quran' },
]

const CARD_SHADOW = 'shadow-[0_30px_60px_-30px_rgba(18,18,31,0.4)]'

export default function About() {
  const wrap = useRef<HTMLElement>(null)
  const card = useRef<HTMLDivElement>(null)
  const [flipped, setFlipped] = useState(false)

  const sway = () => {
    if (!card.current) return
    gsap.to(card.current, {
      rotation: 1.6,
      duration: 2.8,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    })
  }

  const kick = () => {
    if (!card.current || reduced()) return
    gsap.fromTo(
      card.current,
      { rotation: -7 },
      {
        rotation: 0,
        duration: 2,
        ease: 'elastic.out(1,0.3)',
        overwrite: 'auto',
        onComplete: sway,
      },
    )
  }

  useGSAP(
    () => {
      if (reduced()) return
      const el = card.current

      gsap.from('.about-reveal', {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.15,
        scrollTrigger: { trigger: wrap.current, start: 'top 60%' },
      })

      gsap
        .timeline({
          scrollTrigger: { trigger: wrap.current, start: 'top 60%', once: true },
          onComplete: sway,
        })
        .from(el, { y: -320, duration: 0.9, ease: 'power3.out' })
        .fromTo(el, { rotation: 12 }, { rotation: 0, duration: 2.4, ease: 'elastic.out(1,0.3)' }, 0.5)

      gsap.from('.do-card', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.15,
        scrollTrigger: { trigger: '.do-grid', start: 'top 85%', once: true },
      })

      return () => {
        gsap.killTweensOf(el)
      }
    },
    { scope: wrap },
  )

  const facts = [
    { label: 'ID No', value: 'WA-0001' },
    { label: 'Dept', value: 'Comp. Science' },
    { label: 'Focus', value: 'AI \u00b7 Web' },
  ]

  return (
    <section id="about" ref={wrap} className="relative overflow-hidden bg-[linear-gradient(180deg,#f4ecc4_0%,#f6f0d4_60%,#f6f2e0_100%)]">
      <div className="mx-auto max-w-[1800px] px-6 pb-24 pt-24 md:px-12 xl:px-[5vw]">
        <div className="grid items-start gap-14 lg:grid-cols-[1.2fr_320px_0.8fr] lg:gap-10 xl:grid-cols-[1.2fr_360px_0.8fr] xl:gap-[4vw]">
          {/* Left */}
          <div className="about-reveal lg:pt-32">
            <p className="flex items-center text-xs uppercase tracking-[0.3em] text-neutral-500">
              01
              <span className="mx-3 inline-block h-px w-10 bg-black/25" />
              About
            </p>
            <h2 className="mt-6 text-[clamp(2.5rem,4.4vw,5rem)] font-bold leading-none tracking-tighter">
              Hi, I&apos;m <span className="font-serif font-normal italic">Waleed.</span>
            </h2>
            <p className="mt-8 max-w-lg text-base leading-relaxed text-neutral-600 xl:text-lg">
              {profile.about}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <a
                href="#contact"
                className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-cream transition hover:opacity-85"
              >
                Let&apos;s talk &rarr;
              </a>
              {profile.github && (
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-neutral-700 transition hover:text-ink"
                >
                  GitHub &#8599;
                </a>
              )}
              {profile.linkedin && (
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-neutral-700 transition hover:text-ink"
                >
                  LinkedIn &#8599;
                </a>
              )}
            </div>
          </div>

          {/* Center: lanyard + ID card */}
          <div className="order-first -mt-24 flex justify-center lg:order-none">
            <div ref={card} onMouseEnter={kick} className="relative w-full max-w-[300px] origin-top xl:max-w-[340px]">
              {/* Ribbon */}
              <div
                aria-hidden="true"
                className="relative mx-auto flex h-[150px] w-6 select-none justify-center bg-ink"
              >
                <div className="absolute bottom-full left-0 h-24 w-full bg-ink" />
                <div className="absolute inset-0 flex justify-center overflow-hidden">
                  <span className="block whitespace-nowrap text-[7px] font-semibold uppercase leading-6 tracking-[0.35em] text-cream/55 [writing-mode:vertical-rl]">
                    {'WALEED \u00b7 '.repeat(12)}
                  </span>
                </div>
                <div className="absolute inset-y-0 left-[3px] w-px bg-cream/30" />
                <div className="absolute inset-y-0 right-[3px] w-px bg-cream/30" />
              </div>

              {/* Beige clip */}
              <svg
                viewBox="0 0 44 46"
                aria-hidden="true"
                className="relative z-10 mx-auto -mb-6 -mt-1 block h-11 w-11"
              >
                <defs>
                  <linearGradient id="clipTan" x1="0" x2="1" y1="0" y2="0">
                    <stop offset="0" stopColor="#c9bb9a" />
                    <stop offset="0.5" stopColor="#eadfc4" />
                    <stop offset="1" stopColor="#b9aa88" />
                  </linearGradient>
                </defs>
                <rect
                  x="8"
                  y="0"
                  width="28"
                  height="30"
                  rx="6"
                  fill="url(#clipTan)"
                  stroke="#12121f"
                  strokeOpacity="0.3"
                />
                <rect x="14" y="7" width="16" height="4" rx="2" fill="#12121f" fillOpacity="0.55" />
                <rect x="16" y="29" width="12" height="15" rx="4" fill="url(#clipTan)" />
              </svg>

              {/* Card: flips on hover (mouse), tap (touch) or Enter/Space (keyboard).
                  The hover area is this fixed-size box, so it does not flicker while the card turns. */}
              <div
                role="button"
                tabIndex={0}
                aria-pressed={flipped}
                aria-label="Developer ID card. Hover, tap, or press Enter to flip it."
                className={`id-scene ${flipped ? 'id-flipped' : ''}`}
                onPointerEnter={(e) => {
                  if (e.pointerType === 'mouse') setFlipped(true)
                }}
                onPointerLeave={(e) => {
                  if (e.pointerType === 'mouse') setFlipped(false)
                }}
                onPointerUp={(e) => {
                  if (e.pointerType !== 'mouse') setFlipped((f) => !f)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setFlipped((f) => !f)
                  }
                }}
              >
                <div className="id-flip relative">
                  {/* Front */}
                  <div
                    aria-hidden={flipped}
                    className={`id-face overflow-hidden rounded-2xl border border-black/10 bg-[#fbfaf6] ${CARD_SHADOW}`}
                  >
                    <div className="flex items-center gap-3 bg-ink px-5 pb-4 pt-8 text-cream">
                      <span className="grid size-8 place-items-center rounded-full border border-cream/30 text-[10px] font-semibold">
                        WA
                      </span>
                      <div className="leading-tight">
                        <p className="text-xs font-bold uppercase tracking-[0.18em]">Developer ID</p>
                        <p className="mt-0.5 text-[10px] text-cream/60">UET Taxila</p>
                      </div>
                    </div>

                    <div className="px-6 pb-5 pt-5">
                      <div className="mx-auto w-[68%] rounded-2xl border border-black/20 p-1.5">
                        <div className="aspect-[4/5] overflow-hidden rounded-xl bg-[#e9e2d0]">
                          <img
                            src="/hero/photo-hero.jpg" loading="lazy" decoding="async"
                            alt="Portrait of Waleed Abbas"
                            className="h-full w-full object-cover object-top"
                          />
                        </div>
                      </div>

                      <p className="mt-4 text-center text-sm font-bold uppercase tracking-[0.14em]">
                        {profile.name}
                      </p>
                      <p className="mt-0.5 text-center text-[11px] text-neutral-500">{profile.roles[0]}</p>

                      <dl className="mt-5 grid grid-cols-3 gap-2 border-t border-black/10 pt-4">
                        {facts.map((f) => (
                          <div key={f.label}>
                            <dt className="text-[8px] uppercase tracking-[0.2em] text-neutral-400">
                              {f.label}
                            </dt>
                            <dd className="mt-0.5 text-[11px] font-semibold leading-tight">{f.value}</dd>
                          </div>
                        ))}
                      </dl>

                      <div className="mt-5 flex items-end justify-between gap-4">
                        <div
                          aria-hidden="true"
                          className="h-7 flex-1 rounded-sm opacity-70"
                          style={{
                            backgroundImage:
                              'repeating-linear-gradient(90deg, #12121f 0 2px, transparent 2px 5px, #12121f 5px 6px, transparent 6px 10px)',
                          }}
                        />
                        <span
                          aria-hidden="true"
                          className="size-5 shrink-0 rounded-full border-2 border-black/20"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Back */}
                  <div
                    aria-hidden={!flipped}
                    className={`id-face id-back absolute inset-0 flex flex-col overflow-hidden rounded-2xl border border-black/10 bg-[#fbfaf6] px-6 pb-6 pt-5 ${CARD_SHADOW}`}
                  >
                    <span
                      aria-hidden="true"
                      className="mx-auto h-2.5 w-14 shrink-0 rounded-full border border-black/10 bg-[#e9e2d0]"
                    />
                    <p className="mt-6 text-xl font-bold tracking-tight">What I am</p>

                    <ul className="mt-4 space-y-3.5">
                      {backItems.map((item) => (
                        <li key={item.title} className="flex items-start gap-3">
                          <span
                            aria-hidden="true"
                            className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-ink text-cream"
                          >
                            <svg
                              viewBox="0 0 12 12"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="size-3"
                            >
                              <path d="m2.5 6.2 2.2 2.2 4.8-4.9" />
                            </svg>
                          </span>
                          <div className="min-w-0 leading-tight">
                            <p className="text-sm font-semibold">{item.title}</p>
                            <p className="mt-0.5 text-[11px] text-neutral-500">{item.note}</p>
                          </div>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-auto pt-6">
                      <p className="font-serif text-4xl italic leading-none">Waleed</p>
                      <p className="mt-2 break-all font-mono text-[9px] tracking-wide text-neutral-400">
                        {profile.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-center text-[10px] uppercase tracking-[0.25em] text-neutral-400">
                Hover or tap to flip
              </p>
            </div>
          </div>

          {/* Right */}
          <div className="about-reveal lg:pt-32">
            <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Quick facts</p>
            <dl className="mt-4 divide-y divide-black/10 border-y border-black/10">
              {profile.details.map((d) => (
                <div key={d.label} className="flex justify-between gap-6 py-3.5">
                  <dt className="text-sm text-neutral-500">{d.label}</dt>
                  <dd className="text-right text-sm font-medium xl:text-base">{d.value}</dd>
                </div>
              ))}
            </dl>
            <blockquote className="mt-8 font-serif text-2xl italic leading-snug text-neutral-600 xl:text-3xl">
              &ldquo;{profile.quote}&rdquo;
            </blockquote>
          </div>
        </div>

        {/* What I do */}
        <div className="mt-24">
          <h3 className="about-reveal font-serif text-4xl italic">What I do</h3>
          <ul className="do-grid mt-8 grid gap-6 md:grid-cols-3">
            {profile.whatIDo.map((item, i) => (
              <li
                key={item.title}
                className="do-card rounded-2xl border border-black/10 bg-white/60 p-8 xl:p-10"
              >
                <p className="font-serif text-3xl italic text-neutral-400">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <p className="mt-6 text-xl font-semibold xl:text-2xl">{item.title}</p>
                <p className="mt-3 text-base text-neutral-600 xl:text-lg">{item.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}