import { useState } from 'react'
import { Phone, Mail } from 'lucide-react'
import Header from '../components/Header.jsx'
import FormInput from '../components/FormInput.jsx'
import Button from '../components/Button.jsx'
import { useToast } from '../components/Toast.jsx'
import usePageMeta from '../hooks/usePageMeta.js'
const empty = { name: '', email: '', phone: '', message: '' }
export default function Contact() {
  usePageMeta('Contact', 'Questions about Habit Tracker? Send us a message or call our support team.')
  const toast = useToast()
  const [v, setV] = useState(empty), [errors, setErrors] = useState({}), [busy, setBusy] = useState(false)
  const set = k => e => setV(s => ({ ...s, [k]: e.target.value }))
  const submit = async e => {
    e.preventDefault()
    const er = {}
    if (v.name.trim().length < 2) er.name = 'Enter your name (at least 2 characters).'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email)) er.email = 'Enter a valid email address, like you@example.com.'
    if (v.phone.replace(/\D/g, '').length !== 10) er.phone = 'Enter a 10-digit phone number.'
    if (v.message.trim().length < 10) er.message = 'Your message needs at least 10 characters.'
    setErrors(er)
    if (Object.keys(er).length) { toast(Object.values(er)[0], 'error'); return }
    setBusy(true)
    try { await new Promise(r => setTimeout(r, 700)); setV(empty); toast('Message sent. We’ll reply within one working day.') }
    catch { toast('Message could not be sent. Try again.', 'error') }
    finally { setBusy(false) }
  }
  return (
    <>
      <Header title="Contact us" subtitle="Questions or feedback? We read every message." />
      <div className="grid-top">
        <form className="card" onSubmit={submit} noValidate aria-label="Support form">
          <FormInput label="Name" id="c-name" value={v.name} onChange={set('name')} error={errors.name} autoComplete="name" />
          <div className="two">
            <FormInput label="Email" id="c-email" type="email" value={v.email} onChange={set('email')} error={errors.email} autoComplete="email" />
            <FormInput label="Phone" id="c-phone" type="tel" value={v.phone} onChange={set('phone')} error={errors.phone} autoComplete="tel" placeholder="10 digits" />
          </div>
          <FormInput label="Message" id="c-msg" as="textarea" rows="5" value={v.message} onChange={set('message')} error={errors.message} />
          <div className="row end"><Button type="submit" arrow disabled={busy}>{busy ? 'Sending...' : 'Send message'}</Button></div>
        </form>
        <section className="card blue" aria-label="Support details">
          <h2 className="h3">Talk to support</h2>
          <p className="muted">Weekdays, 9am to 6pm.</p>
          <p className="contact"><Phone size={18} aria-hidden /> <a href="tel:+15550100199">+1 (555) 010-0199</a></p>
          <p className="contact"><Mail size={18} aria-hidden /> <a href="mailto:support@habittracker.app">support@habittracker.app</a></p>
        </section>
      </div>
    </>
  )
}
