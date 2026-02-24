import React from 'react'
import type { Education } from '../../types'

interface EducationEditorProps {
  education: Education[]
  onChange: (index: number, value: Education) => void
  onAdd: () => void
  onRemove: (index: number) => void
}

export function EducationEditor({ education, onChange, onAdd, onRemove }: EducationEditorProps) {
  return (
    <div className="admin-card">
      <div className="admin-card-header">
        <h3>Education</h3>
        <button className="ghost" onClick={onAdd}>
          Add education
        </button>
      </div>
      {education.map((item, index) => (
        <div key={item.id} className="admin-item">
          <div className="admin-item-header">
            <strong>School #{index + 1}</strong>
            <button className="text" onClick={() => onRemove(index)}>
              Delete
            </button>
          </div>
          <div className="admin-fields">
            <input
              placeholder="School"
              value={item.school}
              onChange={(event) =>
                onChange(index, { ...item, school: event.target.value })
              }
            />
            <input
              placeholder="Degree"
              value={item.degree}
              onChange={(event) =>
                onChange(index, { ...item, degree: event.target.value })
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
              placeholder="Details"
              rows={3}
              value={item.details}
              onChange={(event) =>
                onChange(index, { ...item, details: event.target.value })
              }
            />
          </div>
        </div>
      ))}
    </div>
  )
}
