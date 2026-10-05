// Google Analytics 4. Sirf live site par chalta hai (localhost par nahi).
// Apna Measurement ID neeche paste karo (jaise 'G-ABCD123456'). Khali ho to kuch nahi hota.
const GA_MEASUREMENT_ID = ''

type GtagWindow = Window & { dataLayer?: unknown[] }

export function initAnalytics() {
  if (!GA_MEASUREMENT_ID) return
  const { hostname } = window.location
  if (hostname === 'localhost' || hostname === '127.0.0.1') return
  if (document.getElementById('ga-script')) return

  const w = window as GtagWindow
  w.dataLayer = w.dataLayer || []

  // gtag.js ko "arguments" object chahiye (array nahi), isliye ye form zaroori hai
  function gtag(..._args: unknown[]) {
    // eslint-disable-next-line prefer-rest-params
    w.dataLayer!.push(arguments)
  }

  gtag('js', new Date())
  gtag('config', GA_MEASUREMENT_ID)

  const s = document.createElement('script')
  s.id = 'ga-script'
  s.async = true
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
  document.head.appendChild(s)
}
