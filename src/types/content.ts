export interface WhatIDoItem {
  title: string
  description: string
}

export interface DetailItem {
  label: string
  value: string
}

export interface Profile {
  name: string
  roles: string[]
  tagline: string
  education: string
  about: string
  whatIDo: WhatIDoItem[]
  details: DetailItem[]
  quote: string
  email: string
  whatsapp: string
  github: string
  instagram: string
  linkedin: string
}

export interface Skill {
  name: string
  symbol: string
  category: string
  note: string
  logo?: string
}

export interface Project {
  id: string
  title: string
  shortDescription: string
  description: string
  highlights: string[]
  image: string
  github: string
  live: string
  technologies: string[]
  category: string
  status?: 'completed' | 'in-progress' | 'planned'
  featured: boolean
  order: number
}

export interface Now {
  title: string
  description: string
  technologies: string[]
  link: string
}

export type LearningStatus = 'learning' | 'exploring' | 'future'

export interface LearningItem {
  id: string
  title: string
  note: string
  status: LearningStatus
}

export interface EducationItem {
  id: string
  level: string
  title: string
  place: string
  detail: string
  score: string
  current: boolean
}

export interface Achievement {
  id: string
  title: string
  type: string
  description: string
  icon: 'award' | 'book' | 'certificate'
  stat?: string
}