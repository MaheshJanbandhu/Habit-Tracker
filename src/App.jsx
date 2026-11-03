import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { ToastProvider } from './components/Toast.jsx'
import { HabitsProvider } from './hooks/useHabits.jsx'
import { AuthProvider, useAuth } from './hooks/useAuth.jsx'
import AuthPage from './pages/AuthPage.jsx'
import Layout from './components/Layout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Habits from './pages/Habits.jsx'
import Progress from './pages/Progress.jsx'
import Contact from './pages/Contact.jsx'
import NotFound from './pages/NotFound.jsx'
function RequireAuth() {
  const { user } = useAuth()
  return user ? <HabitsProvider key={user.id}><Outlet /></HabitsProvider> : <Navigate to="/login" replace />
}
export default function App() {
  return (
    <ToastProvider><AuthProvider><BrowserRouter>
      <Routes>
        <Route path="login" element={<AuthPage key="login" mode="login" />} /><Route path="signup" element={<AuthPage key="signup" mode="signup" />} />
        <Route element={<RequireAuth />}><Route element={<Layout />}>
        <Route index element={<Dashboard />} /><Route path="habits" element={<Habits />} />
        <Route path="progress" element={<Progress />} /><Route path="contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route></Route></Routes>
    </BrowserRouter></AuthProvider></ToastProvider>
  )
}
