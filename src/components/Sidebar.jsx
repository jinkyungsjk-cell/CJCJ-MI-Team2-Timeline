import { LayoutDashboard, CalendarDays, LogOut, ChevronRight } from 'lucide-react'
import { STATUS_META } from '../data/constants'
import s from './Sidebar.module.css'

export function Sidebar({ user, access, projects, activePage, activeProjectId, onNav, onProjectClick, onLogout }) {
  return (
    <aside className={s.sidebar}>
      <div className={s.logo}>
        <div className={s.logoTitle}>MI팀 대시보드</div>
        <div className={s.logoSub}>{access?.label ?? ''}</div>
      </div>

      <nav className={s.nav}>
        <div className={s.navSection}>메뉴</div>

        <NavItem icon={<LayoutDashboard size={16}/>} label="팀 전체 일정"
          active={activePage === 'overview'}
          onClick={() => onNav('overview')} />
        <NavItem icon={<CalendarDays size={16}/>} label="캘린더 뷰"
          active={activePage === 'calendar'}
          onClick={() => onNav('calendar')} />

        <div className={s.navSection}>프로젝트</div>
        {projects.map(proj => (
          <div
            key={proj.id}
            className={`${s.projItem} ${activeProjectId === proj.id && activePage === 'detail' ? s.projItemActive : ''}`}
            onClick={() => onProjectClick(proj.id)}
          >
            <div className={s.projDot} style={{ background: proj.color }} />
            <span className={s.projName}>{proj.name}</span>
            <span className={`${s.statusDot} ${s[`status-${proj.status}`]}`} />
          </div>
        ))}
      </nav>

      <div className={s.bottom}>
        <div className={s.userChip}>
          <div className={s.avatar}>{(user || '?').slice(0, 2).toUpperCase()}</div>
          <div>
            <div className={s.userName}>{user || '접속자'}</div>
            <div className={s.userRole}>{access?.role === 'team' ? '내부 열람' : '외부 열람'}</div>
          </div>
          <button className={s.logoutBtn} onClick={onLogout} title="로그아웃">
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  )
}

function NavItem({ icon, label, active, onClick }) {
  return (
    <div className={`${s.navItem} ${active ? s.navItemActive : ''}`} onClick={onClick}>
      {icon}
      <span>{label}</span>
    </div>
  )
}
