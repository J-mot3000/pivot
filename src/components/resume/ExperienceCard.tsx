import type { Experience } from '../../types'

interface ExperienceCardProps {
  experience: Experience
}

export function ExperienceCard({ experience }: ExperienceCardProps) {
  return (
    <article className="timeline-card">
      <div>
        <h4>{experience.role}</h4>
        <p className="muted">
          {experience.company} • {experience.location}
        </p>
      </div>
      <span className="pill">
        {experience.start} — {experience.end}
      </span>
      <p>{experience.summary}</p>
      <ul>
        {experience.highlights.map((highlight) => (
          <li key={highlight}>{highlight}</li>
        ))}
      </ul>
    </article>
  )
}
