import Header from '../components/Header.jsx'
import StatCard from '../components/StatCard.jsx'
import { useHabits, daysAgo } from '../hooks/useHabits.jsx'
import usePageMeta from '../hooks/usePageMeta.js'
function Bars({ data, label }) {
  return (
    <div className="bars" role="img" aria-label={label}>
      {data.map((d, i) => <div key={i} className="bar" title={`${d.l}: ${d.v}%`}><span style={{ height: `${Math.max(d.v, 3)}%` }} /><em>{d.l}</em></div>)}
    </div>
  )
}
export default function Progress() {
  usePageMeta('Progress', 'Weekly and monthly charts, your best streak and your completion rate.')
  const { habits, dayStats, range, bestStreak, streak } = useHabits()
  const wk = Array.from({ length: 7 }, (_, i) => ({ v: dayStats(6 - i).pct, l: new Date(daysAgo(6 - i) + 'T00:00').toLocaleDateString('en', { weekday: 'short' }) }))
  const mo = Array.from({ length: 30 }, (_, i) => ({ v: dayStats(29 - i).pct, l: (i % 5 === 0 || i === 29) ? new Date(daysAgo(29 - i) + 'T00:00').getDate() : '' }))
  const best = habits.reduce((m, h) => Math.max(m, bestStreak(h)), 0)
  const top = habits.reduce((a, h) => (!a || streak(h) > streak(a) ? h : a), null)
  return (
    <>
      <Header title="Your progress" subtitle="See how consistent you’ve been" />
      <div className="grid-bottom">
        <StatCard label="Best streak" value={`${best} ${best === 1 ? 'day' : 'days'}`}><p className="muted">{top && streak(top) > 0 ? `Current leader: ${top.name}` : 'Complete a habit today to start one.'}</p></StatCard>
        <StatCard label="Completion rate (7 days)" value={`${range(7).pct}%`} />
        <StatCard label="Completion rate (30 days)" value={`${range(30).pct}%`} />
      </div>
      <section className="card mt" aria-label="Weekly chart"><h2 className="h3">This week</h2>{habits.length ? <Bars data={wk} label="Daily completion for the last 7 days" /> : <p className="muted empty">No habits yet. Add your first habit!</p>}</section>
      <section className="card mt" aria-label="Monthly chart"><h2 className="h3">Last 30 days</h2>{habits.length ? <Bars data={mo} label="Daily completion for the last 30 days" /> : <p className="muted empty">Your monthly chart appears once you add a habit.</p>}</section>
    </>
  )
}
