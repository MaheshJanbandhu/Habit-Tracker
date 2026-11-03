export default function FormInput({ label, id, error, as: Tag = 'input', children, ...p }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <Tag id={id} aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined} className={error ? 'invalid' : ''} {...p}>{children}</Tag>
      {error && <p className="err" id={`${id}-err`} role="alert">{error}</p>}
    </div>
  )
}
