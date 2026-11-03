export default function StreakChart({ data, labels }) {
  const W = 280, H = 90, p = 8
  const pts = data.map((v, i) => [p + i * (W - 2 * p) / (data.length - 1), H - p - (v / 100) * (H - 2 * p)])
  let d = `M${pts[0][0]},${pts[0][1]}`
  for (let i = 1; i < pts.length; i++) { const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], mx = (x0 + x1) / 2; d += ` C${mx},${y0} ${mx},${y1} ${x1},${y1}` }
  const last = pts[pts.length - 1]
  return (
    <figure className="chart">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Daily completion for the last 7 days: ${data.join('%, ')}%`}>
        <path d={`${d} L${last[0]},${H} L${pts[0][0]},${H} Z`} fill="#9ACD32" opacity=".18" />
        <path d={d} fill="none" stroke="#9ACD32" strokeWidth="4" strokeLinecap="round" />
        {pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={i === pts.length - 1 ? 5 : 3} fill={i === pts.length - 1 ? '#111' : '#9ACD32'} />)}
      </svg>
      <figcaption className="days">{labels.map((l, i) => <span key={i}>{l}</span>)}</figcaption>
    </figure>
  )
}
