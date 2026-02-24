import type { Profile, Resume, PortfolioItem } from '../types'
import { Hero } from '../components/layout/Hero'
import { ResumeSection } from '../components/resume/ResumeSection'
import { PortfolioSection } from '../components/portfolio/PortfolioSection'
import { ContactSection } from '../components/contact/ContactSection'
import type { ContactInfo } from '../types'

interface HomePageProps {
  profile: Profile
  resume: Resume
  portfolio: PortfolioItem[]
  contact: ContactInfo
}

export function HomePage({ profile, resume, portfolio, contact }: HomePageProps) {
  return (
    <main>
      <Hero profile={profile} />
      <ResumeSection resume={resume} />
      <PortfolioSection portfolio={portfolio} />
      <ContactSection contact={contact} />
    </main>
  )
}
