import { useState } from 'react'
import { Login }    from './components/Login'
import { Sidebar }  from './components/Sidebar'
import { ToastContainer, showToast } from './components/UI'
import { ProjectModal, ModuleModal, MemoModal, FileModal } from './components/Modals'
import { Overview }  from './pages/Overview'
import { Detail }    from './pages/Detail'
import { Calendar }  from './pages/Calendar'
import { useStore }  from './hooks/useStore'
import s from './App.module.css'

export default function App() {
  // ── Auth ───────────────────────────────────────────────────
  const [user,   setUser]   = useState(null)
  const [access, setAccess] = useState(null)

  // ── Navigation ─────────────────────────────────────────────
  const [page,    setPage]    = useState('overview')
  const [projId,  setProjId]  = useState(null)

  // ── Store ──────────────────────────────────────────────────
  const store = useStore()

  // ── Modal state ────────────────────────────────────────────
  const [projModal,   setProjModal]   = useState({ open:false, initial:null })
  const [modModal,    setModModal]    = useState({ open:false, initial:null, idx:null })
  const [memoModal,   setMemoModal]   = useState({ open:false, initial:null })
  const [fileModal,   setFileModal]   = useState({ open:false, initial:null })

  // ── Derived ────────────────────────────────────────────────
  const visibleProjects = access?.projects === null
    ? store.projects
    : store.projects.filter(p => (access?.projects ?? []).includes(p.id))

  const activeProject = store.projects.find(p => p.id === projId)

  function handleLogin(name, acc) { setUser(name); setAccess(acc) }
  function handleLogout()         { setUser(null); setAccess(null); setPage('overview') }

  function goToProject(id) { setProjId(id); setPage('detail') }

  // ── Project CRUD ───────────────────────────────────────────
  function openAddProject()  { setProjModal({ open:true, initial:null }) }
  function openEditProject() { setProjModal({ open:true, initial:activeProject }) }

  function handleSaveProject(proj) {
    store.upsertProject(proj)
    showToast('프로젝트가 저장되었습니다.')
    if (!projId) setProjId(proj.id)
  }

  // ── Module CRUD ────────────────────────────────────────────
  function openAddModule()       { setModModal({ open:true, initial:null, idx:null }) }
  function openEditModule(idx)   {
    const mod = activeProject?.modules[idx]
    setModModal({ open:true, initial:mod, idx })
  }
  function handleSaveModule(mod) {
    store.upsertModule(projId, mod)
    showToast('모듈이 저장되었습니다.')
  }
  function handleDeleteModule(modId) {
    if (!confirm('이 모듈을 삭제할까요?')) return
    store.deleteModule(projId, modId)
    showToast('삭제되었습니다.')
  }

  // ── Memo CRUD ──────────────────────────────────────────────
  function openAddMemo()          { setMemoModal({ open:true, initial:null }) }
  function openEditMemo(memo)     { setMemoModal({ open:true, initial:memo }) }
  function handleSaveMemo(memo)   { store.upsertMemo(projId, memo); showToast('메모가 저장되었습니다.') }
  function handleDeleteMemo(id)   {
    if (!confirm('이 메모를 삭제할까요?')) return
    store.deleteMemo(projId, id); showToast('삭제되었습니다.')
  }
  function handleToggleMemoDone(id) {
    const memo = store.getProjectMemos(projId).find(m=>m.id===id)
    if (!memo) return
    store.upsertMemo(projId, { ...memo, done:!memo.done, doneAt:!memo.done?Date.now():null })
  }

  // ── File CRUD ──────────────────────────────────────────────
  function openAddFile()          { setFileModal({ open:true, initial:null }) }
  function openEditFile(file)     { setFileModal({ open:true, initial:file }) }
  function handleSaveFile(file)   { store.upsertFile(projId, file); showToast('파일 링크가 저장되었습니다.') }
  function handleDeleteFile(id)   {
    if (!confirm('이 파일 링크를 삭제할까요?')) return
    store.deleteFile(projId, id); showToast('삭제되었습니다.')
  }

  if (!user) return <Login onLogin={handleLogin}/>

  return (
    <div className={s.layout}>
      <Sidebar
        user={user} access={access}
        projects={visibleProjects}
        activePage={page} activeProjectId={projId}
        onNav={setPage} onProjectClick={goToProject}
        onLogout={handleLogout}
      />
      <div className={s.content}>
        {page === 'overview' && (
          <Overview
            projects={visibleProjects}
            onAddProject={openAddProject}
            onProjectClick={goToProject}
          />
        )}
        {page === 'detail' && activeProject && (
          <Detail
            project={activeProject}
            memos={store.getProjectMemos(projId)}
            files={store.getProjectFiles(projId)}
            onBack={() => setPage('overview')}
            onEditProject={openEditProject}
            onAddModule={openAddModule}
            onEditModule={openEditModule}
            onDeleteModule={handleDeleteModule}
            onAddMemo={openAddMemo}
            onEditMemo={openEditMemo}
            onDeleteMemo={handleDeleteMemo}
            onToggleMemoDone={handleToggleMemoDone}
            onAddFile={openAddFile}
            onEditFile={openEditFile}
            onDeleteFile={handleDeleteFile}
          />
        )}
        {page === 'calendar' && (
          <Calendar projects={visibleProjects} onProjectClick={goToProject}/>
        )}
      </div>

      {/* Modals */}
      <ProjectModal
        open={projModal.open} initial={projModal.initial}
        onClose={()=>setProjModal(m=>({...m,open:false}))}
        onSave={handleSaveProject}
      />
      <ModuleModal
        open={modModal.open} initial={modModal.initial}
        onClose={()=>setModModal(m=>({...m,open:false}))}
        onSave={handleSaveModule}
      />
      <MemoModal
        open={memoModal.open} initial={memoModal.initial}
        currentUser={user}
        onClose={()=>setMemoModal(m=>({...m,open:false}))}
        onSave={handleSaveMemo}
      />
      <FileModal
        open={fileModal.open} initial={fileModal.initial}
        currentUser={user}
        onClose={()=>setFileModal(m=>({...m,open:false}))}
        onSave={handleSaveFile}
      />

      <ToastContainer/>
    </div>
  )
}
