import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { voiceClock, INTRO_DURATION } from '../lib/voiceClock'

gsap.registerPlugin(ScrollTrigger)

export function useLenis() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({ lerp: 0.1, anchors: true })
    lenis.on('scroll', ScrollTrigger.update)

    // Hero ke aakhir ka scroll position (jahan About shuru hota hai)
    const heroEnd = () => {
      const hero = document.getElementById('top')
      if (!hero) return Infinity
      return (
        hero.getBoundingClientRect().top +
        window.scrollY +
        hero.offsetHeight -
        window.innerHeight
      )
    }

    let last = lenis.scroll
    let bypassUntil = 0

    // Nav ya kisi bhi # link par click = jaan-boojh kar jump, gate na roke
    const onClick = (e: MouseEvent) => {
      const target = e.target as Element | null
      if (target?.closest('a[href^="#"]')) bypassUntil = performance.now() + 3000
    }
    document.addEventListener('click', onClick)

    const tick = (time: number) => {
      lenis.raf(time * 1000)

      // Scroll gate: neeche jaate waqt, intro poora hone tak hero ke aakhir par roko
      const introDone =
        voiceClock.get() >= INTRO_DURATION - 0.05 || performance.now() < bypassUntil
      const end = heroEnd()
      if (!introDone && last <= end + 1 && lenis.scroll > end) {
        lenis.scrollTo(end, { immediate: true, force: true })
      }
      last = lenis.scroll
    }

    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      document.removeEventListener('click', onClick)
      gsap.ticker.remove(tick)
      lenis.destroy()
    }
  }, [])
}