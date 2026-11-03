import { useState } from 'react'
import Header from '../components/Header.jsx'
import HabitCard from '../components/HabitCard.jsx'
import Button from '../components/Button.jsx'
import { CATEGORIES } from '../assets/icons.js'
import { useHabits } from '../hooks/useHabits.jsx'
import usePageMeta from '../hooks/usePageMeta.js'
export default function Habits() {
  usePageMeta('Habits', 'Add, edit, complete and delete your daily habits in one place.')
  const { habits, filtered, setEditing } = useHabits()
  const [cat, setCat] = useState('All')
  const list = filtered.filter(h => cat === 'All' || h.category === cat)
  return (
    <>
      <Header title="Your habits" subtitle={`${habits.length} ${habits.length === 1 ? 'habit' : 'habits'} you’re building`} search add />
      <div className="chips" role="group" aria-label="Filter by category">
        {['All', ...CATEGORIES].map(c => <button key={c} type="button" aria-pressed={cat === c} className={cat === c ? 'on' : ''} onClick={() => setCat(c)}>{c}</button>)}
      </div>
      {list.length ? <div className="cards">{list.map(h => <HabitCard key={h.id} habit={h} />)}</div> : (
        <section className="card center empty-card">
          <p className="h3">{habits.length ? 'No habits match your filters.' : 'No habits yet. Add your first habit!'}</p>
          {!habits.length && <Button arrow onClick={() => setEditing(null)}>Add Habit</Button>}
        </section>)}
    </>
  )
}
