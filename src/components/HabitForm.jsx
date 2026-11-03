import { useState } from 'react'
import Modal from './Modal.jsx'
import Button from './Button.jsx'
import FormInput from './FormInput.jsx'
import { ICONS, CATEGORIES, COLORS, TIPS } from '../assets/icons.js'
import { useHabits } from '../hooks/useHabits.jsx'
import { useToast } from './Toast.jsx'

export default function HabitForm({ habit, onClose }) {
  const { add, edit, duplicate } = useHabits()
  const toast = useToast()
  const [v, setV] = useState({ name: habit?.name || '', category: habit?.category || 'Health', target: habit?.target || 1, icon: habit?.icon || 'droplets', color: habit?.color || COLORS[0], description: habit?.description || '' })
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)
  const set = (k, val) => setV(s => ({ ...s, [k]: val }))

  const submit = e => {
    e.preventDefault()
    const errs = {}, name = v.name.trim()
    if (name.length < 2) errs.name = name ? 'Habit name needs at least 2 characters.' : 'Enter a habit name.'
    else if (duplicate(name, habit?.id)) errs.name = 'You already have a habit with this name.'
    const t = Number(v.target)
    if (!Number.isInteger(t) || t < 1 || t > 20) errs.target = 'Choose a target between 1 and 20.'
    setErrors(errs)
    if (Object.keys(errs).length) { toast(Object.values(errs)[0], 'error'); return }
    setBusy(true)
    try {
      const data = { ...v, target: t, description: v.description.trim() || TIPS[v.category] }
      habit ? edit(habit.id, data) : add(data)
      onClose()
    } catch { setErrors({ form: 'Could not save this habit. Try again.' }); toast('Could not save this habit. Try again.', 'error'); setBusy(false) }
  }

  return (
    <Modal title={habit ? 'Edit habit' : 'Add a habit'} onClose={onClose}>
      <form onSubmit={submit} noValidate>
        <FormInput label="Habit name" id="h-name" value={v.name} onChange={e => set('name', e.target.value)} error={errors.name} placeholder="e.g. Drink 2 litres of water" maxLength={40} />
        <div className="two">
          <FormInput label="Category" id="h-cat" as="select" value={v.category} onChange={e => set('category', e.target.value)}>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</FormInput>
          <FormInput label="Target per day" id="h-target" type="number" min="1" max="20" value={v.target} onChange={e => set('target', e.target.value)} error={errors.target} />
        </div>
        <FormInput label="Note (optional)" id="h-desc" value={v.description} onChange={e => set('description', e.target.value)} maxLength={90} placeholder="Why does this habit matter to you?" />
        <fieldset><legend>Icon</legend>
          <div className="picker">{Object.entries(ICONS).map(([k, I]) => (
            <button key={k} type="button" aria-label={k} aria-pressed={v.icon === k} className={v.icon === k ? 'on' : ''} onClick={() => set('icon', k)}><I size={18} /></button>))}</div>
        </fieldset>
        <fieldset><legend>Color</legend>
          <div className="picker">{COLORS.map(c => (
            <button key={c} type="button" aria-label={`Color ${c}`} aria-pressed={v.color === c} className={`sw ${v.color === c ? 'on' : ''}`} style={{ background: c }} onClick={() => set('color', c)} />))}</div>
        </fieldset>
        {errors.form && <p className="err" role="alert">{errors.form}</p>}
        <div className="row end"><Button variant="ghost" onClick={onClose}>Cancel</Button><Button type="submit" disabled={busy}>{habit ? 'Save changes' : 'Add habit'}</Button></div>
      </form>
    </Modal>
  )
}
