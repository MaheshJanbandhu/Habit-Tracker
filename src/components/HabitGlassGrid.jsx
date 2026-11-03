import { ICONS } from '../assets/icons.js'
export default function HabitGlassGrid({ habits, filled, onToggle }) {
  if (!habits.length) return <p className="muted">No habits to show yet.</p>
  return (
    <ul className="glass">
      {habits.map(h => {
        const I = ICONS[h.icon] || ICONS.droplets, on = filled(h)
        return (
          <li key={h.id}>
            {onToggle
              ? <button type="button" className={`tile ${on ? 'on' : ''}`} aria-pressed={on} aria-label={`${h.name}: ${on ? 'done' : 'not done'}. Toggle`} title={h.name} onClick={() => onToggle(h)}><I size={22} aria-hidden /></button>
              : <span className={`tile ${on ? 'on' : ''}`} title={h.name} aria-label={`${h.name}: ${on ? 'mostly done' : 'needs attention'}`}><I size={22} aria-hidden /></span>}
          </li>)
      })}
    </ul>
  )
}
