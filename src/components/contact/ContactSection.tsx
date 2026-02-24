import { ContactForm } from './ContactForm'
import type { ContactInfo } from '../../types'

interface ContactSectionProps {
  contact: ContactInfo
}

export function ContactSection({ contact }: ContactSectionProps) {
  return (
    <section id="contact" className="section">
      <div className="section-header">
        <div>
          <p className="eyebrow">Contact</p>
          <h2>Let's build something together</h2>
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
        <ContactForm contact={contact} />
      </div>
    </section>
  )
}
