import { createContext, useCallback, useContext, useState } from 'react'
import { CheckCircle2, AlertCircle, X } from 'lucide-react'
const Ctx = createContext(() => {})
export const useToast = () => useContext(Ctx)
export function ToastProvider({ children }) {
  const [items, setItems] = useState([])
  const remove = id => setItems(i => i.filter(t => t.id !== id))
  const toast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random()
    setItems(i => [...i, { id, message, type }])
    setTimeout(() => setItems(i => i.filter(t => t.id !== id)), 3500)
  }, [])
  return (
    <Ctx.Provider value={toast}>
      {children}
      <div className="toasts" role="status" aria-live="polite">
        {items.map(t => (
          <div key={t.id} className={`toast ${t.type}`}>
            {t.type === 'error' ? <AlertCircle size={18} aria-hidden /> : <CheckCircle2 size={18} aria-hidden />}
            <span>{t.message}</span>
            <button type="button" aria-label="Dismiss message" onClick={() => remove(t.id)}><X size={16} /></button>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  )
}
