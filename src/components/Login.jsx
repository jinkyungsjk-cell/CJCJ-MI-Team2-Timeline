import { useState } from 'react'
import { ACCESS_CODES } from '../data/constants'
import s from './Login.module.css'

export function Login({ onLogin }) {
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [err,  setErr]  = useState(false)

  function handleLogin() {
    const acc = ACCESS_CODES[code.trim()]
    if (!acc) { setErr(true); return }
    setErr(false)
    onLogin(name.trim() || '접속자', acc)
  }

  return (
    <div className={s.screen}>
      <div className={s.card}>
        <div className={s.logo}>MI</div>
        <h1 className={s.title}>MI팀 프로젝트 대시보드</h1>
        <p className={s.sub}>접속 권한 코드를 입력하세요.</p>
        <label className={s.label}>이름 / 소속</label>
        <input className={s.input} value={name} onChange={e=>setName(e.target.value)}
          placeholder="예) 김지수 / Research Inc."
          onKeyDown={e=>e.key==='Enter'&&document.getElementById('code-input').focus()}/>
        <label className={s.label}>접속 코드</label>
        <input id="code-input" className={s.input} type="password" value={code} onChange={e=>{setCode(e.target.value);setErr(false)}}
          placeholder="팀에서 공유받은 코드 입력"
          onKeyDown={e=>e.key==='Enter'&&handleLogin()}/>
        {err && <div className={s.err}>접속 코드가 올바르지 않습니다.</div>}
        <button className={s.btn} onClick={handleLogin}>접속하기</button>
        <div className={s.hint}>
          팀 내부: <code>mi2025</code> &nbsp;·&nbsp; 외부 업체: 각 프로젝트 코드 입력
        </div>
      </div>
    </div>
  )
}
