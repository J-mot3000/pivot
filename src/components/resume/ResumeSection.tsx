import type { Resume } from '../../types'
import { ExperienceCard } from './ExperienceCard'
import { EducationCard } from './EducationCard'
import { SkillsTags } from './SkillsTags'

interface ResumeSectionProps {
  resume: Resume
}

export function ResumeSection({ resume }: ResumeSectionProps) {
  return (
    <section id="resume" className="section">
      <div className="section-header">
        <div>
          <p className="eyebrow">Resume</p>
          <h2>{resume.headline}</h2>
        </div>
        <span className="muted">Brought to you by Firebase and GitHub Pages</span>
      </div>

      <div className="resume-grid">
        <div className="resume-card">
          <h3>Summary</h3>
          <p>{resume.summary}</p>
        </div>
        <div className="resume-card">
          <h3>Skills</h3>
          <SkillsTags skills={resume.skills} />
        </div>
      </div>

      <div className="resume-list">
        <div>
          <h3>Experience</h3>
          {resume.experience.map((item) => (
            <ExperienceCard key={item.id} experience={item} />
          ))}
        </div>
        <div>
          <h3>Education</h3>
          {resume.education.map((item) => (
            <EducationCard key={item.id} education={item} />
          ))}
          <h3>Certifications</h3>
          <div className="tag-list">
            {resume.certifications.map((cert) => (
              <span key={cert} className="tag secondary">
                {cert}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
