import { useEffect, useRef, useState } from 'react'

// Dhyan: yeh text check kar lena ke video mein asal mein yehi bola gaya hai
const TRANSCRIPT =
  'I am Waleed Abbas. Full stack developer and AI agent maker. I build agents, full websites, and apps.'

export default function IntroPlayer() {
  const [open, setOpen] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    videoRef.current?.play().catch(() => {})
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="mt-8 inline-flex items-center gap-3 rounded-full bg-ink py-3 pl-3 pr-6 text-sm font-medium text-cream transition hover:scale-[1.03]"
      >
        <span className="grid size-8 place-items-center rounded-full bg-cream text-xs text-ink">
          ▶
        </span>
        Hear intro
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Video introduction"
          className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-3xl overflow-hidden rounded-2xl bg-cream shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              ref={videoRef}
              src="/media/intro.mp4"
              controls
              playsInline
              className="aspect-video w-full"
            />
            <p className="px-6 pt-4 text-center text-neutral-700">{TRANSCRIPT}</p>
            <div className="flex justify-center p-4">
              <button
                onClick={() => setOpen(false)}
                className="rounded-full border border-black/15 px-5 py-2 text-sm hover:bg-black/5"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}