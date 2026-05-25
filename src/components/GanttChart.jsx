import { useEffect, useRef } from 'react'
import { MODULE_COLORS } from '../data/constants'
import { overallProgress } from '../utils/helpers'
import s from './GanttChart.module.css'

// view: 'Quarter Day'|'Half Day'|'Day'|'Week'|'Month'
export function GanttChart({ projects, viewMode = 'Month', onTaskClick }) {
  const containerRef = useRef(null)
  const ganttRef = useRef(null)

  // Build frappe-gantt tasks from projects + modules
  function buildTasks(projects) {
    const tasks = []
    projects.forEach(proj => {
      const prog = overallProgress(proj.modules)
      // Project-level bar
      tasks.push({
        id: proj.id,
        name: proj.name,
        start: proj.start,
        end: proj.end,
        progress: prog,
        custom_class: `bar-proj`,
        color: proj.color,
        _proj: proj,
        _isProj: true,
      })
      // Module-level bars
      proj.modules.forEach(mod => {
        tasks.push({
          id: `${proj.id}__${mod.id}`,
          name: mod.name,
          start: mod.start,
          end: mod.end,
          progress: mod.progress ?? 0,
          dependencies: proj.id,
          custom_class: 'bar-mod',
          color: MODULE_COLORS[mod.name] || proj.color,
          _proj: proj,
          _mod: mod,
          _isProj: false,
        })
      })
    })
    return tasks
  }

  useEffect(() => {
    if (!containerRef.current || !projects?.length) return

    // Clear previous
    containerRef.current.innerHTML = ''

    const tasks = buildTasks(projects)
    if (!tasks.length) return

    try {
      const GanttLib = window.Gantt
      if (!GanttLib) { console.error('Gantt library not loaded'); return }
      ganttRef.current = new GanttLib(containerRef.current, tasks, {
        view_mode: viewMode,
        date_format: 'YYYY-MM-DD',
        language: 'ko',
        popup_trigger: 'click',
        on_click: (task) => {
          if (task._isProj) onTaskClick?.(task._proj.id)
          else onTaskClick?.(task._proj.id)
        },
        on_date_change: () => {},
        on_progress_change: () => {},
        on_view_change: () => {},
        custom_popup_html: (task) => {
          const p = task._proj
          const m = task._mod
          if (task._isProj) {
            return `
              <div style="padding:10px 14px;min-width:180px;font-family:Pretendard,sans-serif;">
                <div style="font-weight:600;font-size:13px;margin-bottom:4px;">${p.name}</div>
                <div style="font-size:11px;color:#6b6a66;">${p.type} · ${task.progress}% 완료</div>
                <div style="font-size:11px;color:#6b6a66;margin-top:2px;">${p.start} ~ ${p.end}</div>
                <div style="font-size:11px;color:#1a65b8;margin-top:6px;cursor:pointer;">클릭하여 상세 보기 →</div>
              </div>`
          }
          return `
            <div style="padding:10px 14px;min-width:180px;font-family:Pretendard,sans-serif;">
              <div style="font-weight:600;font-size:12px;margin-bottom:2px;">${m.name}</div>
              <div style="font-size:11px;color:#6b6a66;">${p.name}</div>
              <div style="font-size:11px;color:#6b6a66;margin-top:2px;">${m.start} ~ ${m.end}</div>
              <div style="font-size:11px;margin-top:4px;">진행률: <b>${task.progress}%</b></div>
            </div>`
        },
      })

      // Apply custom colors per bar after render
      setTimeout(() => {
        tasks.forEach(task => {
          const bars = containerRef.current?.querySelectorAll(`.bar-wrapper[data-id="${task.id}"]`)
          bars?.forEach(wrapper => {
            const bar = wrapper.querySelector('.bar')
            const progress = wrapper.querySelector('.bar-progress')
            if (bar) bar.style.fill = task.color + '33'
            if (bar) bar.style.stroke = task.color
            if (progress) progress.style.fill = task.color
          })
        })
      }, 100)

    } catch (e) {
      console.error('Gantt init error:', e)
    }
  }, [projects, viewMode])

  if (!projects?.length) {
    return <div className={s.empty}>표시할 프로젝트가 없습니다.</div>
  }

  return (
    <div className={s.wrapper}>
      <div ref={containerRef} className={s.gantt} />
    </div>
  )
}
