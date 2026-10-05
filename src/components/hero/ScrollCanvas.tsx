import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const FRAME_COUNT = 192
const WIDTH = 221
const HEIGHT = 644
const frameSrc = (i: number) =>
  `/hero/desktop/frame-${String(i + 1).padStart(3, '0')}.webp`

export default function ScrollCanvas({
  trigger,
}: {
  trigger: RefObject<HTMLElement | null>
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const triggerEl = trigger.current
    if (!canvas || !triggerEl) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const images: HTMLImageElement[] = []
    const loaded: boolean[] = new Array(FRAME_COUNT).fill(false)
    const state = { frame: 0 }
    let shown = -1

    // Jo frame abhi tak load hua hai, uske sabse nazdeek wala dikhao
    const render = () => {
      let i = Math.round(state.frame)
      while (i >= 0 && !loaded[i]) i--
      if (i < 0 || i === shown) return
      ctx.clearRect(0, 0, WIDTH, HEIGHT)
      ctx.drawImage(images[i], 0, 0, WIDTH, HEIGHT)
      shown = i
    }

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image()
      img.onload = () => {
        loaded[i] = true
        render()
      }
      img.src = frameSrc(i)
      images.push(img)
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const gsapCtx = gsap.context(() => {
      gsap.to(state, {
        frame: FRAME_COUNT - 1,
        ease: 'none',
        onUpdate: render,
        scrollTrigger: {
          trigger: triggerEl,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.4,
        },
      })
    })

    return () => gsapCtx.revert()
  }, [trigger])

  return (
    <canvas
      ref={canvasRef}
      width={WIDTH}
      height={HEIGHT}
      role="img"
      aria-label="Animated 3D avatar of Waleed Abbas"
      className="h-full w-full"
    />
  )
}