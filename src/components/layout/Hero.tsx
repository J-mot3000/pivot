import type { Profile } from '../../types'

interface HeroProps {
  profile: Profile
}

export function Hero({ profile }: HeroProps) {
  return (
    <section className="hero">
      <div className="hero-content">
        <p className="eyebrow">{profile.title}</p>
        <h1>{profile.name}</h1>
        <p className="hero-summary">{profile.summary}</p>
        <div className="hero-meta">
          <span>{profile.location}</span>
          <span>{profile.email}</span>
          <span>{profile.phone}</span>
        </div>
        <div className="hero-actions">
          <a className="primary" href="#portfolio">
            View Work
          </a>
          <a className="ghost" href="#contact">
            Contact Me
          </a>
        </div>
      </div>
      <img className="hero-avatar" src={profile.avatarUrl} alt={profile.name} />
    </section>
  )
}
