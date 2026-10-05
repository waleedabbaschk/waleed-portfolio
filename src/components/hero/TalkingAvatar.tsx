import { useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { createPortal } from 'react-dom'
import gsap from 'gsap'
import { voiceClock } from '../../lib/voiceClock'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const FRAME_COUNT = 192
const FPS = 24
const DURATION = FRAME_COUNT / FPS // 8 seconds
const HOLD_AT = 0.78 // itne scroll par intro 100% ho jata hai, baaki hero pinned rehta hai
const WIDTH = 221
const HEIGHT = 644
const frameSrc = (i: number) =>
  `/hero/desktop/frame-${String(i + 1).padStart(3, '0')}.webp`

type SoundState = 'locked' | 'on' | 'muted'

export default function TalkingAvatar({
  trigger,
}: {
  trigger: RefObject<HTMLElement | null>
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const toggleRef = useRef<() => void>(() => {})
  const [sound, setSound] = useState<SoundState>('locked')
  const [pinned, setPinned] = useState(true) // hero abhi pinned/dikh raha hai?
  const [canPlay, setCanPlay] = useState(true) // reduced-motion mein awaaz hi nahi

  useEffect(() => {
    const canvas = canvasRef.current
    const triggerEl = trigger.current
    const ctx2d = canvas?.getContext('2d')
    if (!canvas || !triggerEl || !ctx2d) return

    // ---------- Frames ----------
    const images: HTMLImageElement[] = []
    const loaded = new Array<boolean>(FRAME_COUNT).fill(false)
    let shown = -1
    let playhead = 0 // video ka current time (seconds)
    let progress = 0 // scroll progress 0..1
    let inView = true // hero screen par hai ya nahi

    const draw = () => {
      let i = Math.min(FRAME_COUNT - 1, Math.max(0, Math.floor(playhead * FPS)))
      while (i >= 0 && !loaded[i]) i--
      if (i < 0 || i === shown) return
      ctx2d.clearRect(0, 0, WIDTH, HEIGHT)
      ctx2d.drawImage(images[i], 0, 0, WIDTH, HEIGHT)
      shown = i
    }

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image()
      img.onload = () => {
        loaded[i] = true
        draw()
      }
      img.src = frameSrc(i)
      images.push(img)
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setSound('muted')
      setCanPlay(false)
      return
    }

    // ---------- Audio (Web Audio API) ----------
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    const actx = new AC()
    const master = actx.createGain()
    master.connect(actx.destination)

    let buffer: AudioBuffer | null = null
    let source: AudioBufferSourceNode | null = null
    let srcGain: GainNode | null = null
    let srcStartTime = 0
    let srcStartOffset = 0
    let muted = false
    let destroyed = false

    fetch('/media/intro.mp3')
      .then((r) => r.arrayBuffer())
      .then((b) => actx.decodeAudioData(b))
      .then((buf) => {
        if (!destroyed) buffer = buf
      })
      .catch(() => {})

    const startAudio = () => {
      if (!buffer || muted || actx.state !== 'running' || source) return
      const s = actx.createBufferSource()
      const g = actx.createGain()
      s.buffer = buffer
      s.connect(g)
      g.connect(master)
      g.gain.setValueAtTime(0, actx.currentTime)
      g.gain.linearRampToValueAtTime(1, actx.currentTime + 0.04)
      s.start(0, Math.min(playhead, buffer.duration - 0.01))
      srcStartTime = actx.currentTime
      srcStartOffset = playhead
      source = s
      srcGain = g
      s.onended = () => {
        if (source === s) {
          source = null
          srcGain = null
        }
      }
    }

    const stopAudio = () => {
      if (!source || !srcGain) return
      const s = source
      const g = srcGain
      source = null
      srcGain = null
      const t = actx.currentTime
      g.gain.cancelScheduledValues(t)
      g.gain.setValueAtTime(g.gain.value, t)
      g.gain.linearRampToValueAtTime(0, t + 0.06)
      try {
        s.stop(t + 0.07)
      } catch {
        /* already stopped */
      }
    }

    // ---------- Main loop ----------
    let raf = 0
    let last = performance.now()

    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000)
      last = now
      const target = progress * DURATION

      // Hero screen se bahar ho (jaise nav se jump) to awaaz fauran band
      if (!inView && source) stopAudio()

      const audible = !!buffer && !muted && actx.state === 'running' && inView

      if (source) {
        // Awaaz chal rahi hai: frame awaaz ki clock se sync hota hai
        playhead = Math.min(DURATION, srcStartOffset + (actx.currentTime - srcStartTime))
        if (playhead >= target - 0.02 || playhead >= DURATION) stopAudio()
      } else if (audible) {
        const gap = target - playhead
        if (gap > 0.15) startAudio()
        else if (gap < -0.02) playhead = Math.max(target, playhead - dt * 3)
      } else {
        // Awaaz band/locked: animation seedha scroll ko follow kare
        playhead += (target - playhead) * Math.min(1, dt * 10)
      }

      draw()
      voiceClock.emit(playhead)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    const st = ScrollTrigger.create({
      trigger: triggerEl,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        progress = Math.min(1, self.progress / HOLD_AT)
        setPinned(self.progress < 1)
      },
    })
    progress = Math.min(1, st.progress / HOLD_AT)
    setPinned(st.progress < 1)

    const vis = ScrollTrigger.create({
      trigger: triggerEl,
      start: 'top bottom',
      end: 'bottom top',
      onToggle: (self) => {
        inView = self.isActive
      },
    })
    inView = vis.isActive

    // ---------- Sound unlock / mute ----------
    const syncState = () =>
      setSound(actx.state === 'running' ? (muted ? 'muted' : 'on') : 'locked')

    actx.onstatechange = () => {
      if (!destroyed) syncState()
    }
    syncState()

    // Browser ijazat de (jaise pehle engage ho chuka visitor) to khud awaaz on karne ki koshish
    actx.resume().catch(() => {})

    const unlock = (e: Event) => {
      const el = e.target as Element | null
      if (el && el.closest && el.closest('[data-sound-toggle]')) return
      void actx.resume()
    }
    const events = ['pointerdown', 'keydown', 'touchend', 'click'] as const
    events.forEach((ev) => window.addEventListener(ev, unlock, { passive: true }))

    toggleRef.current = () => {
      if (actx.state !== 'running') {
        void actx.resume()
        return
      }
      muted = !muted
      master.gain.setTargetAtTime(muted ? 0 : 1, actx.currentTime, 0.02)
      if (muted) stopAudio()
      syncState()
    }

    return () => {
      destroyed = true
      cancelAnimationFrame(raf)
      st.kill()
      vis.kill()
      stopAudio()
      events.forEach((ev) => window.removeEventListener(ev, unlock))
      actx.onstatechange = null
      void actx.close()
    }
  }, [trigger])

  const label =
    sound === 'locked'
      ? '\u{1F50A} Tap to turn on sound'
      : sound === 'on'
        ? '\u{1F50A} Sound on - tap to mute'
        : '\u{1F507} Muted - tap to unmute'

  return (
    <div className="relative h-full w-full">
      <canvas
        ref={canvasRef}
        width={WIDTH}
        height={HEIGHT}
        role="img"
        aria-label="Animated 3D avatar of Waleed Abbas introducing himself as you scroll"
        className="h-full w-full"
      />
      {/* Portal: nav ke peeche na chhupe, aur kisi transform wale parent se fixed na bigre */}
      {canPlay &&
        pinned &&
        createPortal(
          <button
            type="button"
            data-sound-toggle
            onClick={() => toggleRef.current()}
            aria-pressed={sound === 'on'}
            className={`fixed left-6 top-20 z-10 max-w-[calc(100vw-3rem)] whitespace-nowrap rounded-full bg-ink px-4 py-2.5 text-xs font-medium text-cream shadow-lg transition hover:scale-105 md:bottom-8 md:left-12 md:top-auto ${
              sound === 'locked' ? 'animate-pulse' : ''
            }`}
          >
            {label}
          </button>,
          document.body,
        )}
    </div>
  )
}