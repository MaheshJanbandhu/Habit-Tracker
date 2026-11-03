import { createContext, useCallback, useContext, useState } from 'react'
const Ctx = createContext(null)
export const useAuth = () => useContext(Ctx)
const load = (k, f) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : f } catch { return f } }
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()))
async function hash(pw, salt) {
  if (!crypto.subtle) throw new Error('INSECURE_CONTEXT')
  const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(salt + pw))
  return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join('')
}
export function AuthProvider({ children }) {
  const [sid, setSid] = useState(() => load('ht_session', null))
  const [users, setUsers] = useState(() => load('ht_users', []))
  const user = users.find(u => u.id === sid) || null
  const start = id => { setSid(id); localStorage.setItem('ht_session', JSON.stringify(id)) }

  const signup = useCallback(async ({ name, email, password }) => {
    const all = load('ht_users', [])
    const mail = email.trim().toLowerCase()
    if (all.some(u => u.email === mail)) throw new Error('EMAIL_TAKEN')
    const salt = uid(), u = { id: uid(), name: name.trim(), email: mail, salt, hash: await hash(password, salt) }
    // First account adopts any habits saved before accounts existed
    if (!all.length) for (const k of ['ht_habits', 'ht_logs']) { const old = localStorage.getItem(k); if (old) { localStorage.setItem(`${k}_${u.id}`, old); localStorage.removeItem(k) } }
    const next = [...all, u]
    localStorage.setItem('ht_users', JSON.stringify(next)); setUsers(next); start(u.id)
  }, [])
  const login = useCallback(async ({ email, password }) => {
    const u = load('ht_users', []).find(x => x.email === email.trim().toLowerCase())
    if (!u || u.hash !== await hash(password, u.salt)) throw new Error('BAD_LOGIN')
    setUsers(load('ht_users', [])); start(u.id)
  }, [])
  const logout = useCallback(() => { setSid(null); try { localStorage.removeItem('ht_session') } catch { /* ignore */ } }, [])
  return <Ctx.Provider value={{ user, signup, login, logout }}>{children}</Ctx.Provider>
}
