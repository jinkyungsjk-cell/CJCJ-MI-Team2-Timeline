import { useState, useCallback } from 'react'
import { INITIAL_PROJECTS } from '../data/constants'

const LS_PROJECTS = 'mi_projects_v2'
const LS_MEMOS    = 'mi_memos_v2'
const LS_FILES    = 'mi_files_v2'

function load(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback }
  catch { return fallback }
}
function save(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)) } catch {}
}

export function useStore() {
  const [projects, setProjectsRaw] = useState(() => load(LS_PROJECTS, INITIAL_PROJECTS))
  const [memos,    setMemosRaw]    = useState(() => load(LS_MEMOS, {}))
  const [files,    setFilesRaw]    = useState(() => load(LS_FILES, {}))

  const setProjects = useCallback(fn => {
    setProjectsRaw(prev => {
      const next = typeof fn === 'function' ? fn(prev) : fn
      save(LS_PROJECTS, next)
      return next
    })
  }, [])

  const setMemos = useCallback(fn => {
    setMemosRaw(prev => {
      const next = typeof fn === 'function' ? fn(prev) : fn
      save(LS_MEMOS, next)
      return next
    })
  }, [])

  const setFiles = useCallback(fn => {
    setFilesRaw(prev => {
      const next = typeof fn === 'function' ? fn(prev) : fn
      save(LS_FILES, next)
      return next
    })
  }, [])

  // ── Projects ──────────────────────────────────────────────────
  const upsertProject = useCallback((proj) => {
    setProjects(prev => {
      const idx = prev.findIndex(p => p.id === proj.id)
      if (idx >= 0) { const n = [...prev]; n[idx] = proj; return n }
      return [...prev, proj]
    })
  }, [setProjects])

  const deleteProject = useCallback((id) => {
    setProjects(prev => prev.filter(p => p.id !== id))
  }, [setProjects])

  // ── Modules ───────────────────────────────────────────────────
  const upsertModule = useCallback((projId, mod) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== projId) return p
      const idx = p.modules.findIndex(m => m.id === mod.id)
      const modules = idx >= 0
        ? p.modules.map((m,i) => i === idx ? mod : m)
        : [...p.modules, mod]
      return { ...p, modules }
    }))
  }, [setProjects])

  const deleteModule = useCallback((projId, modId) => {
    setProjects(prev => prev.map(p =>
      p.id !== projId ? p : { ...p, modules: p.modules.filter(m => m.id !== modId) }
    ))
  }, [setProjects])

  // ── Memos ─────────────────────────────────────────────────────
  const getProjectMemos = useCallback((projId) => memos[projId] ?? [], [memos])

  const upsertMemo = useCallback((projId, memo) => {
    setMemos(prev => {
      const list = prev[projId] ?? []
      const idx = list.findIndex(m => m.id === memo.id)
      const next = idx >= 0 ? list.map((m,i) => i === idx ? memo : m) : [...list, memo]
      return { ...prev, [projId]: next }
    })
  }, [setMemos])

  const deleteMemo = useCallback((projId, memoId) => {
    setMemos(prev => ({
      ...prev,
      [projId]: (prev[projId] ?? []).filter(m => m.id !== memoId),
    }))
  }, [setMemos])

  // ── Files ─────────────────────────────────────────────────────
  const getProjectFiles = useCallback((projId) => files[projId] ?? [], [files])

  const upsertFile = useCallback((projId, file) => {
    setFiles(prev => {
      const list = prev[projId] ?? []
      const idx = list.findIndex(f => f.id === file.id)
      const next = idx >= 0 ? list.map((f,i) => i === idx ? file : f) : [...list, file]
      return { ...prev, [projId]: next }
    })
  }, [setFiles])

  const deleteFile = useCallback((projId, fileId) => {
    setFiles(prev => ({
      ...prev,
      [projId]: (prev[projId] ?? []).filter(f => f.id !== fileId),
    }))
  }, [setFiles])

  return {
    projects, upsertProject, deleteProject,
    upsertModule, deleteModule,
    getProjectMemos, upsertMemo, deleteMemo,
    getProjectFiles, upsertFile, deleteFile,
  }
}
