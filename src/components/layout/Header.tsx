import type { Profile } from '../../types'

interface HeaderProps {
  profile: Profile
  isAuthenticated?: boolean
  onLoginClick?: () => void
}

export function Header({ profile, isAuthenticated, onLoginClick }: HeaderProps) {
  const handleBrandDoubleClick = () => {
    onLoginClick?.()
  }

  return (
    <header className="nav">
      <div className="brand" onDoubleClick={handleBrandDoubleClick}>
        <span className="brand-dot" />
        <span>{profile.name}</span>
      </div>
      <nav className="nav-links">
        <a href="#resume">Resume</a>
        <a href="#portfolio">Portfolio</a>
        <a href="#contact">Contact</a>
        {isAuthenticated && <a href="#admin">Admin</a>}
      </nav>
    </header>
  )
}
