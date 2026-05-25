import { useState } from 'react'
import { Plus } from 'lucide-react'
import { GanttChart } from '../components/GanttChart'
import { Btn, Badge } from '../components/UI'
import { STATUS_META } from '../data/constants'
import { overallProgress } from '../utils/helpers'
import s from './Overview.module.css'

const VIEW_MODES = [
  { key: 'Month', label: '월' },
  { key: 'Week',  label: '주' },
  { key: 'Day',   label: '일' },
]

export function Overview({ projects, onAddProject, onProjectClick }) {
  const [viewMode, setViewMode] = useState('Month')

  const inprog = projects.filter(p => p.status === 'inprogress').length
  const planned = projects.filter(p => p.status === 'planned').length
  const done    = projects.filter(p => p.status === 'done').length

  return (
    <div className={s.page}>
      <div className={s.topbar}>
        <div>
          <h1 className={s.title}>팀 전체 프로젝트 일정</h1>
          <p className={s.sub}>오늘: {new Date().toLocaleDateString('ko-KR')} · 막대를 클릭하면 상세로 이동</p>
        </div>
        <div className={s.topRight}>
          <div className={s.viewSwitch}>
            {VIEW_MODES.map(v => (
              <button
                key={v.key}
                className={`${s.viewBtn} ${viewMode === v.key ? s.viewBtnActive : ''}`}
                onClick={() => setViewMode(v.key)}
              >{v.label}</button>
            ))}
          </div>
          <Btn variant="primary" size="sm" onClick={onAddProject}>
            <Plus size={14}/> 프로젝트 추가
          </Btn>
        </div>
      </div>

      {/* Stats */}
      <div className={s.stats}>
        {[
          { label: '전체', value: projects.length, color: '' },
          { label: '진행 중', value: inprog,  color: 'var(--blue)'  },
          { label: '예정',   value: planned, color: 'var(--text2)' },
          { label: '완료',   value: done,    color: 'var(--green)' },
        ].map(s2 => (
          <div key={s2.label} className={s.statCard}>
            <div className={s.statLabel}>{s2.label}</div>
            <div className={s.statValue} style={{ color: s2.color || 'var(--text)' }}>{s2.value}</div>
          </div>
        ))}
      </div>

      {/* Gantt */}
      <GanttChart
        projects={projects}
        viewMode={viewMode}
        onTaskClick={onProjectClick}
      />

      {/* Project list summary */}
      <div className={s.projList}>
        {projects.map(proj => {
          const prog = overallProgress(proj.modules)
          const sm = STATUS_META[proj.status]
          return (
            <div key={proj.id} className={s.projCard} onClick={() => onProjectClick(proj.id)}>
              <div className={s.projColorBar} style={{ background: proj.color }} />
              <div className={s.projCardBody}>
                <div className={s.projCardTop}>
                  <span className={s.projCardName}>{proj.name}</span>
                  <Badge variant={sm.cls.replace('badge-','')}>{sm.label}</Badge>
                </div>
                <div className={s.projCardMeta}>{proj.type} · {proj.start} ~ {proj.end}</div>
                <div className={s.progRow}>
                  <div className={s.progBar}>
                    <div className={s.progFill} style={{ width: `${prog}%`, background: proj.color }} />
                  </div>
                  <span className={s.progLabel}>{prog}%</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
