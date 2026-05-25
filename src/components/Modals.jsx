import { useState, useEffect } from 'react'
import { Modal, FormGroup, FormRow, Input, Select, Textarea, Btn, ColorPicker, showToast } from './UI'
import { PROJECT_TYPES, FILE_TYPES, RECIPIENT_TYPES } from '../data/constants'
import { parseDate, toISO, newId } from '../utils/helpers'

// ── Project Modal ─────────────────────────────────────────────
const EMPTY_PROJ = {
  name:'', type:'Consumer Survey', status:'planned', color:'#1a65b8',
  owners:'', client:'', vendor:'', code:'', notes:'', start:'', end:'',
}

export function ProjectModal({ open, onClose, initial, onSave }) {
  const [form, setForm] = useState(EMPTY_PROJ)

  useEffect(() => {
    if (!open) return
    if (initial) {
      setForm({ ...initial, owners: (initial.owners||[]).join(', ') })
    } else {
      setForm(EMPTY_PROJ)
    }
  }, [open, initial])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  function handleSave() {
    if (!form.name.trim())  { showToast('프로젝트명을 입력하세요.'); return }
    const startDate = parseDate(form.start)
    const endDate   = parseDate(form.end)
    if (!startDate) { showToast('시작일 형식을 확인하세요. (예: 25/06/01 또는 2025-06-01)'); return }
    if (!endDate)   { showToast('종료일 형식을 확인하세요.'); return }
    const owners = form.owners.split(',').map(o=>o.trim()).filter(Boolean)
    onSave({
      id: initial?.id || newId('p'),
      name: form.name.trim(), type: form.type, status: form.status,
      color: form.color, owners,
      client: form.client.trim(), vendor: form.vendor.trim(),
      code: form.code.trim(), notes: form.notes.trim(),
      start: toISO(startDate), end: toISO(endDate),
      modules: initial?.modules ?? [],
    })
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={initial ? '프로젝트 편집' : '프로젝트 추가'}
      footer={<><Btn onClick={onClose}>취소</Btn><Btn variant="primary" onClick={handleSave}>저장</Btn></>}
    >
      <FormGroup label="프로젝트명 *">
        <Input value={form.name} onChange={e=>set('name',e.target.value)} placeholder="예) HPC 소비자 인식 조사"/>
      </FormGroup>
      <FormRow>
        <FormGroup label="유형">
          <Select value={form.type} onChange={e=>set('type',e.target.value)}>
            {PROJECT_TYPES.map(t=><option key={t}>{t}</option>)}
          </Select>
        </FormGroup>
        <FormGroup label="상태">
          <Select value={form.status} onChange={e=>set('status',e.target.value)}>
            <option value="planned">예정</option>
            <option value="inprogress">진행 중</option>
            <option value="done">완료</option>
            <option value="hold">보류</option>
          </Select>
        </FormGroup>
      </FormRow>
      <FormRow>
        <FormGroup label="시작일 *" hint="YY/MM/DD 또는 YYYY-MM-DD">
          <Input value={form.start} onChange={e=>set('start',e.target.value)} placeholder="25/06/01"/>
        </FormGroup>
        <FormGroup label="종료일 *">
          <Input value={form.end} onChange={e=>set('end',e.target.value)} placeholder="25/09/30"/>
        </FormGroup>
      </FormRow>
      <FormGroup label="담당자" hint="쉼표로 여러 명 입력 가능">
        <Input value={form.owners} onChange={e=>set('owners',e.target.value)} placeholder="예) 김지수, 박민준"/>
      </FormGroup>
      <FormRow>
        <FormGroup label="의뢰 부서">
          <Input value={form.client} onChange={e=>set('client',e.target.value)} placeholder="마케팅팀"/>
        </FormGroup>
        <FormGroup label="외부 업체 / Vendor">
          <Input value={form.vendor} onChange={e=>set('vendor',e.target.value)} placeholder="Research Inc."/>
        </FormGroup>
      </FormRow>
      <FormGroup label="외부 접속 코드" hint="외부 업체에게 이 코드 공유">
        <Input value={form.code} onChange={e=>set('code',e.target.value)} placeholder="예) hpc2025"/>
      </FormGroup>
      <FormGroup label="색상">
        <ColorPicker value={form.color} onChange={v=>set('color',v)}/>
      </FormGroup>
      <FormGroup label="메모">
        <Textarea value={form.notes} onChange={e=>set('notes',e.target.value)} placeholder="특이사항 등"/>
      </FormGroup>
    </Modal>
  )
}

// ── Module Modal ──────────────────────────────────────────────
const EMPTY_MOD = { name:'', start:'', end:'', owners:'', progress:0 }

export function ModuleModal({ open, onClose, initial, onSave }) {
  const [form, setForm] = useState(EMPTY_MOD)

  useEffect(() => {
    if (!open) return
    if (initial) setForm({ ...initial, owners: (initial.owners||[]).join(', ') })
    else setForm(EMPTY_MOD)
  }, [open, initial])

  const set = (k,v) => setForm(f=>({...f,[k]:v}))

  function handleSave() {
    if (!form.name.trim()) { showToast('모듈명을 입력하세요.'); return }
    const startDate = parseDate(form.start)
    const endDate   = parseDate(form.end)
    if (!startDate) { showToast('시작일 형식을 확인하세요.'); return }
    if (!endDate)   { showToast('종료일 형식을 확인하세요.'); return }
    const owners = form.owners.split(',').map(o=>o.trim()).filter(Boolean)
    onSave({
      id: initial?.id || newId('m'),
      name: form.name.trim(), owners,
      start: toISO(startDate), end: toISO(endDate),
      progress: Math.min(100, Math.max(0, Number(form.progress)||0)),
    })
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={initial ? '모듈 편집' : '모듈 추가'}
      footer={<><Btn onClick={onClose}>취소</Btn><Btn variant="primary" onClick={handleSave}>저장</Btn></>}
    >
      <FormGroup label="모듈명 *">
        <Input value={form.name} onChange={e=>set('name',e.target.value)} placeholder="예) 실사 진행"/>
      </FormGroup>
      <FormRow>
        <FormGroup label="시작일 *" hint="YY/MM/DD 또는 YYYY-MM-DD">
          <Input value={form.start} onChange={e=>set('start',e.target.value)} placeholder="25/06/01"/>
        </FormGroup>
        <FormGroup label="종료일 *">
          <Input value={form.end} onChange={e=>set('end',e.target.value)} placeholder="25/06/30"/>
        </FormGroup>
      </FormRow>
      <FormGroup label="담당자" hint="쉼표로 여러 명 입력 가능">
        <Input value={form.owners} onChange={e=>set('owners',e.target.value)} placeholder="김지수, Research Inc."/>
      </FormGroup>
      <FormGroup label="진행률 (%)">
        <Input type="number" min="0" max="100" value={form.progress} onChange={e=>set('progress',e.target.value)}/>
      </FormGroup>
    </Modal>
  )
}

// ── Memo Modal ────────────────────────────────────────────────
const EMPTY_MEMO = { from:'', to:'', recipientType:'internal', body:'', tags:'', priority:'normal' }

export function MemoModal({ open, onClose, initial, currentUser, onSave }) {
  const [form, setForm] = useState(EMPTY_MEMO)

  useEffect(() => {
    if (!open) return
    if (initial) setForm({ ...initial, tags:(initial.tags||[]).join(', ') })
    else setForm({ ...EMPTY_MEMO, from: currentUser || '' })
  }, [open, initial, currentUser])

  const set = (k,v) => setForm(f=>({...f,[k]:v}))

  function handleSave() {
    if (!form.from.trim()) { showToast('작성자를 입력하세요.'); return }
    if (!form.to.trim())   { showToast('수신자를 입력하세요.'); return }
    if (!form.body.trim()) { showToast('메모 내용을 입력하세요.'); return }
    const tags = form.tags.split(',').map(t=>t.trim()).filter(Boolean)
    onSave({
      id: initial?.id || newId('memo'),
      from: form.from.trim(), to: form.to.trim(),
      recipientType: form.recipientType,
      body: form.body.trim(), tags,
      priority: form.priority,
      done: initial?.done ?? false,
      doneAt: initial?.doneAt ?? null,
      createdAt: initial?.createdAt ?? Date.now(),
      updatedAt: Date.now(),
    })
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={initial ? '메모 편집' : '메모 작성'}
      footer={<><Btn onClick={onClose}>취소</Btn><Btn variant="primary" onClick={handleSave}>저장</Btn></>}
    >
      <FormRow>
        <FormGroup label="작성자 (From) *">
          <Input value={form.from} onChange={e=>set('from',e.target.value)} placeholder="김지수"/>
        </FormGroup>
        <FormGroup label="수신자 (To) *" hint="쉼표로 여러 명 가능">
          <Input value={form.to} onChange={e=>set('to',e.target.value)} placeholder="Research Inc. 담당자"/>
        </FormGroup>
      </FormRow>
      <FormRow>
        <FormGroup label="수신자 유형">
          <Select value={form.recipientType} onChange={e=>set('recipientType',e.target.value)}>
            {Object.entries(RECIPIENT_TYPES).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
          </Select>
        </FormGroup>
        <FormGroup label="우선순위">
          <Select value={form.priority} onChange={e=>set('priority',e.target.value)}>
            <option value="normal">보통</option>
            <option value="high">높음</option>
            <option value="low">낮음</option>
          </Select>
        </FormGroup>
      </FormRow>
      <FormGroup label="메모 내용 *">
        <Textarea value={form.body} onChange={e=>set('body',e.target.value)} placeholder="메모 내용을 입력하세요." rows={4}/>
      </FormGroup>
      <FormGroup label="태그 (선택)" hint="쉼표로 구분">
        <Input value={form.tags} onChange={e=>set('tags',e.target.value)} placeholder="확인요청, 피드백, 일정변경"/>
      </FormGroup>
    </Modal>
  )
}

// ── File Modal ────────────────────────────────────────────────
const EMPTY_FILE = { name:'', url:'', type:'doc', uploader:'', note:'' }

export function FileModal({ open, onClose, initial, currentUser, onSave }) {
  const [form, setForm] = useState(EMPTY_FILE)

  useEffect(() => {
    if (!open) return
    if (initial) setForm(initial)
    else setForm({ ...EMPTY_FILE, uploader: currentUser || '' })
  }, [open, initial, currentUser])

  const set = (k,v) => setForm(f=>({...f,[k]:v}))

  function handleSave() {
    if (!form.name.trim()) { showToast('파일명을 입력하세요.'); return }
    if (!form.url.trim())  { showToast('링크 URL을 입력하세요.'); return }
    if (!form.url.startsWith('http')) { showToast('http:// 또는 https://로 시작하는 URL을 입력하세요.'); return }
    onSave({
      id: initial?.id || newId('file'),
      name: form.name.trim(), url: form.url.trim(),
      type: form.type, uploader: form.uploader.trim(), note: form.note.trim(),
      createdAt: initial?.createdAt ?? Date.now(),
      updatedAt: Date.now(),
    })
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={initial ? '파일 링크 편집' : '파일 링크 추가'}
      footer={<><Btn onClick={onClose}>취소</Btn><Btn variant="primary" onClick={handleSave}>저장</Btn></>}
    >
      <FormGroup label="파일명 / 제목 *">
        <Input value={form.name} onChange={e=>set('name',e.target.value)} placeholder="예) HPC 설문지 최종본 v3"/>
      </FormGroup>
      <FormGroup label="링크 URL *" hint="Google Drive, OneDrive, SharePoint, Dropbox 등">
        <Input value={form.url} onChange={e=>set('url',e.target.value)} placeholder="https://..."/>
      </FormGroup>
      <FormRow>
        <FormGroup label="파일 유형">
          <Select value={form.type} onChange={e=>set('type',e.target.value)}>
            {Object.entries(FILE_TYPES).map(([k,v])=><option key={k} value={k}>{v.icon} {v.label}</option>)}
          </Select>
        </FormGroup>
        <FormGroup label="업로드한 사람">
          <Input value={form.uploader} onChange={e=>set('uploader',e.target.value)} placeholder="김지수"/>
        </FormGroup>
      </FormRow>
      <FormGroup label="메모 (선택)">
        <Input value={form.note} onChange={e=>set('note',e.target.value)} placeholder="법무 검토 완료본, 최종 배포 전 버전"/>
      </FormGroup>
    </Modal>
  )
}
