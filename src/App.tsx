import { type FormEvent, useEffect, useMemo, useState } from 'react'
import './App.css'
import type { Education, Experience, PortfolioItem, Resume, SiteData } from './types'
import { fetchDefaultData } from './utils/data'
import { clearStoredData, loadStoredData, saveStoredData } from './utils/storage'
import { isSiteData } from './utils/validators'

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

const formatTags = (values: string[]) => values.filter(Boolean).join(', ')

function App() {
  const [data, setData] = useState<SiteData | null>(null)
  const [defaultData, setDefaultData] = useState<SiteData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [view, setView] = useState<'home' | 'admin'>(() =>
    window.location.hash === '#admin' ? 'admin' : 'home',
  )
  const [draftResume, setDraftResume] = useState<Resume | null>(null)
  const [draftPortfolio, setDraftPortfolio] = useState<PortfolioItem[] | null>(null)
  const [contactMessage, setContactMessage] = useState('')

  useEffect(() => {
    const syncHash = () => {
      setView(window.location.hash === '#admin' ? 'admin' : 'home')
    }
    window.addEventListener('hashchange', syncHash)
    return () => window.removeEventListener('hashchange', syncHash)
  }, [])

  useEffect(() => {
    const loadData = async () => {
      try {
        const stored = loadStoredData()
        const fallback = await fetchDefaultData()
        const resolved = stored ?? fallback
        setDefaultData(fallback)
        setData(resolved)
        setDraftResume(structuredClone(resolved.resume))
        setDraftPortfolio(structuredClone(resolved.portfolio))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load data')
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const isDirty = useMemo(() => {
    if (!data || !draftResume || !draftPortfolio) return false
    return (
      JSON.stringify(data.resume) !== JSON.stringify(draftResume) ||
      JSON.stringify(data.portfolio) !== JSON.stringify(draftPortfolio)
    )
  }, [data, draftPortfolio, draftResume])

  if (isLoading) {
    return (
      <div className="page">
        <div className="status-card">Loading portfolio…</div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="page">
        <div className="status-card error">{error || 'No data available.'}</div>
      </div>
    )
  }

  const { profile, resume, portfolio, contact } = data

  const handleResumeChange = <K extends keyof Resume>(
    key: K,
    value: Resume[K],
  ) => {
    setDraftResume((prev) => (prev ? { ...prev, [key]: value } : prev))
  }

  const handleExperienceChange = (index: number, next: Experience) => {
    if (!draftResume) return
    const updated = [...draftResume.experience]
    updated[index] = next
    handleResumeChange('experience', updated)
  }

  const handleEducationChange = (index: number, next: Education) => {
    if (!draftResume) return
    const updated = [...draftResume.education]
    updated[index] = next
    handleResumeChange('education', updated)
  }

  const persistResume = () => {
    if (!draftResume || !draftPortfolio) return
    const next = { ...data, resume: draftResume, portfolio: draftPortfolio }
    setData(next)
    saveStoredData(next)
  }

  const resetResume = () => {
    if (!defaultData) return
    clearStoredData()
    setData(defaultData)
    setDraftResume(structuredClone(defaultData.resume))
    setDraftPortfolio(structuredClone(defaultData.portfolio))
  }

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'siteData.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  const importJson = async (file: File | null) => {
    if (!file) return
    try {
      const text = await file.text()
      const parsed = JSON.parse(text) as unknown
      if (!isSiteData(parsed)) {
        setError('That file does not match the required data shape.')
        return
      }
      setError('')
      setData(parsed)
      setDraftResume(structuredClone(parsed.resume))
      setDraftPortfolio(structuredClone(parsed.portfolio))
      saveStoredData(parsed)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not import JSON')
    }
  }

  const handleContactSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (contact.formAction) return
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const name = String(formData.get('name') ?? '')
    const email = String(formData.get('email') ?? '')
    const message = String(formData.get('message') ?? '')
    const subject = encodeURIComponent(`Portfolio inquiry from ${name}`)
    const body = encodeURIComponent(`From: ${name} (${email})\n\n${message}`)
    window.location.href = `mailto:${contact.email}?subject=${subject}&body=${body}`
    setContactMessage('Thanks for reaching out! Your email client is opening now.')
    event.currentTarget.reset()
  }

  return (
    <div className="page">
      <header className="nav">
        <div className="brand">
          <span className="brand-dot" />
          <span>{profile.name}</span>
        </div>
        <nav className="nav-links">
          <a href="#resume">Resume</a>
          <a href="#portfolio">Portfolio</a>
          <a href="#contact">Contact</a>
          <a href="#admin">Admin</a>
        </nav>
      </header>

      {view === 'admin' ? (
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
              <button className="ghost" onClick={exportJson}>
                Export JSON
              </button>
              <label className="file-input">
                Import JSON
                <input
                  type="file"
                  accept="application/json"
                  onChange={(event) => importJson(event.target.files?.[0] ?? null)}
                />
              </label>
              <button className="ghost" onClick={resetResume}>
                Reset to Defaults
              </button>
            </div>
          </div>

          {error && <div className="status-card error">{error}</div>}

          {draftResume && (
            <div className="admin-grid">
              <div className="admin-card">
                <h3>Summary</h3>
                <label>
                  Headline
                  <input
                    value={draftResume.headline}
                    onChange={(event) => handleResumeChange('headline', event.target.value)}
                  />
                </label>
                <label>
                  Summary
                  <textarea
                    rows={4}
                    value={draftResume.summary}
                    onChange={(event) => handleResumeChange('summary', event.target.value)}
                  />
                </label>
              </div>

              <div className="admin-card">
                <h3>Skills</h3>
                <label>
                  Comma-separated skills
                  <input
                    value={formatTags(draftResume.skills)}
                    onChange={(event) =>
                      handleResumeChange(
                        'skills',
                        event.target.value
                          .split(',')
                          .map((skill) => skill.trim())
                          .filter(Boolean),
                      )
                    }
                  />
                </label>
              </div>

              <div className="admin-card">
                <div className="admin-card-header">
                  <h3>Experience</h3>
                  <button
                    className="ghost"
                    onClick={() =>
                      handleResumeChange('experience', [
                        ...draftResume.experience,
                        createExperience(),
                      ])
                    }
                  >
                    Add experience
                  </button>
                </div>
                {draftResume.experience.map((item, index) => (
                  <div key={item.id} className="admin-item">
                    <div className="admin-item-header">
                      <strong>Role #{index + 1}</strong>
                      <button
                        className="text"
                        onClick={() =>
                          handleResumeChange(
                            'experience',
                            draftResume.experience.filter((_, i) => i !== index),
                          )
                        }
                      >
                        Delete
                      </button>
                    </div>
                    <div className="admin-fields">
                      <input
                        placeholder="Role"
                        value={item.role}
                        onChange={(event) =>
                          handleExperienceChange(index, { ...item, role: event.target.value })
                        }
                      />
                      <input
                        placeholder="Company"
                        value={item.company}
                        onChange={(event) =>
                          handleExperienceChange(index, {
                            ...item,
                            company: event.target.value,
                          })
                        }
                      />
                      <input
                        placeholder="Location"
                        value={item.location}
                        onChange={(event) =>
                          handleExperienceChange(index, {
                            ...item,
                            location: event.target.value,
                          })
                        }
                      />
                      <input
                        placeholder="Start"
                        value={item.start}
                        onChange={(event) =>
                          handleExperienceChange(index, { ...item, start: event.target.value })
                        }
                      />
                      <input
                        placeholder="End"
                        value={item.end}
                        onChange={(event) =>
                          handleExperienceChange(index, { ...item, end: event.target.value })
                        }
                      />
                      <textarea
                        placeholder="Summary"
                        rows={3}
                        value={item.summary}
                        onChange={(event) =>
                          handleExperienceChange(index, {
                            ...item,
                            summary: event.target.value,
                          })
                        }
                      />
                      <textarea
                        placeholder="Highlights (one per line)"
                        rows={3}
                        value={item.highlights.join('\n')}
                        onChange={(event) =>
                          handleExperienceChange(index, {
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

              <div className="admin-card">
                <div className="admin-card-header">
                  <h3>Education</h3>
                  <button
                    className="ghost"
                    onClick={() =>
                      handleResumeChange('education', [
                        ...draftResume.education,
                        createEducation(),
                      ])
                    }
                  >
                    Add education
                  </button>
                </div>
                {draftResume.education.map((item, index) => (
                  <div key={item.id} className="admin-item">
                    <div className="admin-item-header">
                      <strong>School #{index + 1}</strong>
                      <button
                        className="text"
                        onClick={() =>
                          handleResumeChange(
                            'education',
                            draftResume.education.filter((_, i) => i !== index),
                          )
                        }
                      >
                        Delete
                      </button>
                    </div>
                    <div className="admin-fields">
                      <input
                        placeholder="School"
                        value={item.school}
                        onChange={(event) =>
                          handleEducationChange(index, {
                            ...item,
                            school: event.target.value,
                          })
                        }
                      />
                      <input
                        placeholder="Degree"
                        value={item.degree}
                        onChange={(event) =>
                          handleEducationChange(index, {
                            ...item,
                            degree: event.target.value,
                          })
                        }
                      />
                      <input
                        placeholder="Start"
                        value={item.start}
                        onChange={(event) =>
                          handleEducationChange(index, {
                            ...item,
                            start: event.target.value,
                          })
                        }
                      />
                      <input
                        placeholder="End"
                        value={item.end}
                        onChange={(event) =>
                          handleEducationChange(index, { ...item, end: event.target.value })
                        }
                      />
                      <textarea
                        placeholder="Details"
                        rows={3}
                        value={item.details}
                        onChange={(event) =>
                          handleEducationChange(index, {
                            ...item,
                            details: event.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="admin-card">
                <h3>Certifications</h3>
                <label>
                  Comma-separated certifications
                  <input
                    value={formatTags(draftResume.certifications)}
                    onChange={(event) =>
                      handleResumeChange(
                        'certifications',
                        event.target.value
                          .split(',')
                          .map((item) => item.trim())
                          .filter(Boolean),
                      )
                    }
                  />
                </label>
              </div>

              <div className="admin-card">
                <div className="admin-card-header">
                  <h3>Portfolio</h3>
                  <button
                    className="ghost"
                    onClick={() =>
                      setDraftPortfolio((prev) => [
                        ...(prev ?? []),
                        createPortfolioItem(),
                      ])
                    }
                  >
                    Add project
                  </button>
                </div>
                {(draftPortfolio ?? []).map((item, index) => (
                  <div key={item.id} className="admin-item">
                    <div className="admin-item-header">
                      <strong>Project #{index + 1}</strong>
                      <button
                        className="text"
                        onClick={() =>
                          setDraftPortfolio((prev) =>
                            (prev ?? []).filter((_, i) => i !== index),
                          )
                        }
                      >
                        Delete
                      </button>
                    </div>
                    <div className="admin-fields">
                      <input
                        placeholder="Title"
                        value={item.title}
                        onChange={(event) =>
                          setDraftPortfolio((prev) =>
                            (prev ?? []).map((proj, i) =>
                              i === index ? { ...proj, title: event.target.value } : proj,
                            ),
                          )
                        }
                      />
                      <input
                        placeholder="Description"
                        value={item.description}
                        onChange={(event) =>
                          setDraftPortfolio((prev) =>
                            (prev ?? []).map((proj, i) =>
                              i === index
                                ? { ...proj, description: event.target.value }
                                : proj,
                            ),
                          )
                        }
                      />
                      <input
                        placeholder="Tags (comma-separated)"
                        value={formatTags(item.tags)}
                        onChange={(event) =>
                          setDraftPortfolio((prev) =>
                            (prev ?? []).map((proj, i) =>
                              i === index
                                ? {
                                    ...proj,
                                    tags: event.target.value
                                      .split(',')
                                      .map((tag) => tag.trim())
                                      .filter(Boolean),
                                  }
                                : proj,
                            ),
                          )
                        }
                      />
                      <input
                        placeholder="Image URL"
                        value={item.imageUrl}
                        onChange={(event) =>
                          setDraftPortfolio((prev) =>
                            (prev ?? []).map((proj, i) =>
                              i === index ? { ...proj, imageUrl: event.target.value } : proj,
                            ),
                          )
                        }
                      />
                      <input
                        placeholder="Live URL"
                        value={item.liveUrl}
                        onChange={(event) =>
                          setDraftPortfolio((prev) =>
                            (prev ?? []).map((proj, i) =>
                              i === index ? { ...proj, liveUrl: event.target.value } : proj,
                            ),
                          )
                        }
                      />
                      <input
                        placeholder="Repo URL"
                        value={item.repoUrl}
                        onChange={(event) =>
                          setDraftPortfolio((prev) =>
                            (prev ?? []).map((proj, i) =>
                              i === index ? { ...proj, repoUrl: event.target.value } : proj,
                            ),
                          )
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="admin-footer">
                <button className="primary" onClick={persistResume} disabled={!isDirty}>
                  Save Resume Changes
                </button>
                {!isDirty && <span className="muted">All changes are saved.</span>}
              </div>
            </div>
          )}
        </section>
      ) : (
        <main>
          <section className="hero">
            <div className="hero-content">
              <p className="eyebrow">{profile.title}</p>
              <h1>{profile.name}</h1>
              <p className="hero-summary">{profile.summary}</p>
              <div className="hero-meta">
                <span>{profile.location}</span>
                <span>{profile.email}</span>
                <span>{profile.phone}</span>
              </div>
              <div className="hero-actions">
                <a className="primary" href="#portfolio">
                  View Work
                </a>
                <a className="ghost" href="#contact">
                  Contact Me
                </a>
              </div>
            </div>
            <img className="hero-avatar" src={profile.avatarUrl} alt={profile.name} />
          </section>

          <section id="resume" className="section">
            <div className="section-header">
              <div>
                <p className="eyebrow">Resume</p>
                <h2>{resume.headline}</h2>
              </div>
              <span className="muted">Updated for GitHub Pages JSON workflow</span>
            </div>

            <div className="resume-grid">
              <div className="resume-card">
                <h3>Summary</h3>
                <p>{resume.summary}</p>
              </div>
              <div className="resume-card">
                <h3>Skills</h3>
                <div className="tag-list">
                  {resume.skills.map((skill) => (
                    <span key={skill} className="tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="resume-list">
              <div>
                <h3>Experience</h3>
                {resume.experience.map((item) => (
                  <article key={item.id} className="timeline-card">
                    <div>
                      <h4>{item.role}</h4>
                      <p className="muted">
                        {item.company} • {item.location}
                      </p>
                    </div>
                    <span className="pill">
                      {item.start} — {item.end}
                    </span>
                    <p>{item.summary}</p>
                    <ul>
                      {item.highlights.map((highlight) => (
                        <li key={highlight}>{highlight}</li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
              <div>
                <h3>Education</h3>
                {resume.education.map((item) => (
                  <article key={item.id} className="timeline-card">
                    <div>
                      <h4>{item.degree}</h4>
                      <p className="muted">{item.school}</p>
                    </div>
                    <span className="pill">
                      {item.start} — {item.end}
                    </span>
                    <p>{item.details}</p>
                  </article>
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
                <article key={item.id} className="portfolio-card">
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
              ))}
            </div>
          </section>

          <section id="contact" className="section">
            <div className="section-header">
              <div>
                <p className="eyebrow">Contact</p>
                <h2>Let’s build something together</h2>
              </div>
              <span className="muted">{contact.availability}</span>
            </div>
            <div className="contact-grid">
              <div className="contact-card">
                <h3>Contact Details</h3>
                <p>{contact.location}</p>
                <p>{contact.email}</p>
                <p>{contact.phone}</p>
              </div>
              <form
                className="contact-card"
                action={contact.formAction || undefined}
                method={contact.formAction ? 'POST' : undefined}
                onSubmit={handleContactSubmit}
              >
                <h3>Send a message</h3>
                <input name="name" placeholder="Name" required />
                <input name="email" placeholder="Email" type="email" required />
                <textarea name="message" placeholder="Your message" rows={4} required />
                <button className="primary" type="submit">
                  Send Message
                </button>
                {contactMessage && <p className="muted">{contactMessage}</p>}
              </form>
            </div>
          </section>
        </main>
      )}
    </div>
  )
}

export default App
