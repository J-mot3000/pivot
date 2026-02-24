import { type FormEvent, useState } from 'react'
import type { ContactInfo } from '../../types'

interface ContactFormProps {
  contact: ContactInfo
}

export function ContactForm({ contact }: ContactFormProps) {
  const [message, setMessage] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (contact.formAction) return
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const name = String(formData.get('name') ?? '')
    const email = String(formData.get('email') ?? '')
    const messageText = String(formData.get('message') ?? '')
    const subject = encodeURIComponent(`Portfolio inquiry from ${name}`)
    const body = encodeURIComponent(`From: ${name} (${email})\n\n${messageText}`)
    window.location.href = `mailto:${contact.email}?subject=${subject}&body=${body}`
    setMessage('Thanks for reaching out! Your email client is opening now.')
    event.currentTarget.reset()
  }

  return (
    <form
      className="contact-card"
      action={contact.formAction || undefined}
      method={contact.formAction ? 'POST' : undefined}
      onSubmit={handleSubmit}
    >
      <h3>Send a message</h3>
      <input name="name" placeholder="Name" required />
      <input name="email" placeholder="Email" type="email" required />
      <textarea name="message" placeholder="Your message" rows={4} required />
      <button className="primary" type="submit">
        Send Message
      </button>
      {message && <p className="muted">{message}</p>}
    </form>
  )
}
