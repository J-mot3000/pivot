import type { Experience } from '../../types'

interface ExperienceEditorProps {
  experience: Experience[]
  onChange: (index: number, value: Experience) => void
  onAdd: () => void
  onRemove: (index: number) => void
}

export function ExperienceEditor({ experience, onChange, onAdd, onRemove }: ExperienceEditorProps) {
  return (
    <div className="admin-card">
      <div className="admin-card-header">
        <h3>Experience</h3>
        <button className="ghost" onClick={onAdd}>
          Add experience
        </button>
      </div>
      {experience.map((item, index) => (
        <div key={item.id} className="admin-item">
          <div className="admin-item-header">
            <strong>Role #{index + 1}</strong>
            <button className="text" onClick={() => onRemove(index)}>
              Delete
            </button>
          </div>
          <div className="admin-fields">
            <input
              placeholder="Role"
              value={item.role}
              onChange={(event) =>
                onChange(index, { ...item, role: event.target.value })
              }
            />
            <input
              placeholder="Company"
              value={item.company}
              onChange={(event) =>
                onChange(index, { ...item, company: event.target.value })
              }
            />
            <input
              placeholder="Location"
              value={item.location}
              onChange={(event) =>
                onChange(index, { ...item, location: event.target.value })
              }
            />
            <input
              placeholder="Start"
              value={item.start}
              onChange={(event) =>
                onChange(index, { ...item, start: event.target.value })
              }
            />
            <input
              placeholder="End"
              value={item.end}
              onChange={(event) =>
                onChange(index, { ...item, end: event.target.value })
              }
            />
            <textarea
              placeholder="Summary"
              rows={3}
              value={item.summary}
              onChange={(event) =>
                onChange(index, { ...item, summary: event.target.value })
              }
            />
            <textarea
              placeholder="Highlights (one per line)"
              rows={3}
              value={item.highlights.join('\n')}
              onChange={(event) =>
                onChange(index, {
                  ...item,
                  highlights: event.target.value
                    .split('\n')
                    .map((highlight) => highlight.trim())
                    .filter(Boolean),
                })
              }
            />
          </div>
        </div>
      ))}
    </div>
  )
}
