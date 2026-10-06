import { useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { projects } from '../../lib/content'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const pad = (n: number) => String(n).padStart(2, '0')
const initials = (title: string) =>
  title
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 3)
    .toUpperCase()

const STATUS = {
  completed: 'Completed',
  'in-progress': 'In progress',
  planned: 'Planned',
} as const

export default function Projects() {
  const wrap = useRef<HTMLElement>(null)
  const [open, setOpen] = useState(0)

  useGSAP(
    () => {
      if (reduced()) return
      gsap.from('.projects-reveal', {
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

  // Panel khulne par uska content ek ek karke aaye (sirf desktop par)
  useGSAP(
    () => {
      if (reduced() || !window.matchMedia('(min-width: 1024px)').matches) return
      gsap.fromTo(
        '.proj-open .proj-item',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.06, delay: 0.15, ease: 'power2.out' },
      )
    },
    { scope: wrap, dependencies: [open], revertOnUpdate: true },
  )

  return (
    <section
      id="work"
      ref={wrap}
      className="border-t border-black/5 bg-[linear-gradient(180deg,#f4ecc4_0%,#f6f0d4_60%,#f6f2e0_100%)]"
    >
      <div className="mx-auto max-w-[1800px] px-6 py-16 md:px-12 md:py-24 xl:px-[5vw]">
        <p className="projects-reveal flex items-center text-xs uppercase tracking-[0.3em] text-neutral-500">
          03
          <span className="mx-3 inline-block h-px w-10 bg-black/25" />
          Selected work
        </p>

        <h2 className="projects-reveal mt-6 text-[clamp(2.5rem,5.6vw,6.5rem)] font-bold leading-[1.02] tracking-tighter">
          Things I&apos;ve <span className="font-serif font-normal italic">built.</span>
        </h2>

        {projects.length > 1 && (
          <p className="projects-reveal mt-5 hidden max-w-xl text-neutral-600 md:block xl:text-lg">
            A few things I&apos;ve shipped. Hover or tap a panel to open it.
          </p>
        )}

        <div className="projects-reveal mt-12 flex flex-col gap-4 lg:h-[clamp(36rem,46vw,50rem)] lg:flex-row">
          {projects.map((p, i) => {
            const isOpen = open === i
            return (
              <article
                key={p.id}
                onMouseEnter={() => setOpen(i)}
                style={{ flexGrow: isOpen ? 12 : 1 }}
                className={`${
                  isOpen ? 'proj-open' : ''
                } relative overflow-hidden rounded-3xl border border-black/10 bg-white/70 transition-[flex-grow] duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] lg:min-w-24 lg:basis-0`}
              >
                {/* Band panel: patli strip */}
                <button
                  type="button"
                  onClick={() => setOpen(i)}
                  onFocus={() => setOpen(i)}
                  aria-label={`Open ${p.title}`}
                  className={`${
                    isOpen ? 'hidden' : 'hidden lg:flex'
                  } h-full w-full flex-col items-center justify-between px-2 py-6`}
                >
                  <span className="text-xs text-neutral-500">{pad(i + 1)}</span>
                  <span className="rotate-180 text-xl font-semibold tracking-tight [writing-mode:vertical-rl]">
                    {p.title}
                  </span>
                  <span
                    aria-hidden="true"
                    className="grid size-8 place-items-center rounded-full bg-ink text-lg leading-none text-cream"
                  >
                    +
                  </span>
                </button>

                {/* Khula panel */}
                <div className={`${isOpen ? 'block' : 'block lg:hidden'} p-4 sm:p-6 md:p-10 xl:p-12`}>
                  <div className="grid gap-5 md:gap-8 lg:min-w-[clamp(36rem,58vw,62rem)] lg:grid-cols-[1.1fr_1fr] xl:gap-12">
                    <div>
                      <p className="proj-item flex flex-wrap items-center gap-x-4 gap-y-2 text-xs uppercase tracking-[0.25em] text-neutral-500">
                        <span>{pad(i + 1)}</span>
                        <span>{p.category}</span>
                        {p.status && (
                          <span className="rounded-full border border-black/10 bg-white/70 px-3 py-1 tracking-[0.15em]">
                            {STATUS[p.status]}
                          </span>
                        )}
                      </p>

                      <h3 className="proj-item mt-5 text-[clamp(1.6rem,3.4vw,4rem)] font-bold leading-none tracking-tight">
                        {p.title}
                      </h3>

                      <p className="proj-item mt-3 max-w-xl text-sm text-neutral-600 md:mt-5 md:text-base xl:text-lg">
                        {p.description}
                      </p>

                      {p.highlights.length > 0 && (
                        <ul className="proj-item mt-6 hidden gap-x-8 gap-y-2 text-sm text-neutral-700 sm:grid-cols-2 md:grid xl:text-base">
                          {p.highlights.map((h) => (
                            <li key={h} className="flex items-start gap-2">
                              <span
                                aria-hidden="true"
                                className="mt-2 size-1.5 shrink-0 rounded-full bg-ink/60"
                              />
                              {h}
                            </li>
                          ))}
                        </ul>
                      )}

                      {p.technologies.length > 0 && (
                        <ul className="proj-item mt-6 flex flex-wrap gap-2">
                          {p.technologies.map((t) => (
                            <li
                              key={t}
                              className="rounded-full border border-black/10 bg-white/80 px-3 py-1.5 text-xs"
                            >
                              {t}
                            </li>
                          ))}
                        </ul>
                      )}

                      {(p.github || p.live) && (
                        <div className="proj-item mt-8 flex flex-wrap gap-3">
                          {p.github && (
                            <a
                              href={p.github}
                              target="_blank"
                              rel="noreferrer"
                              className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-cream transition hover:opacity-85"
                            >
                              View on GitHub &#8599;
                            </a>
                          )}
                          {p.live && (
                            <a
                              href={p.live}
                              target="_blank"
                              rel="noreferrer"
                              className="rounded-full border border-black/15 px-6 py-3 text-sm font-medium transition hover:border-ink"
                            >
                              Live site &#8599;
                            </a>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Visual: screenshot ya placeholder */}
                    <div className="proj-item relative order-first min-h-[10rem] overflow-hidden lg:order-none rounded-2xl border border-black/10 bg-[linear-gradient(135deg,#ece4cf,#f6f2e6)] lg:min-h-0">
                      {p.image ? (
                        <img
                          src={p.image}
                          alt={`${p.title} screenshot`}
                          loading="lazy"
                          className="relative mx-auto my-4 w-[calc(100%-2rem)] rounded-xl lg:absolute lg:left-5 lg:top-1/2 lg:m-0 lg:w-[calc(100%-2.5rem)] lg:-translate-y-1/2 border border-black/10 shadow-[0_25px_50px_-20px_rgba(18,18,31,0.45)]"
                        />
                      ) : (
                        <div
                          className="absolute inset-0 grid place-items-center"
                          style={{
                            backgroundImage:
                              'linear-gradient(rgba(18,18,31,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(18,18,31,0.06) 1px, transparent 1px)',
                            backgroundSize: '28px 28px',
                          }}
                        >
                          <span className="select-none text-[clamp(5rem,12vw,12rem)] font-extrabold leading-none tracking-tighter text-ink/10">
                            {initials(p.title)}
                          </span>
                          <span className="absolute bottom-4 left-4 text-[10px] uppercase tracking-[0.25em] text-neutral-500">
                            Screenshot coming soon
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}