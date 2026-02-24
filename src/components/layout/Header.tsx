import type { Profile } from '../../types'

interface HeaderProps {
  profile: Profile
}

export function Header({ profile }: HeaderProps) {
  return (
    <header className="nav">
      <div className="brand">
        <span className="brand-dot" />
        <span>{profile.name}</span>
      </div>
      <nav className="nav-links">
        <a href="#resume">Resume</a>
        <a href="#portfolio">Portfolio</a>
        <a href="#contact">Contact</a>
        <a href="#admin">Admin</a>
      </nav>
    </header>
  )
}
