import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { Sprout } from 'lucide-react'
import FormInput from '../components/FormInput.jsx'
import Button from '../components/Button.jsx'
import { useToast } from '../components/Toast.jsx'
import { useAuth } from '../hooks/useAuth.jsx'
import usePageMeta from '../hooks/usePageMeta.js'
export default function AuthPage({ mode }) {
  const signup = mode === 'signup'
  usePageMeta(signup ? 'Sign up' : 'Log in', signup ? 'Create a free Habit Tracker account and start building daily habits.' : 'Log in to see your habits, streaks and progress.')
  const { user, login, signup: register } = useAuth(), toast = useToast()
  const [v, setV] = useState({ name: '', email: '', password: '', confirm: '' }), [errors, setErrors] = useState({}), [busy, setBusy] = useState(false)
  const set = k => e => setV(s => ({ ...s, [k]: e.target.value }))
  if (user) return <Navigate to="/" replace />
  const submit = async e => {
    e.preventDefault()
    const er = {}
    if (signup && v.name.trim().length < 2) er.name = 'Enter your name (at least 2 characters).'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email)) er.email = 'Enter a valid email address, like you@example.com.'
    if (signup ? v.password.length < 8 : !v.password) er.password = signup ? 'Use at least 8 characters.' : 'Enter your password.'
    if (signup && v.confirm !== v.password) er.confirm = 'Passwords don’t match.'
    setErrors(er)
    if (Object.keys(er).length) { toast(Object.values(er)[0], 'error'); return }
    setBusy(true)
    try {
      await (signup ? register(v) : login(v))
      toast(signup ? 'Account created. Welcome!' : 'Welcome back!')
    } catch (err) {
      const msg = err.message === 'EMAIL_TAKEN' ? 'An account with this email already exists. Log in instead.'
        : err.message === 'BAD_LOGIN' ? 'Incorrect email or password.'
        : err.message === 'INSECURE_CONTEXT' ? 'Accounts need a secure page. Open the app on localhost or HTTPS.' : 'Something went wrong. Try again.'
      setErrors(err.message === 'EMAIL_TAKEN' ? { email: msg } : { form: msg }); toast(msg, 'error'); setBusy(false)
    }
  }
  return (
    <main className="auth">
      <section className="card auth-card" aria-labelledby="auth-title">
        <Link to="/" className="logo" aria-label="Habit Tracker home"><Sprout size={22} /><span>Habit Tracker</span></Link>
        <h1 id="auth-title" className="auth-title">{signup ? 'Create your account' : 'Welcome back'}</h1>
        <p className="muted">{signup ? 'Sign up to track your own habits and streaks.' : 'Log in to pick up where you left off.'}</p>
        <form onSubmit={submit} noValidate>
          {signup && <FormInput label="Name" id="a-name" value={v.name} onChange={set('name')} error={errors.name} autoComplete="name" />}
          <FormInput label="Email" id="a-email" type="email" value={v.email} onChange={set('email')} error={errors.email} autoComplete="email" />
          <FormInput label="Password" id="a-pw" type="password" value={v.password} onChange={set('password')} error={errors.password} autoComplete={signup ? 'new-password' : 'current-password'} />
          {signup && <FormInput label="Confirm password" id="a-pw2" type="password" value={v.confirm} onChange={set('confirm')} error={errors.confirm} autoComplete="new-password" />}
          {errors.form && <p className="err" role="alert">{errors.form}</p>}
          <Button type="submit" arrow className="full" disabled={busy}>{busy ? 'Please wait...' : signup ? 'Create account' : 'Log in'}</Button>
        </form>
        <p className="muted center">{signup ? 'Already have an account?' : 'New here?'} <Link to={signup ? '/login' : '/signup'}><b>{signup ? 'Log in' : 'Sign up'}</b></Link></p>
      </section>
    </main>
  )
}
