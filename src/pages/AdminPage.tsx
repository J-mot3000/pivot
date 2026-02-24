import type { Resume, PortfolioItem, Education, Experience, SiteData } from '../types'
import { ExperienceEditor } from '../components/admin/ExperienceEditor'
import { EducationEditor } from '../components/admin/EducationEditor'
import { PortfolioEditor } from '../components/admin/PortfolioEditor'
import { TagInput } from '../components/admin/TagInput'
import { isSiteData } from '../utils/validators'

interface AdminPageProps {
  draftResume: Resume
  draftPortfolio: PortfolioItem[]
  isDirty: boolean
  error: string
  onResumeChange: <K extends keyof Resume>(key: K, value: Resume[K]) => void
  onPortfolioChange: (portfolio: PortfolioItem[]) => void
  onSave: () => void
  onReset: () => void
  onExport: () => void
  onImport: (file: File | null) => Promise<void>
  onError: (error: string) => void
}

const createExperience = (): Experience => ({
  id: `exp-${crypto.randomUUID()}`,
  role: '',
  company: '',
  location: '',
  start: '',
  end: '',
  summary: '',
  highlights: [''],
})

const createEducation = (): Education => ({
  id: `edu-${crypto.randomUUID()}`,
  school: '',
  degree: '',
  start: '',
  end: '',
  details: '',
})

const createPortfolioItem = (): PortfolioItem => ({
  id: `proj-${crypto.randomUUID()}`,
  title: '',
  description: '',
  tags: [],
  imageUrl: '',
  liveUrl: '',
  repoUrl: '',
})

export function AdminPage({
  draftResume,
  draftPortfolio,
  isDirty,
  error,
  onResumeChange,
  onPortfolioChange,
  onSave,
  onReset,
  onExport,
  onImport,
  onError,
}: AdminPageProps) {
  const handleExperienceChange = (index: number, next: Experience) => {
    const updated = [...draftResume.experience]
    updated[index] = next
    onResumeChange('experience', updated)
  }

  const handleEducationChange = (index: number, next: Education) => {
    const updated = [...draftResume.education]
    updated[index] = next
    onResumeChange('education', updated)
  }

  const handlePortfolioChange = (index: number, next: PortfolioItem) => {
    const updated = [...draftPortfolio]
    updated[index] = next
    onPortfolioChange(updated)
  }

  const handleFileImport = async (file: File | null) => {
    if (!file) return
    try {
      onError('')
      await onImport(file)
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Could not import JSON')
    }
  }

  return (
    <section className="admin">
      <div className="section-header">
        <div>
          <p className="eyebrow">Admin Console</p>
          <h2>Resume Editor</h2>
          <p className="muted">
            Changes are stored in your browser. Export the JSON to deploy on GitHub Pages.
          </p>
        </div>
        <div className="admin-actions">
          <button className="ghost" onClick={onExport}>
            Export JSON
          </button>
          <label className="file-input">
            Import JSON
            <input
              type="file"
              accept="application/json"
              onChange={(event) => handleFileImport(event.target.files?.[0] ?? null)}
            />
          </label>
          <button className="ghost" onClick={onReset}>
            Reset to Defaults
          </button>
        </div>
      </div>

      {error && <div className="status-card error">{error}</div>}

      <div className="admin-grid">
        <div className="admin-card">
          <h3>Summary</h3>
          <label>
            Headline
            <input
              value={draftResume.headline}
              onChange={(event) => onResumeChange('headline', event.target.value)}
            />
          </label>
          <label>
            Summary
            <textarea
              rows={4}
              value={draftResume.summary}
              onChange={(event) => onResumeChange('summary', event.target.value)}
            />
          </label>
        </div>

        <div className="admin-card">
          <h3>Skills</h3>
          <TagInput
            label="Comma-separated skills"
            value={draftResume.skills}
            onChange={(skills) => onResumeChange('skills', skills)}
          />
        </div>

        <ExperienceEditor
          experience={draftResume.experience}
          onChange={handleExperienceChange}
          onAdd={() =>
            onResumeChange('experience', [...draftResume.experience, createExperience()])
          }
          onRemove={(index) =>
            onResumeChange(
              'experience',
              draftResume.experience.filter((_, i) => i !== index),
            )
          }
        />

        <EducationEditor
          education={draftResume.education}
          onChange={handleEducationChange}
          onAdd={() =>
            onResumeChange('education', [...draftResume.education, createEducation()])
          }
          onRemove={(index) =>
            onResumeChange(
              'education',
              draftResume.education.filter((_, i) => i !== index),
            )
          }
        />

        <div className="admin-card">
          <h3>Certifications</h3>
          <TagInput
            label="Comma-separated certifications"
            value={draftResume.certifications}
            onChange={(certs) => onResumeChange('certifications', certs)}
          />
        </div>

        <PortfolioEditor
          portfolio={draftPortfolio}
          onChange={handlePortfolioChange}
          onAdd={() => onPortfolioChange([...draftPortfolio, createPortfolioItem()])}
          onRemove={(index) =>
            onPortfolioChange(draftPortfolio.filter((_, i) => i !== index))
          }
        />

        <div className="admin-footer">
          <button className="primary" onClick={onSave} disabled={!isDirty}>
            Save Resume Changes
          </button>
          {!isDirty && <span className="muted">All changes are saved.</span>}
        </div>
      </div>
    </section>
  )
}
