type Listener = (t: number) => void

const listeners = new Set<Listener>()
let current = 0

// Intro ka total time (seconds). TalkingAvatar.tsx ke DURATION (192 frames / 24 fps) ke barabar
export const INTRO_DURATION = 8

// Avatar ka current time (seconds) yahan aata hai, captions yahan se sunte hain
export const voiceClock = {
  emit(t: number) {
    if (t === current) return
    current = t
    listeners.forEach((fn) => fn(t))
  },
  get() {
    return current
  },
  subscribe(fn: Listener) {
    listeners.add(fn)
    fn(current)
    return () => {
      listeners.delete(fn)
    }
  },
}