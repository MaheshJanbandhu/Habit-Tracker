import { useEffect, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { Menu, Sprout } from 'lucide-react'
import Sidebar from './Sidebar.jsx'
import HabitForm from './HabitForm.jsx'
import ConfirmDialog from './ConfirmDialog.jsx'
import { useHabits } from '../hooks/useHabits.jsx'
export default function Layout() {
  const [open, setOpen] = useState(false)
  const { editing, setEditing, deleting, setDeleting, remove, setQuery } = useHabits()
  const { pathname } = useLocation()
  useEffect(() => { setOpen(false); setQuery(''); window.scrollTo(0, 0) }, [pathname, setQuery])
  useEffect(() => {
    if (!open) return
    const k = e => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', k); return () => document.removeEventListener('keydown', k)
  }, [open])
  return (
    <div className="app">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      {open && <div className="scrim" onClick={() => setOpen(false)} aria-hidden />}
      <div className="content">
        <div className="topbar">
          <Link to="/" className="logo" aria-label="Habit Tracker home"><Sprout size={22} /><span>Habit Tracker</span></Link>
          <button type="button" className="icon-btn" aria-label="Open menu" aria-expanded={open} aria-controls="sidebar" onClick={() => setOpen(o => !o)}><Menu size={20} /></button>
        </div>
        <main id="main"><Outlet /></main>
        <footer className="foot">
          <p>© {new Date().getFullYear()} Habit Tracker. Small steps, every day.</p>
          <nav aria-label="Footer"><Link to="/">Dashboard</Link><Link to="/habits">Habits</Link><Link to="/progress">Progress</Link><Link to="/contact">Contact</Link></nav>
        </footer>
      </div>
      {editing !== undefined && <HabitForm habit={editing || undefined} onClose={() => setEditing(undefined)} />}
      {deleting && <ConfirmDialog habit={deleting} onCancel={() => setDeleting(null)} onConfirm={() => { remove(deleting.id); setDeleting(null) }} />}
    </div>
  )
}
