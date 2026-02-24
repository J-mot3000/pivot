import type { PortfolioItem } from '../../types'
import { PortfolioCard } from './PortfolioCard'

interface PortfolioSectionProps {
  portfolio: PortfolioItem[]
}

export function PortfolioSection({ portfolio }: PortfolioSectionProps) {
  return (
    <section id="portfolio" className="section">
      <div className="section-header">
        <div>
          <p className="eyebrow">Portfolio</p>
          <h2>Selected Work</h2>
        </div>
        <span className="muted">SERN + TypeScript builds</span>
      </div>
      <div className="portfolio-grid">
        {portfolio.map((item) => (
          <PortfolioCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  )
}
