export default function StatCard({ label, value, className = '', children }) {
  return <section className={`card ${className}`} aria-label={label}><p className="label">{label}</p><p className="big">{value}</p>{children}</section>
}
