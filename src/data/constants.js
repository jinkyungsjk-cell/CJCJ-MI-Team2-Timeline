// ── Access codes ──────────────────────────────────────────────
// projects: null  → 전체 열람 (내부 팀)
// projects: ['p1','p2'] → 해당 프로젝트만 열람 (외부 업체)
export const ACCESS_CODES = {
  'mi2025':     { role: 'team',   label: 'MI팀 내부',          projects: null },
  'hpc2025':    { role: 'vendor', label: 'HPC 프로젝트 열람',   projects: ['p1'] },
  'beauty2025': { role: 'vendor', label: '뷰티 트렌드 열람',    projects: ['p2'] },
  'comp2025':   { role: 'vendor', label: '경쟁사 분석 열람',    projects: ['p3'] },
  'panel2025':  { role: 'vendor', label: '패널 리서치 열람',    projects: ['p4'] },
  'brand2025':  { role: 'vendor', label: '브랜드 헬스 열람',    projects: ['p6'] },
}

// ── Project type options ───────────────────────────────────────
export const PROJECT_TYPES = [
  'Consumer Survey', '트렌드 분석', '패널 리서치', '경쟁사 분석', '기타'
]

export const STATUS_META = {
  planned:    { label: '예정',    cls: 'badge-gray'   },
  inprogress: { label: '진행 중', cls: 'badge-blue'   },
  done:       { label: '완료',    cls: 'badge-green'  },
  hold:       { label: '보류',    cls: 'badge-amber'  },
}

// ── Project colors ─────────────────────────────────────────────
export const PROJECT_COLORS = [
  '#1a65b8','#1a8a5f','#d85a30','#5548b0',
  '#d4537e','#b06e10','#0f6e56','#888780',
]

// ── Module color map ───────────────────────────────────────────
export const MODULE_COLORS = {
  '법무 검토 및 품의': '#888780',
  '문항 설계':        '#378ADD',
  '링크 테스트':      '#85B7EB',
  '실사 진행':        '#D4537E',
  '데이터 프로세싱':  '#BA7517',
  '업체 결과물 검수': '#EF9F27',
  '분석 및 보고':     '#1D9E75',
  '트렌드 스캔':      '#5DCAA5',
  '문헌 조사':        '#9FE1CB',
  '인사이트 정리':    '#0F6E56',
  '경쟁사 포지셔닝':  '#D85A30',
  '패널 설계':        '#7F77DD',
  '패널 실사':        '#534AB7',
  '패널 분석':        '#3C3489',
}

// ── File type meta ─────────────────────────────────────────────
export const FILE_TYPES = {
  doc:      { label: '문서/보고서',  icon: '📄', color: '#1a65b8', bg: '#e8f0fb' },
  survey:   { label: '설문지',       icon: '📋', color: '#5548b0', bg: '#eceafb' },
  data:     { label: '데이터/분석',  icon: '📊', color: '#1a8a5f', bg: '#e0f3ec' },
  ppt:      { label: '발표자료',     icon: '📑', color: '#d85a30', bg: '#faece7' },
  contract: { label: '계약/품의',    icon: '📝', color: '#888780', bg: '#f1f0ec' },
  ref:      { label: '참고자료',     icon: '🔗', color: '#b06e10', bg: '#faecd6' },
  other:    { label: '기타',         icon: '📎', color: '#888780', bg: '#f1f0ec' },
}

// ── Recipient types (memo) ─────────────────────────────────────
export const RECIPIENT_TYPES = {
  internal: { label: '내부 팀',    color: '#1a65b8', bg: '#e8f0fb', textCol: '#0d4a8a' },
  dept:     { label: '유관부서',   color: '#5548b0', bg: '#eceafb', textCol: '#3c3389' },
  vendor:   { label: '외부 업체',  color: '#d85a30', bg: '#faece7', textCol: '#712b13' },
  all:      { label: '전체',       color: '#888780', bg: '#f1f0ec', textCol: '#444441' },
}

// ── Initial project data ───────────────────────────────────────
export const INITIAL_PROJECTS = [
  {
    id: 'p1', name: 'HPC 소비자 인식 조사',
    type: 'Consumer Survey', color: '#1a65b8', status: 'inprogress',
    owners: ['김지수'], client: '법인 내부 BU', vendor: 'Research Inc.', code: 'hpc2025',
    start: '2026-01-03', end: '2026-04-30',
    notes: '2월 설문 배포, 3월 실사 완료 목표. 법무팀 검토 완료.',
    modules: [
      { id:'m1', name:'법무 검토 및 품의', start:'2026-01-03', end:'2026-01-24', progress:100, owners:['이팀장'] },
      { id:'m2', name:'문항 설계',         start:'2026-01-25', end:'2026-02-14', progress:100, owners:['김지수'] },
      { id:'m3', name:'링크 테스트',       start:'2026-02-15', end:'2026-02-21', progress:100, owners:['김지수'] },
      { id:'m4', name:'실사 진행',         start:'2026-02-22', end:'2026-03-21', progress:100, owners:['Research Inc.'] },
      { id:'m5', name:'데이터 프로세싱',   start:'2026-03-22', end:'2026-04-04', progress:80,  owners:['Research Inc.'] },
      { id:'m6', name:'업체 결과물 검수',  start:'2026-04-05', end:'2026-04-18', progress:40,  owners:['김지수'] },
      { id:'m7', name:'분석 및 보고',      start:'2026-04-19', end:'2026-04-30', progress:0,   owners:['김지수'] },
    ],
  },
  {
    id: 'p2', name: '2025 뷰티 트렌드 리포트',
    type: '트렌드 분석', color: '#1a8a5f', status: 'inprogress',
    owners: ['박민준'], client: '마케팅팀', vendor: '–', code: 'beauty2025',
    start: '2026-02-01', end: '2026-05-31',
    notes: '반기 트렌드 분석 정기 과업. 외부 리포트 및 소셜 데이터 활용.',
    modules: [
      { id:'m1', name:'트렌드 스캔',   start:'2026-02-01', end:'2026-03-14', progress:100, owners:['박민준'] },
      { id:'m2', name:'문헌 조사',     start:'2026-03-01', end:'2026-04-11', progress:100, owners:['박민준'] },
      { id:'m3', name:'인사이트 정리', start:'2026-04-12', end:'2026-05-31', progress:30,  owners:['박민준'] },
    ],
  },
  {
    id: 'p3', name: '경쟁사 브랜드 포지셔닝 분석',
    type: '경쟁사 분석', color: '#d85a30', status: 'inprogress',
    owners: ['이수연'], client: '전략기획팀', vendor: 'GfK Korea', code: 'comp2025',
    start: '2026-03-15', end: '2026-06-30',
    notes: 'GfK 패널 데이터 활용. 5월 중간 보고 예정.',
    modules: [
      { id:'m1', name:'법무 검토 및 품의',  start:'2026-03-15', end:'2026-03-28', progress:100, owners:['이팀장'] },
      { id:'m2', name:'경쟁사 포지셔닝',    start:'2026-03-29', end:'2026-05-16', progress:65,  owners:['이수연'] },
      { id:'m3', name:'분석 및 보고',       start:'2026-05-17', end:'2026-06-30', progress:5,   owners:['이수연'] },
    ],
  },
  {
    id: 'p4', name: 'Q3 소비자 패널 리서치',
    type: '패널 리서치', color: '#5548b0', status: 'planned',
    owners: ['김지수'], client: 'R&D팀', vendor: 'Kantar Korea', code: 'panel2025',
    start: '2026-06-02', end: '2026-09-30',
    notes: 'Kantar 온라인 패널 활용 예정. 설계안 사전 검토 필요.',
    modules: [
      { id:'m1', name:'법무 검토 및 품의', start:'2026-06-02', end:'2026-06-20', progress:0, owners:['이팀장'] },
      { id:'m2', name:'패널 설계',         start:'2026-06-21', end:'2026-07-18', progress:0, owners:['김지수'] },
      { id:'m3', name:'패널 실사',         start:'2026-07-19', end:'2026-08-29', progress:0, owners:['Kantar Korea'] },
      { id:'m4', name:'패널 분석',         start:'2026-08-30', end:'2026-09-30', progress:0, owners:['김지수'] },
    ],
  },
  {
    id: 'p5', name: 'H2 트렌드 & 기회 리포트',
    type: '트렌드 분석', color: '#0f6e56', status: 'planned',
    owners: ['박민준'], client: '전사 경영진', vendor: '–', code: 'mi2025',
    start: '2026-07-01', end: '2026-10-31',
    notes: '상반기 리포트 후속. 하반기 전략 방향 연계.',
    modules: [
      { id:'m1', name:'트렌드 스캔',   start:'2026-07-01', end:'2026-08-15', progress:0, owners:['박민준'] },
      { id:'m2', name:'문헌 조사',     start:'2026-08-01', end:'2026-09-12', progress:0, owners:['박민준'] },
      { id:'m3', name:'인사이트 정리', start:'2026-09-13', end:'2026-10-31', progress:0, owners:['박민준'] },
    ],
  },
  {
    id: 'p6', name: 'Q4 브랜드 헬스 서베이',
    type: 'Consumer Survey', color: '#d4537e', status: 'planned',
    owners: ['이수연'], client: '브랜드팀', vendor: 'Embrain', code: 'brand2025',
    start: '2026-09-01', end: '2026-12-19',
    notes: '연간 브랜드 헬스 정기 서베이. Embrain 온라인 패널 활용.',
    modules: [
      { id:'m1', name:'법무 검토 및 품의', start:'2026-09-01', end:'2026-09-19', progress:0, owners:['이팀장'] },
      { id:'m2', name:'문항 설계',         start:'2026-09-20', end:'2026-10-17', progress:0, owners:['이수연'] },
      { id:'m3', name:'링크 테스트',       start:'2026-10-18', end:'2026-10-24', progress:0, owners:['이수연'] },
      { id:'m4', name:'실사 진행',         start:'2026-10-25', end:'2026-11-21', progress:0, owners:['Embrain'] },
      { id:'m5', name:'데이터 프로세싱',   start:'2026-11-22', end:'2026-12-05', progress:0, owners:['Embrain'] },
      { id:'m6', name:'업체 결과물 검수',  start:'2026-12-06', end:'2026-12-12', progress:0, owners:['이수연'] },
      { id:'m7', name:'분석 및 보고',      start:'2026-12-13', end:'2026-12-19', progress:0, owners:['이수연'] },
    ],
  },
]
