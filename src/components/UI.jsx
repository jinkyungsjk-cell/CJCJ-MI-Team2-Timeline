import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import s from './UI.module.css'

// ── Badge ─────────────────────────────────────────────────────
export function Badge({ children, variant = 'gray' }) {
  return <span className={`${s.badge} ${s[`badge-${variant}`]}`}>{children}</span>
}

// ── Owner chips ───────────────────────────────────────────────
export function OwnerChips({ owners = [] }) {
  if (!owners?.length) return <span className={s.dash}>–</span>
  return (
    <span className={s.ownerRow}>
      {owners.map((o, i) => <span key={i} className={s.ownerChip}>{o}</span>)}
    </span>
  )
}

// ── Button ────────────────────────────────────────────────────
export function Btn({ children, variant = 'default', size = 'md', onClick, type = 'button', disabled }) {
  return (
    <button
      type={type}
      className={`${s.btn} ${s[`btn-${variant}`]} ${s[`btn-${size}`]}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

// ── Modal ─────────────────────────────────────────────────────
export function Modal({ open, onClose, title, children, footer }) {
  const overlayRef = useRef()
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    if (open) document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null
  return (
    <div className={s.overlay} ref={overlayRef} onClick={e => { if (e.target === overlayRef.current) onClose() }}>
      <div className={s.modal}>
        <div className={s.modalHeader}>
          <div className={s.modalTitle}>{title}</div>
          <button className={s.modalClose} onClick={onClose}><X size={18}/></button>
        </div>
        <div className={s.modalBody}>{children}</div>
        {footer && <div className={s.modalFooter}>{footer}</div>}
      </div>
    </div>
  )
}

// ── Form helpers ──────────────────────────────────────────────
export function FormGroup({ label, hint, children }) {
  return (
    <div className={s.formGroup}>
      {label && <label className={s.formLabel}>{label}</label>}
      {children}
      {hint && <div className={s.formHint}>{hint}</div>}
    </div>
  )
}

export function FormRow({ children }) {
  return <div className={s.formRow}>{children}</div>
}

export function Input({ ...props }) {
  return <input className={s.input} {...props} />
}

export function Select({ children, ...props }) {
  return <select className={s.select} {...props}>{children}</select>
}

export function Textarea({ ...props }) {
  return <textarea className={s.textarea} {...props} />
}

// ── Toast ─────────────────────────────────────────────────────
let _showToast = null
export function setToastRef(fn) { _showToast = fn }
export function showToast(msg) { _showToast?.(msg) }

export function ToastContainer() {
  const [msg, setMsg] = useState(null)
  useEffect(() => { setToastRef(setMsg) }, [])
  useEffect(() => {
    if (!msg) return
    const t = setTimeout(() => setMsg(null), 2500)
    return () => clearTimeout(t)
  }, [msg])
  return msg ? <div className={s.toast}>{msg}</div> : null
}

// ── Color picker ──────────────────────────────────────────────
import { PROJECT_COLORS } from '../data/constants'
export function ColorPicker({ value, onChange }) {
  return (
    <div className={s.colorRow}>
      {PROJECT_COLORS.map(c => (
        <div
          key={c}
          className={`${s.colorDot} ${value === c ? s.colorDotActive : ''}`}
          style={{ background: c }}
          onClick={() => onChange(c)}
        />
      ))}
    </div>
  )
}
