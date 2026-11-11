const tabs = [
  { id: 'clientes', label: 'Clientes', icon: '◉' },
  { id: 'veiculos', label: 'Veículos', icon: '▱' },
  { id: 'ordens', label: 'Ordens de serviço', icon: '▤' },
]

export default function Sidebar({ section, onNavigate }) {
  return (
    <aside className="sidebar">
      <a className="brand" href="#inicio">
        <span className="brand-mark small">OB</span>
        <span>Oficina<span className="brand-sub">BORTOLOTTO</span></span>
      </a>
      <div className="nav-label">OPERAÇÃO</div>
      <nav>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`nav-item ${section === tab.id ? 'active' : ''}`}
            onClick={() => onNavigate(tab.id)}
            aria-current={section === tab.id ? 'page' : undefined}
          >
            <span className="nav-icon">{tab.icon}</span>
            {tab.label}
            {section === tab.id && <i />}
          </button>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <div className="online-dot" /> Sistema operacional
        <span className="version">OFICINA · 2026</span>
      </div>
    </aside>
  )
}
