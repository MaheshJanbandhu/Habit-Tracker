import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
export default function Modal({ title, onClose, children }) {
  const ref = useRef(null), closeRef = useRef(onClose)
  closeRef.current = onClose
  useEffect(() => {
    const prev = document.activeElement
    ref.current?.querySelector('input,select,textarea,button.btn')?.focus()
    const onKey = e => e.key === 'Escape' && closeRef.current()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; prev?.focus?.() }
  }, [])
  return (
    <div className="overlay" onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={title} ref={ref}>
        <div className="modal-head"><h2>{title}</h2><button type="button" className="icon-btn" aria-label="Close dialog" onClick={onClose}><X size={18} /></button></div>
        {children}
      </div>
    </div>
  )
}
