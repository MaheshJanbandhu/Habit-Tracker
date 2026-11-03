import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useToast } from '../components/Toast.jsx'
import { useAuth } from './useAuth.jsx'

export const dk = d => { const x = new Date(d); return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}` }
export const daysAgo = n => { const d = new Date(); d.setDate(d.getDate() - n); return dk(d) }
const load = (k, f) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : f } catch { return f } }
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()))
const Ctx = createContext(null)
export const useHabits = () => useContext(Ctx)

export function HabitsProvider({ children }) {
  const toast = useToast()
  const { user } = useAuth()
  const HK = `ht_habits_${user.id}`, LK = `ht_logs_${user.id}`
  const [habits, setHabits] = useState(() => load(HK, []))
  const [logs, setLogs] = useState(() => load(LK, {}))
  const [query, setQuery] = useState('')
  const [editing, setEditing] = useState(undefined) // undefined = closed, null = new, object = edit
  const [deleting, setDeleting] = useState(null)
  const userName = user.name.split(' ')[0]

  useEffect(() => {
    try { localStorage.setItem(HK, JSON.stringify(habits)); localStorage.setItem(LK, JSON.stringify(logs)) }
    catch { toast('Could not save your changes. Check your browser storage settings.', 'error') }
  }, [habits, logs, toast, HK, LK])

  const isDone = useCallback((h, date) => (logs[date]?.[h.id] || 0) >= h.target, [logs])
  const duplicate = (name, exceptId) => habits.some(h => h.id !== exceptId && h.name.trim().toLowerCase() === name.trim().toLowerCase())

  const add = v => { setHabits(h => [...h, { ...v, name: v.name.trim(), id: uid(), createdAt: dk(new Date()) }]); toast('Habit added') }
  const edit = (id, v) => { setHabits(h => h.map(x => x.id === id ? { ...x, ...v, name: v.name.trim() } : x)); toast('Habit updated') }
  const remove = id => {
    setHabits(h => h.filter(x => x.id !== id))
    setLogs(l => Object.fromEntries(Object.entries(l).map(([d, o]) => { const c = { ...o }; delete c[id]; return [d, c] })))
    toast('Habit deleted')
  }
  const toggle = h => {
    const today = dk(new Date()), done = isDone(h, today)
    setLogs(l => ({ ...l, [today]: { ...l[today], [h.id]: done ? 0 : h.target } }))
    toast(done ? 'Marked as not done' : `Completed: ${h.name}`)
  }

  const streak = useCallback(h => {
    let n = 0, i = isDone(h, daysAgo(0)) ? 0 : 1
    while (i < 365 && isDone(h, daysAgo(i))) { n++; i++ }
    return n
  }, [isDone])
  const bestStreak = h => { let best = 0, run = 0; for (let i = 365; i >= 0; i--) { run = isDone(h, daysAgo(i)) ? run + 1 : 0; best = Math.max(best, run) } return best }
  const dayStats = useCallback(n => {
    const date = daysAgo(n), active = habits.filter(h => h.createdAt <= date)
    const done = active.filter(h => isDone(h, date)).length
    return { done, total: active.length, pct: active.length ? Math.round(done / active.length * 100) : 0 }
  }, [habits, isDone])
  const range = useCallback(n => { let done = 0, total = 0; for (let i = 0; i < n; i++) { const s = dayStats(i); done += s.done; total += s.total } return { done, total, pct: total ? Math.round(done / total * 100) : 0 } }, [dayStats])
  const overallStreak = () => { let n = 0, i = dayStats(0).done > 0 ? 0 : 1; while (i < 365 && dayStats(i).done > 0) { n++; i++ } return n }
  const doneDays = (h, n) => { let c = 0; for (let i = 0; i < n; i++) if (isDone(h, daysAgo(i))) c++; return c }

  const filtered = useMemo(() => habits.filter(h => h.name.toLowerCase().includes(query.trim().toLowerCase())), [habits, query])
  const value = { habits, filtered, userName, query, setQuery, editing, setEditing, deleting, setDeleting, add, edit, remove, toggle, isDone, duplicate, streak, bestStreak, dayStats, range, overallStreak, doneDays }
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
