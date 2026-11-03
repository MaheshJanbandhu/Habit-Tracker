import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Check, PartyPopper, Flame } from 'lucide-react'
import Header from '../components/Header.jsx'
import Button from '../components/Button.jsx'
import HabitGlassGrid from '../components/HabitGlassGrid.jsx'
import ProgressBar from '../components/ProgressBar.jsx'
import StreakChart from '../components/StreakChart.jsx'
import hero from '../assets/hero.svg'
import { ICONS, TIPS } from '../assets/icons.js'
import { useHabits, dk, daysAgo } from '../hooks/useHabits.jsx'
import usePageMeta from '../hooks/usePageMeta.js'

export default function Dashboard() {
  usePageMeta('Dashboard', 'See today’s habits, your completion rate and your current streak at a glance.')
  const H = useHabits()
  const { habits, filtered, userName, isDone, toggle, setEditing, dayStats, range, overallStreak, doneDays, query } = H
  const [view, setView] = useState('D'), [idx, setIdx] = useState(0)
  const today = dk(new Date()), n = { D: 1, W: 7, M: 30 }[view]
  const t = dayStats(0), y = dayStats(1), total = habits.length
  const r = range(n)
  const missed = habits.filter(h => h.createdAt <= daysAgo(1) && !isDone(h, daysAgo(1))).length
  const list = filtered, cur = list.length ? list[((idx % list.length) + list.length) % list.length] : null
  const CI = cur && (ICONS[cur.icon] || ICONS.droplets)
  const week = Array.from({ length: 7 }, (_, i) => dayStats(6 - i).pct)
  const labels = Array.from({ length: 7 }, (_, i) => new Date(Date.now() - (6 - i) * 864e5).toLocaleDateString('en', { weekday: 'narrow' }))
  const streakN = overallStreak()
  const allDone = total > 0 && (view === 'D' ? t.done === total : r.pct === 100)

  return (
    <>
      <Header title={`Hi, ${userName}!`} subtitle="Let’s look at your daily habit overview" search add />
      <div className="grid-top">
        <section className="hero" aria-label="Today at a glance">
          <img src={hero} alt="" width="900" height="420" loading="lazy" />
          <div className="hero-body">
            <h2>Your Daily Habits Start Here!</h2>
            <p>Today: {t.done} of {total} habits completed</p>
            <Button variant="light" arrow onClick={() => setEditing(null)}>Add New Habit</Button>
          </div>
        </section>
        <section className="card blue" aria-label="Today’s habits">
          <div className="row between"><h2 className="h3">Today’s Habits</h2>
            <div className="toggle" role="group" aria-label="Time range">{[['D', 'Day'], ['W', 'Week'], ['M', 'Month']].map(([k, l]) => (
              <button key={k} type="button" aria-label={l} aria-pressed={view === k} className={view === k ? 'on' : ''} onClick={() => setView(k)}>{k}</button>))}</div></div>
          {total === 0 ? <p className="muted empty">No habits yet. Add your first habit!</p> : (
            <>
              <HabitGlassGrid habits={list} filled={h => view === 'D' ? isDone(h, today) : doneDays(h, n) >= n / 2} onToggle={view === 'D' ? toggle : undefined} />
              {query && !list.length && <p className="muted">No habits match “{query}”.</p>}
              <div className="row between end-align">
                <p className="big">{view === 'D' ? t.done : r.done} <span className="of">/ {view === 'D' ? total : r.total} {view === 'D' ? 'habits' : 'check-ins'}</span></p>
                {allDone && <span className="pill"><PartyPopper size={16} aria-hidden /> Well Done</span>}
              </div>
            </>)}
        </section>
      </div>

      <div className="grid-bottom">
        <section className="card" aria-label="Habit of the day">
          <p className="label">Habit of the Day</p>
          {cur ? (<>
            <div className="row between"><span className="hicon" style={{ background: cur.color }}><CI size={22} aria-hidden /></span><span className="pill small">{cur.category}</span></div>
            <h3 className="h3 mt">{cur.name}</h3>
            <p className="muted">{cur.description || TIPS[cur.category]}</p>
            <div className="row between mt">
              <div className="row"><button type="button" className="icon-btn" aria-label="Previous habit" onClick={() => setIdx(i => i - 1)}><ChevronLeft size={18} /></button>
                <button type="button" className="icon-btn" aria-label="Next habit" onClick={() => setIdx(i => i + 1)}><ChevronRight size={18} /></button></div>
              <Button variant={isDone(cur, today) ? 'lime' : 'primary'} onClick={() => toggle(cur)}><Check size={16} aria-hidden /> {isDone(cur, today) ? 'Done' : 'Complete'}</Button>
            </div></>) : <p className="muted empty">No habits yet. Add your first habit!</p>}
        </section>
        <section className="card" aria-label="Completion">
          <p className="label">Completion</p>
          <p className="big">{t.pct}%</p>
          <ProgressBar value={t.pct} />
          <div className="mini">
            <div><b>{t.done}</b><span>Completed</span></div><div><b>{total - t.done}</b><span>Pending</span></div><div><b>{missed}</b><span>Missed</span></div>
          </div>
          <p className="muted small">Missed counts habits left undone yesterday ({y.done} of {y.total} done).</p>
        </section>
        <section className="card" aria-label="Streak">
          <p className="label">Streak</p>
          <p className="big">{streakN} <span className="of">{streakN === 1 ? 'day' : 'days'}</span></p>
          <StreakChart data={week} labels={labels} />
          <p className="pill small"><Flame size={14} aria-hidden /> {streakN > 0 ? 'Keep it up!' : 'Complete a habit to start your streak.'}</p>
        </section>
      </div>
      {total > 0 && <p className="muted center"><Link to="/habits">Manage all habits</Link></p>}
    </>
  )
}
