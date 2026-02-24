import type { PortfolioItem } from '../../types'

interface PortfolioCardProps {
  item: PortfolioItem
}

export function PortfolioCard({ item }: PortfolioCardProps) {
  return (
    <article className="portfolio-card">
      <img src={item.imageUrl} alt={item.title} />
      <div className="portfolio-content">
        <h3>{item.title}</h3>
        <p>{item.description}</p>
        <div className="tag-list">
          {item.tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
        <div className="card-actions">
          <a className="ghost" href={item.liveUrl} target="_blank" rel="noreferrer">
            Live Demo
          </a>
          <a className="ghost" href={item.repoUrl} target="_blank" rel="noreferrer">
            Repo
          </a>
        </div>
      </div>
    </article>
  )
}
