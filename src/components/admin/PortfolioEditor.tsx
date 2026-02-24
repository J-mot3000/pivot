import type { PortfolioItem } from '../../types'

interface PortfolioEditorProps {
  portfolio: PortfolioItem[]
  onChange: (index: number, value: PortfolioItem) => void
  onAdd: () => void
  onRemove: (index: number) => void
}

const formatTags = (values: string[]) => values.filter(Boolean).join(', ')

export function PortfolioEditor({ portfolio, onChange, onAdd, onRemove }: PortfolioEditorProps) {
  return (
    <div className="admin-card">
      <div className="admin-card-header">
        <h3>Portfolio</h3>
        <button className="ghost" onClick={onAdd}>
          Add project
        </button>
      </div>
      {portfolio.map((item, index) => (
        <div key={item.id} className="admin-item">
          <div className="admin-item-header">
            <strong>Project #{index + 1}</strong>
            <button className="text" onClick={() => onRemove(index)}>
              Delete
            </button>
          </div>
          <div className="admin-fields">
            <input
              placeholder="Title"
              value={item.title}
              onChange={(event) =>
                onChange(index, { ...item, title: event.target.value })
              }
            />
            <input
              placeholder="Description"
              value={item.description}
              onChange={(event) =>
                onChange(index, { ...item, description: event.target.value })
              }
            />
            <input
              placeholder="Tags (comma-separated)"
              value={formatTags(item.tags)}
              onChange={(event) =>
                onChange(index, {
                  ...item,
                  tags: event.target.value
                    .split(',')
                    .map((tag) => tag.trim())
                    .filter(Boolean),
                })
              }
            />
            <input
              placeholder="Image URL"
              value={item.imageUrl}
              onChange={(event) =>
                onChange(index, { ...item, imageUrl: event.target.value })
              }
            />
            <input
              placeholder="Live URL"
              value={item.liveUrl}
              onChange={(event) =>
                onChange(index, { ...item, liveUrl: event.target.value })
              }
            />
            <input
              placeholder="Repo URL"
              value={item.repoUrl}
              onChange={(event) =>
                onChange(index, { ...item, repoUrl: event.target.value })
              }
            />
          </div>
        </div>
      ))}
    </div>
  )
}
