export default function ProgressBar({ value, segments = 10 }) {
  const on = Math.round(value / 100 * segments)
  return (
    <div className="seg" role="progressbar" aria-valuenow={value} aria-valuemin="0" aria-valuemax="100" aria-label="Completion">
      {Array.from({ length: segments }, (_, i) => <span key={i} className={i < on ? 'on' : ''} />)}
    </div>
  )
}
