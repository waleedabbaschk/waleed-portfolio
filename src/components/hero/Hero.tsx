import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import TalkingAvatar from './TalkingAvatar'
import VoiceCaptions from './VoiceCaptions'
import { profile } from '../../lib/content'

gsap.registerPlugin(useGSAP)

export default function Hero() {
  const wrap = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.from('.hero-name', { y: 60, opacity: 0, duration: 1.4, ease: 'power3.out' })
      gsap.from('.hero-avatar', { y: 40, opacity: 0, duration: 1.2, delay: 0.2, ease: 'power3.out' })
    },
    { scope: wrap },
  )

  return (
    <section id="top" ref={wrap} className="relative h-[250svh]">
      <div className="sticky top-0 h-svh min-h-[560px] overflow-hidden">
        <h1 className="hero-name pointer-events-none absolute inset-x-0 top-[16svh] select-none whitespace-nowrap text-center text-[10.5vw] font-extrabold uppercase leading-none tracking-tighter text-ink/[0.07]">
          {profile.name}
        </h1>

        <VoiceCaptions />
        <p className="sr-only">
          I am Waleed Abbas. Full stack developer and AI agent maker. I build agents, full websites, and apps.
        </p>

        <div className="absolute bottom-[2svh] left-1/2 z-10 aspect-[221/644] h-[50svh] -translate-x-1/2 md:bottom-[5svh] md:left-auto md:right-[9%] md:h-[80svh] md:translate-x-0">
          <div className="hero-avatar h-full w-full">
            <TalkingAvatar trigger={wrap} />
          </div>
        </div>
      </div>
    </section>
  )
}