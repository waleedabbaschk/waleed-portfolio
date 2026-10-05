import { useEffect, useState } from 'react'
import { profile } from '../../lib/content'

const links: [string, string][] = [
  ['About', '#about'],
  ['Skills', '#skills'],
  ['Work', '#work'],
  ['Learning', '#learning'],
  ['Education', '#education'],
  ['Awards', '#achievements'],
  ['Contact', '#contact'],
]

// Section id -> nav link ka id (Now section "Work" ke under aata hai)
const SECTION_TO_LINK: Record<string, string> = {
  about: 'about',
  skills: 'skills',
  work: 'work',
  now: 'work',
  learning: 'learning',
  education: 'education',
  achievements: 'achievements',
  contact: 'contact',
}

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')

  // Jo section screen ke beech (40%) mein ho, uska link highlight
  useEffect(() => {
    let raf = 0
    const compute = () => {
      raf = 0
      const line = window.innerHeight * 0.4
      let found = ''
      for (const id of Object.keys(SECTION_TO_LINK)) {
        const el = document.getElementById(id)
        if (!el) continue
        const r = el.getBoundingClientRect()
        if (r.top <= line && r.bottom > line) {
          found = SECTION_TO_LINK[id]
          break
        }
      }
      setActive(found)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(compute)
    }
    compute()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  // Menu khula ho to page scroll band, Escape se band, badi screen par khud band
  useEffect(() => {
    if (!open) return
    const html = document.documentElement
    const prev = html.style.overflow
    html.style.overflow = 'hidden'

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    const mq = window.matchMedia('(min-width: 768px)')
    const onMq = () => {
      if (mq.matches) setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    mq.addEventListener('change', onMq)

    return () => {
      html.style.overflow = prev
      window.removeEventListener('keydown', onKey)
      mq.removeEventListener('change', onMq)
    }
  }, [open])

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-30 flex items-center justify-between px-6 py-5 md:px-12">
        <a
          href="#top"
          onClick={() => setOpen(false)}
          aria-label="Waleed Abbas - home"
          className="grid size-10 place-items-center rounded-full bg-ink text-sm font-semibold text-cream"
        >
          WA
        </a>

        <nav
          aria-label="Primary"
          className="hidden gap-0.5 rounded-full border border-black/10 bg-white/50 p-1 backdrop-blur md:flex"
        >
          {links.map(([label, href]) => {
            const isActive = active === href.slice(1)
            return (
              <a
                key={href}
                href={href}
                aria-current={isActive ? 'true' : undefined}
                className={`rounded-full px-3 py-2 text-sm transition lg:px-4 ${
                  isActive
                    ? 'bg-ink text-white'
                    : 'text-neutral-700 hover:bg-ink hover:text-white'
                }`}
              >
                {label}
              </a>
            )
          })}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="grid size-10 place-items-center rounded-full border border-black/10 bg-white/60 text-ink backdrop-blur md:hidden"
        >
          <span className="relative block h-3.5 w-5" aria-hidden="true">
            <span
              className={`absolute left-0 h-0.5 w-full bg-current transition-all duration-300 ${
                open ? 'top-1.5 rotate-45' : 'top-0'
              }`}
            />
            <span
              className={`absolute left-0 h-0.5 w-full bg-current transition-all duration-300 ${
                open ? 'top-1.5 -rotate-45' : 'top-3'
              }`}
            />
          </span>
        </button>
      </header>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 z-20 flex flex-col justify-between overflow-y-auto bg-cream px-6 pb-10 pt-24 transition-[opacity,visibility] duration-300 md:hidden ${
          open ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      >
        <ul>
          {links.map(([label, href], i) => (
            <li key={href} className="border-b border-black/10">
              <a
                href={href}
                onClick={() => setOpen(false)}
                className="flex items-baseline justify-between py-3.5 text-3xl font-bold tracking-tight"
              >
                <span>{label}</span>
                <span className="font-serif text-lg font-normal italic text-neutral-400">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-8 text-sm text-neutral-500">
          <p className="text-xs uppercase tracking-[0.25em]">Say hi</p>
          <p className="mt-2 break-all text-base text-ink">{profile.email}</p>
        </div>
      </div>
    </>
  )
}