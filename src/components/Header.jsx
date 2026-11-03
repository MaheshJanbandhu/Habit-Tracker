import { Search, Plus } from 'lucide-react'
import { useHabits } from '../hooks/useHabits.jsx'
import Button from './Button.jsx'
export default function Header({ title, subtitle, search = false, add = false }) {
  const { query, setQuery, setEditing } = useHabits()
  return (
    <header className="head">
      <div className="head-text"><h1>{title}</h1><p className="muted">{subtitle}</p></div>
      {search && (
        <form className="search" role="search" onSubmit={e => e.preventDefault()}>
          <Search size={18} aria-hidden /><input type="search" aria-label="Search your habits" placeholder="Search your habits..." value={query} onChange={e => setQuery(e.target.value)} />
        </form>)}
      {add && <Button onClick={() => setEditing(null)}><Plus size={16} aria-hidden /> Add Habit</Button>}
    </header>
  )
}
