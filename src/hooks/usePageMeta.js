import { useEffect } from 'react'
export default function usePageMeta(title, description) {
  useEffect(() => {
    document.title = `${title} | Habit Tracker`
    let m = document.querySelector('meta[name="description"]')
    if (!m) { m = document.createElement('meta'); m.name = 'description'; document.head.appendChild(m) }
    m.content = description
  }, [title, description])
}
