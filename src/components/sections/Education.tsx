import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { education } from '../../lib/content'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function Education() {
  const wrap = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (reduced()) return
      gsap.from('.edu-reveal', {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: { trigger: wrap.current, start: 'top 70%' },
      })
      gsap.utils.toArray<HTMLElement>('.edu-row').forEach((el) => {
        gsap.from(el, {
          y: 50,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          clearProps: 'opacity,transform',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        })
      })
    },
    { scope: wrap },
  )

  return (
    <section
      id="education"
      ref={wrap}
      className="border-t border-black/5 bg-[linear-gradient(180deg,#faf8f2_0%,#f7f4ea_100%)]"
    >
      <div className="mx-auto max-w-[1800px] px-6 py-24 md:px-12 xl:px-[5vw]">
        <p className="edu-reveal flex items-center text-xs uppercase tracking-[0.3em] text-neutral-500">
          06
          <span className="mx-3 inline-block h-px w-10 bg-black/25" />
          Education
        </p>

        <h2 className="edu-reveal mt-6 text-[clamp(2.5rem,5.6vw,6.5rem)] font-bold leading-[1.02] tracking-tighter">
          Where I&apos;ve{' '}
          <span className="font-serif font-normal italic text-neutral-500">studied.</span>
        </h2>

        <p className="edu-reveal mt-5 max-w-xl text-neutral-600 xl:text-lg">
          From school in Chakwal to computer science at UET Taxila.
        </p>

        <ol className="mt-16">
          {education.map((e, i) => {
            const left = i % 2 === 0
            const big = e.current ? 'Now' : e.score
            const meta = [e.detail, e.place].filter(Boolean).join(' · ')
            return (
              <li
                key={e.id}
                className="edu-row grid gap-4 border-l border-black/15 pb-12 pl-6 md:grid-cols-[1fr_64px_1fr] md:items-center md:gap-0 md:border-0 md:pb-0 md:pl-0"
              >
                {/* Card */}
                <div
                  className={`rounded-3xl border border-black/10 bg-white/70 p-6 md:row-start-1 md:my-6 md:p-8 ${
                    left ? 'md:col-start-1' : 'md:col-start-3'
                  }`}
                >
                  <span className="inline-block rounded-full border border-black/10 bg-white/80 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-neutral-600">
                    {e.level}
                  </span>
                  <h3 className="mt-4 text-2xl font-bold tracking-tight xl:text-3xl">{e.title}</h3>
                  {meta && <p className="mt-1 text-neutral-500">{meta}</p>}

                  {(e.score || e.current) && (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {e.score && (
                        <span className="rounded-full border border-black/10 bg-white/80 px-3 py-1.5 text-xs">
                          Score <strong className="font-semibold">{e.score}</strong>
                        </span>
                      )}
                      {e.current && (
                        <span className="rounded-full bg-ink px-3 py-1.5 text-xs text-cream">
                          Currently studying
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Timeline line + dot (desktop) */}
                <div
                  aria-hidden="true"
                  className="relative hidden justify-center md:col-start-2 md:row-start-1 md:flex md:self-stretch"
                >
                  <span className="absolute inset-y-0 w-px bg-black/20" />
                  <span className="relative z-10 my-auto size-3 rounded-full bg-ink ring-4 ring-[#f9f6ef]" />
                </div>

                {/* Bada label */}
                <p
                  className={`order-first text-[clamp(3rem,6vw,7rem)] font-bold leading-none tracking-tighter md:order-none md:row-start-1 md:px-8 ${
                    left ? 'md:col-start-3 md:text-left' : 'md:col-start-1 md:text-right'
                  }`}
                >
                  {big}
                </p>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}