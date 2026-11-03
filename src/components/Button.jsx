import { ArrowRight } from 'lucide-react'
export default function Button({ children, variant = 'primary', arrow = false, type = 'button', className = '', ...p }) {
  return (
    <button type={type} className={`btn btn-${variant} ${className}`} {...p}>
      <span>{children}</span>
      {arrow && <span className="btn-arrow" aria-hidden><ArrowRight size={16} /></span>}
    </button>
  )
}
