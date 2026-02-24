import type { Education } from '../../types'

interface EducationCardProps {
  education: Education
}

export function EducationCard({ education }: EducationCardProps) {
  return (
    <article className="timeline-card">
      <div>
        <h4>{education.degree}</h4>
        <p className="muted">{education.school}</p>
      </div>
      <span className="pill">
        {education.start} — {education.end}
      </span>
      <p>{education.details}</p>
    </article>
  )
}
