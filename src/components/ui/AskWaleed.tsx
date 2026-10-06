import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'

type Msg = { role: 'user' | 'assistant'; content: string }

// Same limits as api/chat.ts
const MAX_CHARS = 400
const KEEP_MESSAGES = 6

const SUGGESTIONS = [
  'What has Waleed built?',
  'What is he learning right now?',
  'How can I contact him?',
]

export default function AskWaleed() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  // Escape closes the panel and gives focus back to the button
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // Focus the input on open (desktop only: on phones it would pop the keyboard at once)
  useEffect(() => {
    if (open && window.matchMedia('(min-width: 768px)').matches) inputRef.current?.focus()
  }, [open])

  // Keep the newest message in view
  useEffect(() => {
    const el = listRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, loading, error, open])

  // Cancel a pending request if the component goes away
  useEffect(() => () => abortRef.current?.abort(), [])

  const send = async (text: string) => {
    const content = text.trim().slice(0, MAX_CHARS)
    if (!content || loading) return

    const next: Msg[] = [...messages, { role: 'user', content }]
    setMessages(next)
    setInput('')
    setError('')
    setLoading(true)

    const ctrl = new AbortController()
    abortRef.current = ctrl
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ messages: next.slice(-KEEP_MESSAGES) }),
        signal: ctrl.signal,
      })
      const data = (await res.json().catch(() => null)) as { reply?: string; error?: string } | null
      if (!res.ok || !data?.reply) {
        setError(data?.error ?? 'Something went wrong. Please try again.')
        return
      }
      setMessages([...next, { role: 'assistant', content: data.reply }])
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return
      setError('Could not reach the assistant. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    void send(input)
  }

  return (
    <>
      {open && (
        <div
          id="ask-waleed-panel"
          role="dialog"
          aria-label="Ask Waleed, AI assistant"
          className="chat-pop fixed inset-x-4 bottom-[4.5rem] z-[15] flex h-[min(32rem,calc(100svh-11rem))] flex-col overflow-hidden rounded-3xl border border-black/10 bg-[#fbfaf6] shadow-[0_30px_60px_-30px_rgba(18,18,31,0.4)] md:inset-x-auto md:bottom-24 md:right-12 md:w-[26rem]"
        >
          {/* Header */}
          <div className="flex items-center gap-3 bg-ink px-5 py-4 text-cream">
            <span
              aria-hidden="true"
              className="grid size-9 shrink-0 place-items-center rounded-full border border-cream/30 text-[10px] font-semibold"
            >
              WA
            </span>
            <div className="min-w-0 flex-1 leading-tight">
              <p className="text-base font-bold tracking-tight">
                Ask <span className="font-serif font-normal italic">Waleed</span>
              </p>
              <p className="mt-0.5 text-[11px] text-cream/60">
                AI assistant. Answers may be imperfect.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setOpen(false)
                buttonRef.current?.focus()
              }}
              aria-label="Close chat"
              className="grid size-8 shrink-0 place-items-center rounded-full border border-cream/30 text-lg leading-none transition hover:bg-cream hover:text-ink"
            >
              &times;
            </button>
          </div>

          {/* Messages (data-lenis-prevent: the mouse wheel scrolls this box, not the page) */}
          <div
            ref={listRef}
            data-lenis-prevent
            role="log"
            aria-live="polite"
            aria-label="Conversation"
            className="flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4"
          >
            {messages.length === 0 && (
              <div>
                <p className="text-sm text-neutral-600">
                  Hi! Ask me about Waleed&apos;s projects, skills, studies or what he is learning.
                </p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {SUGGESTIONS.map((s) => (
                    <li key={s}>
                      <button
                        type="button"
                        onClick={() => void send(s)}
                        disabled={loading}
                        className="rounded-full border border-black/10 bg-white/80 px-3 py-1.5 text-xs transition hover:border-ink disabled:opacity-50"
                      >
                        {s}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <p
                  className={`max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-ink text-cream'
                      : 'border border-black/10 bg-white/80 text-ink'
                  }`}
                >
                  {m.content}
                </p>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <p className="rounded-2xl border border-black/10 bg-white/80 px-4 py-2.5 text-sm text-neutral-500">
                  <span className="animate-pulse motion-reduce:animate-none">Thinking&hellip;</span>
                </p>
              </div>
            )}

            {error && (
              <p
                role="alert"
                className="rounded-2xl border border-black/10 bg-[#f3ece4] px-4 py-2.5 text-sm text-neutral-700"
              >
                {error}
              </p>
            )}
          </div>

          {/* Input */}
          <form onSubmit={onSubmit} className="flex items-center gap-2 border-t border-black/10 p-3">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={MAX_CHARS}
              placeholder="Ask a question..."
              aria-label="Your question"
              autoComplete="off"
              className="min-w-0 flex-1 rounded-full border border-black/10 bg-white px-4 py-2.5 text-base outline-none transition focus:border-ink md:text-sm"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-cream transition hover:opacity-85 disabled:opacity-40"
            >
              Send
            </button>
          </form>
        </div>
      )}

      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="ask-waleed-panel"
        className="fixed bottom-4 right-4 z-[15] inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-xs font-medium text-cream shadow-lg transition hover:scale-105 md:bottom-8 md:right-12"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="size-4"
        >
          <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z" />
        </svg>
        {open ? 'Close' : 'Ask Waleed'}
      </button>
    </>
  )
}