import { useEffect } from 'react'
import Nav from './components/ui/Nav'
import Hero from './components/hero/Hero'
import About from './components/sections/About'
import Skills from './components/sections/Skills'
import Projects from './components/sections/Projects'
import NowWorking from './components/sections/NowWorking'
import Learning from './components/sections/Learning'
import Education from './components/sections/Education'
import Achievements from './components/sections/Achievements'
import Contact from './components/sections/Contact'
import { useLenis } from './hooks/useLenis'
import { initAnalytics } from './lib/analytics'

export default function App() {
  useLenis()

  useEffect(() => {
    initAnalytics()
  }, [])

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <NowWorking />
        <Learning />
        <Education />
        <Achievements />
        <Contact />
      </main>
    </>
  )
}