import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { profile } from '../../lib/content'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// 03xx... -> 923xx... (wa.me ko international format chahiye)
const waLink = (n: string) =>
  `https://wa.me/92${n.replace(/\D/g, '').replace(/^0/, '')}?text=${encodeURIComponent(
    'Hi Waleed, I saw your portfolio.',
  )}`
const handle = (url: string) => url.replace(/\/+$/, '').split('/').pop() ?? url

type Row = { label: string; value: string; href: string }

function buildRows(): Row[] {
  const rows: Row[] = []
  if (profile.whatsapp)
    rows.push({ label: 'WhatsApp', value: profile.whatsapp, href: waLink(profile.whatsapp) })
  if (profile.email)
    rows.push({ label: 'Email', value: profile.email, href: `mailto:${profile.email}` })
  if (profile.github)
    rows.push({ label: 'GitHub', value: `@${handle(profile.github)}`, href: profile.github })
  if (profile.instagram)
    rows.push({
      label: 'Instagram',
      value: `@${handle(profile.instagram)}`,
      href: profile.instagram,
    })
  if (profile.linkedin)
    rows.push({ label: 'LinkedIn', value: 'View profile', href: profile.linkedin })
  return rows
}

export default function Contact() {
  const wrap = useRef<HTMLElement>(null)
  const rows = buildRows()

  useGSAP(
    () => {
      if (reduced()) return
      gsap.from('.contact-reveal', {
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

  return (
    <section
      id="contact"
      ref={wrap}
      className="border-t border-black/5 bg-[linear-gradient(180deg,#faf8f2_0%,#f7f4ea_100%)]"
    >
      <div className="mx-auto max-w-[1800px] px-6 pt-16 md:px-12 md:pt-24 xl:px-[5vw]">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] xl:gap-[5vw]">
          <div>
            <p className="contact-reveal flex items-center text-xs uppercase tracking-[0.3em] text-neutral-500">
              08
              <span className="mx-3 inline-block h-px w-10 bg-black/25" />
              Contact
            </p>

            <h2 className="contact-reveal mt-6 text-[clamp(2.5rem,5.6vw,6.5rem)] font-bold leading-[0.98] tracking-tighter">
              Let&apos;s build
              <br />
              <span className="font-serif font-normal italic text-neutral-500">something.</span>
            </h2>

            <p className="contact-reveal mt-6 max-w-md text-neutral-600 xl:text-lg">
              Have a project, an idea, or an opportunity? Send me a message on WhatsApp or email,
              and let&apos;s talk.
            </p>

            <div className="contact-reveal mt-8 flex flex-wrap gap-3">
              {profile.whatsapp && (
                <a
                  href={waLink(profile.whatsapp)}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-cream transition hover:opacity-85"
                >
                  Message on WhatsApp &#8599;
                </a>
              )}
              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="rounded-full border border-black/15 px-6 py-3 text-sm font-medium transition hover:border-ink"
                >
                  Send an email
                </a>
              )}
            </div>
          </div>

          <ul className="contact-reveal self-center">
            {rows.map((r) => (
              <li key={r.label}>
                <a
                  href={r.href}
                  target={r.href.startsWith('mailto:') ? undefined : '_blank'}
                  rel="noreferrer"
                  className="group flex items-center justify-between gap-6 rounded-xl border-b border-black/10 px-4 py-5 transition-colors duration-300 hover:bg-ink hover:text-cream md:px-6 xl:py-6"
                >
                  <span className="text-xs uppercase tracking-[0.2em] text-neutral-500 transition-colors duration-300 group-hover:text-cream/60">
                    {r.label}
                  </span>
                  <span className="min-w-0 break-all text-right text-base font-semibold tracking-tight md:text-lg xl:text-2xl">
                    {r.value}
                    <span aria-hidden="true" className="ml-3 inline-block opacity-60">
                      &#8599;
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <footer className="mt-24 flex flex-wrap items-center justify-between gap-4 border-t border-black/10 pb-24 pt-8 text-sm text-neutral-500">
          <p>
            &copy; {new Date().getFullYear()} {profile.name}
          </p>
          <a href="#top" className="transition hover:text-ink">
            Back to top &uarr;
          </a>
        </footer>
      </div>
    </section>
  )
}