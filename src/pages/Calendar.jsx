import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { MODULE_COLORS } from '../data/constants'
import s from './Calendar.module.css'

const DAYS_KO = ['일','월','화','수','목','금','토']

export function Calendar({ projects, onProjectClick }) {
  const [view, setView]   = useState('month')
  const [cursor, setCursor] = useState(new Date())

  const today = new Date(); today.setHours(0,0,0,0)

  // ── Events for a given date ───────────────────────────────
  function eventsForDay(date) {
    const d = new Date(date); d.setHours(12,0,0,0)
    const events = []
    projects.forEach(proj => {
      proj.modules.forEach(mod => {
        const s2 = new Date(mod.start); s2.setHours(0,0,0,0)
        const e2 = new Date(mod.end);   e2.setHours(23,59,59,999)
        if (d >= s2 && d <= e2) {
          events.push({
            label: `${proj.name.substring(0,8)} · ${mod.name}`,
            color: MODULE_COLORS[mod.name] || proj.color,
            projId: proj.id,
          })
        }
      })
    })
    return events
  }

  // ── Month view ────────────────────────────────────────────
  function MonthView() {
    const y = cursor.getFullYear(), m = cursor.getMonth()
    const firstDow = new Date(y, m, 1).getDay()
    const daysInMonth = new Date(y, m+1, 0).getDate()
    const cells = []
    // Leading blanks
    for (let i = 0; i < firstDow; i++) {
      const d = new Date(y, m, 1 - firstDow + i)
      cells.push({ date: d, other: true })
    }
    for (let d = 1; d <= daysInMonth; d++) cells.push({ date: new Date(y, m, d), other: false })
    // Trailing blanks
    const trail = 7 - (cells.length % 7 || 7)
    for (let i = 1; i <= trail; i++) cells.push({ date: new Date(y, m+1, i), other: true })

    return (
      <div className={s.monthGrid}>
        {DAYS_KO.map(d => <div key={d} className={s.dayHeader}>{d}</div>)}
        {cells.map((cell, i) => {
          const isToday = cell.date.toDateString() === today.toDateString()
          const evs = cell.other ? [] : eventsForDay(cell.date)
          return (
            <div key={i} className={`${s.cell} ${cell.other?s.cellOther:''} ${isToday?s.cellToday:''}`}>
              <div className={s.cellDate}>{cell.date.getDate()}</div>
              {evs.slice(0,3).map((ev, j) => (
                <div key={j} className={s.event} style={{ background: ev.color }} onClick={()=>onProjectClick(ev.projId)} title={ev.label}>
                  {ev.label}
                </div>
              ))}
              {evs.length > 3 && <div className={s.eventMore}>+{evs.length-3}</div>}
            </div>
          )
        })}
      </div>
    )
  }

  // ── Week view ─────────────────────────────────────────────
  function WeekView() {
    const dow = cursor.getDay()
    const mon = new Date(cursor); mon.setDate(cursor.getDate() - dow)
    const days = Array.from({length:7},(_,i)=>{ const d=new Date(mon); d.setDate(mon.getDate()+i); return d })
    return (
      <div className={s.weekGrid}>
        <div className={s.weekHeaderRow}>
          <div className={s.timeCol}></div>
          {days.map((d,i) => {
            const isToday = d.toDateString() === today.toDateString()
            return (
              <div key={i} className={`${s.weekDayHeader} ${isToday?s.weekDayHeaderToday:''}`}>
                <div className={s.weekDayName}>{DAYS_KO[d.getDay()]}</div>
                <div className={`${s.weekDayNum} ${isToday?s.weekDayNumToday:''}`}>{d.getDate()}</div>
              </div>
            )
          })}
        </div>
        <div className={s.weekAllDay}>
          <div className={s.timeCol} style={{fontSize:'10px',color:'var(--text3)',paddingTop:6}}>종일</div>
          {days.map((d,i) => {
            const evs = eventsForDay(d)
            return (
              <div key={i} className={`${s.weekCell} ${d.toDateString()===today.toDateString()?s.weekCellToday:''}`}>
                {evs.slice(0,4).map((ev,j)=>(
                  <div key={j} className={s.event} style={{background:ev.color}} onClick={()=>onProjectClick(ev.projId)} title={ev.label}>
                    {ev.label}
                  </div>
                ))}
                {evs.length>4 && <div className={s.eventMore}>+{evs.length-4}</div>}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // ── Day view ──────────────────────────────────────────────
  function DayView() {
    const evs = eventsForDay(cursor)
    const isToday = cursor.toDateString() === today.toDateString()
    return (
      <div className={s.dayView}>
        <div className={s.dayViewHeader}>
          {cursor.getFullYear()}년 {cursor.getMonth()+1}월 {cursor.getDate()}일 ({DAYS_KO[cursor.getDay()]})
          {isToday && <span className={s.todayPill}>오늘</span>}
        </div>
        {evs.length === 0
          ? <div className={s.dayEmpty}>이 날 진행 중인 모듈이 없습니다.</div>
          : evs.map((ev,i) => (
            <div key={i} className={s.dayEvent} onClick={()=>onProjectClick(ev.projId)}>
              <div className={s.dayEventDot} style={{background:ev.color}}/>
              <span>{ev.label}</span>
            </div>
          ))
        }
      </div>
    )
  }

  // ── Navigation ────────────────────────────────────────────
  function nav(dir) {
    const d = new Date(cursor)
    if (view === 'month') d.setMonth(d.getMonth() + dir)
    else if (view === 'week') d.setDate(d.getDate() + dir * 7)
    else d.setDate(d.getDate() + dir)
    setCursor(d)
  }

  function navTitle() {
    if (view === 'month') return `${cursor.getFullYear()}년 ${cursor.getMonth()+1}월`
    if (view === 'week') {
      const dow = cursor.getDay()
      const mon = new Date(cursor); mon.setDate(cursor.getDate()-dow)
      const sun = new Date(mon); sun.setDate(mon.getDate()+6)
      return `${mon.getMonth()+1}/${mon.getDate()} – ${sun.getMonth()+1}/${sun.getDate()}`
    }
    return `${cursor.getFullYear()}년 ${cursor.getMonth()+1}월 ${cursor.getDate()}일`
  }

  return (
    <div className={s.page}>
      <div className={s.topbar}>
        <h1 className={s.title}>캘린더 뷰</h1>
        <div className={s.controls}>
          <div className={s.viewSwitch}>
            {['month','week','day'].map(v=>(
              <button key={v} className={`${s.viewBtn} ${view===v?s.viewBtnActive:''}`} onClick={()=>setView(v)}>
                {v==='month'?'월':v==='week'?'주':'일'}
              </button>
            ))}
          </div>
          <div className={s.navRow}>
            <button className={s.navBtn} onClick={()=>nav(-1)}><ChevronLeft size={16}/></button>
            <span className={s.navTitle}>{navTitle()}</span>
            <button className={s.navBtn} onClick={()=>nav(1)}><ChevronRight size={16}/></button>
            <button className={s.todayBtn} onClick={()=>setCursor(new Date())}>오늘</button>
          </div>
        </div>
      </div>
      <div className={s.calBody}>
        {view==='month' && <MonthView/>}
        {view==='week'  && <WeekView/>}
        {view==='day'   && <DayView/>}
      </div>
    </div>
  )
}
