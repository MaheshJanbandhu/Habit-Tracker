import { Link, NavLink } from 'react-router-dom'
import { LayoutDashboard, ListChecks, TrendingUp, Mail, Sprout, LogOut } from 'lucide-react'
import { useAuth } from '../hooks/useAuth.jsx'
import { useToast } from './Toast.jsx'
const NAV = [['/', 'Dashboard', LayoutDashboard], ['/habits', 'Habits', ListChecks], ['/progress', 'Progress', TrendingUp], ['/contact', 'Contact', Mail]]
export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth(), toast = useToast(), userName = user.name
  return (
    <aside id="sidebar" className={`sidebar ${open ? 'open' : ''}`}>
      <div className="side-inner">
        <Link to="/" className="logo" aria-label="Habit Tracker home" onClick={onClose}><Sprout size={22} /><span className="side-label">Habit Tracker</span></Link>
        <nav aria-label="Main">
          <ul>{NAV.map(([to, label, I]) => (
            <li key={to}><NavLink to={to} end={to === '/'} onClick={onClose} aria-label={label} title={label}><I size={22} aria-hidden /><span className="side-label">{label}</span></NavLink></li>))}</ul>
        </nav>
        <div className="side-foot">
          <button type="button" className="icon-btn" aria-label="Log out" title="Log out" onClick={() => { logout(); toast('You’ve been logged out') }}><LogOut size={20} aria-hidden /></button>
          <div className="avatar" aria-label={`Signed in as ${userName}`} title={userName}>{userName[0].toUpperCase()}</div>
        </div>
      </div>
    </aside>
  )
}
