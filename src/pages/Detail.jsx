import { useState } from 'react'
import { ArrowLeft, Plus, Edit2, Trash2, Check, Link, FileText } from 'lucide-react'
import { GanttChart } from '../components/GanttChart'
import { Badge, Btn, OwnerChips } from '../components/UI'
import { STATUS_META, MODULE_COLORS, FILE_TYPES, RECIPIENT_TYPES } from '../data/constants'
import { overallProgress, fmtDate, fmtShort, fmtDateTime } from '../utils/helpers'
import s from './Detail.module.css'

const VIEW_MODES = [
  { key: 'Month', label: '월' },
  { key: 'Week',  label: '주' },
  { key: 'Day',   label: '일' },
]

export function Detail({
  project, memos, files,
  onBack, onEditProject, onAddModule, onEditModule, onDeleteModule,
  onAddMemo, onEditMemo, onDeleteMemo, onToggleMemoDone,
  onAddFile, onEditFile, onDeleteFile,
}) {
  const [viewMode, setViewMode]     = useState('Month')
  const [memoFilter, setMemoFilter] = useState('all')
  const [fileFilter, setFileFilter] = useState('all')

  if (!project) return null
  const prog = overallProgress(project.modules)
  const sm = STATUS_META[project.status]

  // ── Memo filter logic ───────────────────────────────────────
  let filteredMemos = [...(memos ?? [])]
  if (memoFilter === 'pending') filteredMemos = filteredMemos.filter(m => !m.done)
  else if (memoFilter === 'done') filteredMemos = filteredMemos.filter(m => m.done)
  else if (memoFilter !== 'all') filteredMemos = filteredMemos.filter(m => m.recipientType === memoFilter)
  filteredMemos.sort((a,b) => (a.done === b.done ? b.createdAt - a.createdAt : a.done ? 1 : -1))

  // ── File filter logic ───────────────────────────────────────
  let filteredFiles = [...(files ?? [])]
  if (fileFilter !== 'all') filteredFiles = filteredFiles.filter(f => f.type === fileFilter)
  filteredFiles.sort((a,b) => b.createdAt - a.createdAt)

  const pendingCount = (memos ?? []).filter(m => !m.done).length
  const doneCount    = (memos ?? []).filter(m =>  m.done).length

  return (
    <div className={s.page}>
      {/* Top bar */}
      <div className={s.topbar}>
        <div>
          <button className={s.backBtn} onClick={onBack}><ArrowLeft size={14}/> 전체 일정으로</button>
          <div className={s.titleRow}>
            <div className={s.colorDot} style={{ background: project.color }} />
            <h1 className={s.title}>{project.name}</h1>
            <Badge variant={sm.cls.replace('badge-','')}>{sm.label}</Badge>
          </div>
          <div className={s.meta}>
            {project.type} · 의뢰: {project.client} · 업체: {project.vendor}
            · 외부코드: <b>{project.code || '–'}</b>
          </div>
        </div>
        <div className={s.topRight}>
          <div className={s.viewSwitch}>
            {VIEW_MODES.map(v => (
              <button key={v.key} className={`${s.viewBtn} ${viewMode===v.key?s.viewBtnActive:''}`} onClick={()=>setViewMode(v.key)}>{v.label}</button>
            ))}
          </div>
          <Btn size="sm" onClick={onEditProject}><Edit2 size={13}/> 편집</Btn>
        </div>
      </div>

      {/* Progress */}
      <div className={s.progSection}>
        <span className={s.progText}>전체 진행률</span>
        <div className={s.progBar}><div className={s.progFill} style={{ width:`${prog}%`, background:project.color }}/></div>
        <span className={s.progPct}>{prog}%</span>
      </div>

      {project.notes && <div className={s.notes}>📝 {project.notes}</div>}

      {/* Gantt */}
      <Section label="간트 차트">
        <GanttChart projects={[project]} viewMode={viewMode} />
      </Section>

      {/* Modules */}
      <Section label="모듈별 일정" action={<Btn size="sm" onClick={onAddModule}><Plus size={13}/> 모듈 추가</Btn>}>
        <div className={s.moduleTable}>
          <div className={s.moduleHeader}>
            <div>모듈</div><div>기간</div><div>담당자</div><div>진행률</div><div></div>
          </div>
          {project.modules.length === 0 && <div className={s.empty}>모듈이 없습니다.</div>}
          {project.modules.map((mod, i) => {
            const barCol = MODULE_COLORS[mod.name] || project.color
            return (
              <div key={mod.id} className={s.moduleRow}>
                <div className={s.modName}>
                  <div className={s.modDot} style={{ background: barCol }} />
                  {mod.name}
                </div>
                <div className={s.modDate}>{fmtShort(mod.start)} ~ {fmtShort(mod.end)}</div>
                <div><OwnerChips owners={mod.owners} /></div>
                <div className={s.modProg}>
                  <div className={s.miniProgBar}><div className={s.miniProgFill} style={{ width:`${mod.progress}%`, background:barCol }}/></div>
                  <span className={s.miniProgPct}>{mod.progress}%</span>
                </div>
                <div className={s.modActions}>
                  <Btn size="xs" variant="ghost" onClick={()=>onEditModule(i)}><Edit2 size={12}/></Btn>
                  <Btn size="xs" variant="danger" onClick={()=>onDeleteModule(mod.id)}><Trash2 size={12}/></Btn>
                </div>
              </div>
            )
          })}
        </div>
      </Section>

      {/* Files */}
      <Section label={`파일 아카이브 (${(files??[]).length})`} action={<Btn size="sm" onClick={onAddFile}><Plus size={13}/> 링크 추가</Btn>}>
        {/* File type filter */}
        <div className={s.filterBar}>
          <FilterBtn active={fileFilter==='all'} onClick={()=>setFileFilter('all')}>전체 ({(files??[]).length})</FilterBtn>
          {Object.entries(FILE_TYPES).map(([k,v]) => {
            const cnt = (files??[]).filter(f=>f.type===k).length
            if (!cnt) return null
            return <FilterBtn key={k} active={fileFilter===k} onClick={()=>setFileFilter(k)} accent={v.color}>{v.icon} {v.label} ({cnt})</FilterBtn>
          })}
        </div>
        {filteredFiles.length === 0
          ? <div className={s.empty}>등록된 파일 링크가 없습니다.<br/><small>+ 링크 추가 버튼으로 Google Drive, OneDrive, SharePoint 등 링크를 추가하세요.</small></div>
          : filteredFiles.map(file => {
            const ft = FILE_TYPES[file.type] || FILE_TYPES.other
            return (
              <div key={file.id} className={s.fileCard}>
                <div className={s.fileIcon} style={{ background:ft.bg }}>{ft.icon}</div>
                <div className={s.fileInfo}>
                  <a href={file.url} target="_blank" rel="noopener" className={s.fileName}>{file.name}</a>
                  <div className={s.fileMeta}>
                    <span style={{ background:ft.bg, color:ft.color }} className={s.fileTypeBadge}>{ft.label}</span>
                    · {file.uploader||'–'} · {new Date(file.createdAt).toLocaleDateString('ko-KR',{month:'numeric',day:'numeric'})}
                  </div>
                  {file.note && <div className={s.fileNote}>{file.note}</div>}
                </div>
                <div className={s.fileActions}>
                  <Btn size="xs" variant="ghost" onClick={()=>onEditFile(file)}><Edit2 size={12}/></Btn>
                  <Btn size="xs" variant="danger" onClick={()=>onDeleteFile(file.id)}><Trash2 size={12}/></Btn>
                </div>
              </div>
            )
          })
        }
      </Section>

      {/* Memos */}
      <Section label={`팀 메모 (미완료 ${pendingCount} · 완료 ${doneCount})`} action={<Btn size="sm" onClick={onAddMemo}><Plus size={13}/> 메모 작성</Btn>}>
        <div className={s.filterBar}>
          <FilterBtn active={memoFilter==='all'}     onClick={()=>setMemoFilter('all')}>전체 ({(memos??[]).length})</FilterBtn>
          <FilterBtn active={memoFilter==='pending'}  onClick={()=>setMemoFilter('pending')}>미완료 ({pendingCount})</FilterBtn>
          <FilterBtn active={memoFilter==='done'}     onClick={()=>setMemoFilter('done')}>완료 ({doneCount})</FilterBtn>
          {Object.entries(RECIPIENT_TYPES).map(([k,v]) => {
            const cnt = (memos??[]).filter(m=>m.recipientType===k).length
            if (!cnt) return null
            return <FilterBtn key={k} active={memoFilter===k} onClick={()=>setMemoFilter(k)} accent={v.color}>{v.label} ({cnt})</FilterBtn>
          })}
        </div>
        {filteredMemos.length === 0
          ? <div className={s.empty}>메모가 없습니다.</div>
          : filteredMemos.map(memo => {
            const rt = RECIPIENT_TYPES[memo.recipientType] || RECIPIENT_TYPES.all
            return (
              <div key={memo.id} className={`${s.memoCard} ${memo.done?s.memoDone:''}`} style={{ borderLeftColor: rt.color }}>
                <div className={s.memoHeader}>
                  <button className={`${s.checkbox} ${memo.done?s.checkboxDone:''}`} onClick={()=>onToggleMemoDone(memo.id)}>
                    {memo.done && <Check size={11}/>}
                  </button>
                  <div className={s.memoMeta}>
                    <div className={s.memoFrom}>
                      {memo.from} <span style={{color:rt.color}}>→ {memo.to}</span>
                    </div>
                    <div className={s.memoSubMeta}>
                      <span style={{ background:rt.bg, color:rt.textCol }} className={s.rtBadge}>{rt.label}</span>
                      {memo.priority === 'high' && <span className={s.priBadge} style={{background:'#fbeaea',color:'#d94040'}}>높음</span>}
                    </div>
                  </div>
                  <span className={s.memoDate}>{fmtDateTime(memo.createdAt)}</span>
                </div>
                <div className={s.memoBody}>{memo.body}</div>
                {memo.tags?.length > 0 && (
                  <div className={s.memoTags}>{memo.tags.map((t,i)=><span key={i} className={s.memoTag}>#{t}</span>)}</div>
                )}
                {memo.done && memo.doneAt && (
                  <div className={s.memoDoneAt}>✓ Follow-up 완료: {fmtDateTime(memo.doneAt)}</div>
                )}
                <div className={s.memoActions}>
                  <Btn size="xs" variant="ghost" onClick={()=>onEditMemo(memo)}><Edit2 size={12}/></Btn>
                  <Btn size="xs" variant="danger" onClick={()=>onDeleteMemo(memo.id)}><Trash2 size={12}/></Btn>
                </div>
              </div>
            )
          })
        }
      </Section>
    </div>
  )
}

function Section({ label, action, children }) {
  return (
    <div className={s.section}>
      <div className={s.sectionHeader}>
        <div className={s.sectionLabel}>{label}</div>
        {action}
      </div>
      {children}
    </div>
  )
}

function FilterBtn({ children, active, onClick, accent }) {
  return (
    <button
      className={`${s.filterBtn} ${active ? s.filterBtnActive : ''}`}
      onClick={onClick}
      style={!active && accent ? { borderLeft:`3px solid ${accent}` } : {}}
    >{children}</button>
  )
}
