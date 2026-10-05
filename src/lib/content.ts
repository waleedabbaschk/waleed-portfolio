import profileJson from '../../data/profile.json'
import skillsJson from '../../data/skills.json'
import projectsJson from '../../data/projects.json'
import nowJson from '../../data/now.json'
import learningJson from '../../data/learning.json'
import educationJson from '../../data/education.json'
import achievementsJson from '../../data/achievements.json'
import type {
  Profile,
  Skill,
  Project,
  Now,
  LearningItem,
  EducationItem,
  Achievement,
} from '../types/content'

export const profile: Profile = profileJson
export const skills: Skill[] = skillsJson
export const projects: Project[] = [...(projectsJson as Project[])].sort(
  (a, b) => a.order - b.order,
)
export const now: Now = nowJson
export const learning: LearningItem[] = learningJson as LearningItem[]
export const education: EducationItem[] = educationJson as EducationItem[]
export const achievements: Achievement[] = achievementsJson as Achievement[]