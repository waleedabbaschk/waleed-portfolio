import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { now } from '../../lib/content'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function NowWorking() {
  const wrap = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (reduced()) return
      gsap.from('.now-reveal', {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: { trigger: wrap.current, start: 'top 70%' },
      })
    },
    { scope: wrap },
  )

  // Title khali ho to poora section chhup jata hai
  if (!now.title) return null

  return (
    <section
      id="now"
      ref={wrap}
      className="border-t border-black/5 bg-[linear-gradient(180deg,#faf8f2_0%,#f7f4ea_100%)]"
    >
      <div className="mx-auto max-w-[1800px] px-6 py-24 md:px-12 xl:px-[5vw]">
        <p className="now-reveal flex items-center text-xs uppercase tracking-[0.3em] text-neutral-500">
          04
          <span className="mx-3 inline-block h-px w-10 bg-black/25" />
          Now
        </p>

        <h2 className="now-reveal mt-6 text-[clamp(2.5rem,5.6vw,6.5rem)] font-bold leading-[1.02] tracking-tighter">
          Currently{' '}
          <span className="font-serif font-normal italic">working on.</span>
        </h2>

        <div className="now-reveal mt-12 grid gap-8 rounded-3xl border border-black/10 bg-white/70 p-8 md:p-12 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/80 px-3 py-1.5 text-xs uppercase tracking-[0.2em]">
              <span aria-hidden="true" className="size-2 animate-pulse rounded-full bg-emerald-500" />
              In progress
            </span>

            <h3 className="mt-6 text-[clamp(2rem,3.6vw,4.5rem)] font-bold leading-none tracking-tight">
              {now.title}
            </h3>

            <p className="mt-5 max-w-2xl text-neutral-600 xl:text-lg">{now.description}</p>

            {now.technologies.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-2">
                {now.technologies.map((t) => (
                  <li
                    key={t}
                    className="rounded-full border border-black/10 bg-white/80 px-3 py-1.5 text-xs"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {now.link && (
            <a
              href={now.link}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-ink px-6 py-3 text-center text-sm font-medium text-cream transition hover:opacity-85"
            >
              View project &#8599;
            </a>
          )}
        </div>
      </div>
    </section>
  )
}