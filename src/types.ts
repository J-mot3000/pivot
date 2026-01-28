export type Profile = {
  name: string
  title: string
  location: string
  email: string
  phone: string
  website: string
  summary: string
  avatarUrl: string
}

export type Experience = {
  id: string
  role: string
  company: string
  location: string
  start: string
  end: string
  summary: string
  highlights: string[]
}

export type Education = {
  id: string
  school: string
  degree: string
  start: string
  end: string
  details: string
}

export type Resume = {
  headline: string
  summary: string
  skills: string[]
  experience: Experience[]
  education: Education[]
  certifications: string[]
}

export type PortfolioItem = {
  id: string
  title: string
  description: string
  tags: string[]
  imageUrl: string
  liveUrl: string
  repoUrl: string
}

export type ContactInfo = {
  email: string
  phone: string
  location: string
  availability: string
  formAction: string
}

export type SiteData = {
  profile: Profile
  resume: Resume
  portfolio: PortfolioItem[]
  contact: ContactInfo
}
