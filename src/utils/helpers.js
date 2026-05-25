// ── Date parsing ──────────────────────────────────────────────
// Accepts: YY/MM/DD, YY-MM-DD, YYYY-MM-DD, YYYY/MM/DD
export function parseDate(str) {
  if (!str) return null
  const s = String(str).trim()
  let m
  m = s.match(/^(\d{2})[\/\-](\d{2})[\/\-](\d{2})$/)
  if (m) return new Date(2000 + +m[1], +m[2] - 1, +m[3])
  m = s.match(/^(\d{4})[\/\-](\d{2})[\/\-](\d{2})$/)
  if (m) return new Date(+m[1], +m[2] - 1, +m[3])
  return null
}

export function toISO(d) {
  if (!d) return ''
  const dt = d instanceof Date ? d : parseDate(d)
  if (!dt || isNaN(dt)) return String(d)
  return `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}-${String(dt.getDate()).padStart(2,'0')}`
}

export function fmtDate(str) {
  const d = str instanceof Date ? str : parseDate(str)
  if (!d || isNaN(d)) return str ?? ''
  return `${d.getFullYear()}/${String(d.getMonth()+1).padStart(2,'0')}/${String(d.getDate()).padStart(2,'0')}`
}

export function fmtShort(str) {
  const d = str instanceof Date ? str : parseDate(str)
  if (!d || isNaN(d)) return str ?? ''
  return `${d.getMonth()+1}/${d.getDate()}`
}

export function fmtDateTime(ts) {
  if (!ts) return ''
  const d = new Date(ts)
  return `${d.getMonth()+1}/${d.getDate()} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
}

// ── ID generation ─────────────────────────────────────────────
export function newId(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2,7)}`
}

// ── Progress helpers ──────────────────────────────────────────
export function overallProgress(modules) {
  if (!modules?.length) return 0
  return Math.round(modules.reduce((s, m) => s + (m.progress ?? 0), 0) / modules.length)
}
