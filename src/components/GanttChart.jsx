import { useState } from 'react'
import { MODULE_COLORS } from '../data/constants'
import { overallProgress } from '../utils/helpers'
import s from './GanttChart.module.css'

export function GanttChart({ projects, viewMode = 'Month', onTaskClick }) {
  if (!projects?.length) return <div className={s.empty}>표시할 프로젝트가 없습니다.</div>

  // ── Date helpers ──────────────────────────────────────────
  const toMs = (str) => {
    if (!str) return Date.now()
    const d = new Date(str + 'T00:00:00')
    return isNaN(d) ? Date.now() : d.getTime()
  }
  const toDate = (str) => new Date(toMs(str))

  // ── Compute range ─────────────────────────────────────────
  let rangeStart, rangeEnd
  const allStarts = projects.map(p => toMs(p.start))
  const allEnds   = projects.map(p => toMs(p.end))
  projects.forEach(p => p.modules?.forEach(m => {
    allStarts.push(toMs(m.start)); allEnds.push(toMs(m.end))
  }))

  const today = new Date(); today.setHours(0,0,0,0)

  if (viewMode === 'Month') {
    rangeStart = new Date(today.getFullYear(), today.getMonth() - 1, 1)
    rangeEnd   = new Date(today.getFullYear(), today.getMonth() + 4, 0)
  } else if (viewMode === 'Week') {
    rangeStart = new Date(today); rangeStart.setDate(today.getDate() - 14)
    rangeEnd   = new Date(today); rangeEnd.setDate(today.getDate() + 42)
  } else {
    rangeStart = new Date(today); rangeStart.setDate(today.getDate() - 3)
    rangeEnd   = new Date(today); rangeEnd.setDate(today.getDate() + 14)
  }

  // Expand range to fit all projects
  rangeStart = new Date(Math.min(rangeStart.getTime(), ...allStarts))
  rangeEnd   = new Date(Math.max(rangeEnd.getTime(),   ...allEnds))
  // Add padding
  rangeStart.setDate(rangeStart.getDate() - 3)
  rangeEnd.setDate(rangeEnd.getDate() + 3)

  const totalMs   = rangeEnd.getTime() - rangeStart.getTime()
  const todayPct  = ((today.getTime() - rangeStart.getTime()) / totalMs) * 100

  const pct = (ms) => ((ms - rangeStart.getTime()) / totalMs) * 100
  const barLeft  = (start) => Math.max(0, pct(toMs(start)))
  const barWidth = (start, end) => Math.max(0.3, pct(toMs(end) + 86400000) - pct(toMs(start)))

  // ── Header columns ────────────────────────────────────────
  function buildCols() {
    const cols = []
    if (viewMode === 'Day') {
      let d = new Date(rangeStart)
      while (d <= rangeEnd) {
        cols.push({ label: `${d.getMonth()+1}/${d.getDate()}`, pct: pct(d.getTime()), date: new Date(d) })
        d.setDate(d.getDate() + 1)
      }
    } else if (viewMode === 'Week') {
      let d = new Date(rangeStart)
      d.setDate(d.getDate() - d.getDay() + 1) // Monday
      while (d <= rangeEnd) {
        cols.push({ label: `${d.getMonth()+1}/${d.getDate()}`, pct: pct(d.getTime()), date: new Date(d) })
        d.setDate(d.getDate() + 7)
      }
    } else {
      let d = new Date(rangeStart.getFullYear(), rangeStart.getMonth(), 1)
      while (d <= rangeEnd) {
        cols.push({ label: `${d.getFullYear()}년 ${d.getMonth()+1}월`, pct: pct(d.getTime()), date: new Date(d) })
        d.setMonth(d.getMonth() + 1)
      }
    }
    return cols
  }

  const cols = buildCols()
  const LABEL_W = 200

  return (
    <div className={s.wrapper}>
      <div className={s.scroll}>
        <div className={s.inner} style={{ minWidth: Math.max(800, cols.length * (viewMode==='Month' ? 120 : 60)) }}>

          {/* ── Header ── */}
          <div className={s.headerRow}>
            <div className={s.labelCol} style={{ width: LABEL_W }}>프로젝트 / 모듈</div>
            <div className={s.timelineCol}>
              {cols.map((col, i) => (
                <div key={i} className={s.colTick} style={{ left: `${col.pct}%` }}>
                  <span className={s.colLabel}>{col.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Rows ── */}
          {projects.map(proj => {
            const prog = overallProgress(proj.modules)
            const bl = barLeft(proj.start)
            const bw = barWidth(proj.start, proj.end)
            return (
              <ProjectRows
                key={proj.id}
                proj={proj} prog={prog}
                bl={bl} bw={bw}
                todayPct={todayPct}
                barLeft={barLeft} barWidth={barWidth}
                onTaskClick={onTaskClick}
                LABEL_W={LABEL_W}
              />
            )
          })}

        </div>
      </div>
    </div>
  )
}

function ProjectRows({ proj, prog, bl, bw, todayPct, barLeft, barWidth, onTaskClick, LABEL_W }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div>
      {/* Project row */}
      <div className={`${s.row} ${s.projRow}`}>
        <div className={s.labelCol} style={{ width: LABEL_W }}>
          <button className={s.expandBtn} onClick={() => setExpanded(e => !e)}>
            {expanded ? '▼' : '▶'}
          </button>
          <div className={s.projDot} style={{ background: proj.color }} />
          <div className={s.rowLabel}>
            <div className={s.rowName}>{proj.name}</div>
          </div>
        </div>
        <div className={s.timelineCol} style={{ cursor: 'pointer' }} onClick={() => onTaskClick?.(proj.id)}>
          {todayPct >= 0 && todayPct <= 100 &&
            <div className={s.todayLine} style={{ left: `${todayPct}%` }} />}
          {bw > 0 && (
            <div className={s.bar} style={{
              left: `${bl}%`, width: `${bw}%`,
              background: proj.color,
            }}>
              <div className={s.barFill} style={{ width: `${prog}%`, background: proj.color, filter: 'brightness(1.3)' }} />
              <span className={s.barLabel}>{proj.name} {prog}%</span>
            </div>
          )}
        </div>
      </div>

      {/* Module rows */}
      {expanded && proj.modules?.map(mod => {
        const mc = MODULE_COLORS[mod.name] || proj.color
        const ml = barLeft(mod.start)
        const mw = barWidth(mod.start, mod.end)
        return (
          <div key={mod.id} className={`${s.row} ${s.modRow}`}>
            <div className={s.labelCol} style={{ width: LABEL_W, paddingLeft: 32 }}>
              <div className={s.modDot} style={{ background: mc }} />
              <span className={s.modName}>{mod.name}</span>
            </div>
            <div className={s.timelineCol}>
              {todayPct >= 0 && todayPct <= 100 &&
                <div className={s.todayLine} style={{ left: `${todayPct}%` }} />}
              {mw > 0 && (
                <div className={s.bar} style={{
                  left: `${ml}%`, width: `${mw}%`,
                  height: 12, top: '50%', transform: 'translateY(-50%)',
                  background: mc + '44', border: `1.5px solid ${mc}`,
                }}>
                  <div className={s.barFill} style={{ width: `${mod.progress}%`, background: mc, height: '100%' }} />
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
