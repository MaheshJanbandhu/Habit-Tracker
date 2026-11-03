import { Check, Pencil, Trash2, Flame } from 'lucide-react'
import { ICONS } from '../assets/icons.js'
import { useHabits, dk } from '../hooks/useHabits.jsx'
export default function HabitCard({ habit: h }) {
  const { isDone, toggle, streak, setEditing, setDeleting } = useHabits()
  const I = ICONS[h.icon] || ICONS.droplets, done = isDone(h, dk(new Date()))
  return (
    <article className={`card hcard ${done ? 'done' : ''}`}>
      <span className="hicon" style={{ background: h.color }}><I size={22} aria-hidden /></span>
      <div className="hinfo"><h3>{h.name}</h3><p className="muted">{h.category} · {h.target}× per day</p>
        <p className="pill small"><Flame size={14} aria-hidden /> {streak(h)} day streak</p></div>
      <div className="actions">
        <button type="button" className={`icon-btn ${done ? 'lime' : ''}`} aria-pressed={done} aria-label={`${done ? 'Mark not done' : 'Complete'} ${h.name}`} onClick={() => toggle(h)}><Check size={18} /></button>
        <button type="button" className="icon-btn" aria-label={`Edit ${h.name}`} onClick={() => setEditing(h)}><Pencil size={18} /></button>
        <button type="button" className="icon-btn" aria-label={`Delete ${h.name}`} onClick={() => setDeleting(h)}><Trash2 size={18} /></button>
      </div>
    </article>
  )
}
