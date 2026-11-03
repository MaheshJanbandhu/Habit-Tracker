import Modal from './Modal.jsx'
import Button from './Button.jsx'
export default function ConfirmDialog({ habit, onConfirm, onCancel }) {
  return (
    <Modal title="Delete this habit?" onClose={onCancel}>
      <p className="muted">“{habit.name}” and its history will be removed. This can’t be undone.</p>
      <div className="row end">
        <Button variant="ghost" onClick={onCancel}>Keep habit</Button>
        <Button variant="danger" onClick={onConfirm}>Delete habit</Button>
      </div>
    </Modal>
  )
}
