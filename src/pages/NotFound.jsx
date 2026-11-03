import { useNavigate } from 'react-router-dom'
import Button from '../components/Button.jsx'
import usePageMeta from '../hooks/usePageMeta.js'
export default function NotFound() {
  usePageMeta('Page Not Found', 'The page you’re looking for doesn’t exist. Head back to your habit dashboard.')
  const go = useNavigate()
  return (
    <section className="card center empty-card">
      <p className="big">404</p><h1 className="h3">Page Not Found</h1>
      <p className="muted">That page doesn’t exist or has moved.</p>
      <Button arrow onClick={() => go('/')}>Back to Home</Button>
    </section>
  )
}
