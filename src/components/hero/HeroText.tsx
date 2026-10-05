import { profile } from '../../lib/content'
import IntroPlayer from './IntroPlayer'

export default function HeroText() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 px-6 pb-8 md:px-12 md:pb-12">
      <div className="hero-text pointer-events-auto max-w-[40rem]">
        <p className="mb-4 text-xs uppercase tracking-[0.2em] text-neutral-500 md:text-sm">
          {profile.education}
        </p>
        <h2 className="text-balance text-[clamp(2.5rem,6vw,5.5rem)] font-bold leading-[0.95] tracking-tight">
          {profile.roles[0]}
          <span className="font-serif italic">.</span>
        </h2>
        <p className="mt-4 text-base text-neutral-600 md:text-lg">
          {profile.roles.slice(1).join(' · ')}
        </p>
        <div>
          <IntroPlayer />
        </div>
      </div>
    </div>
  )
}