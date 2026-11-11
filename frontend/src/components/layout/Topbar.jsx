const sectionNames = {
  clientes: 'Clientes',
  veiculos: 'Veículos',
  ordens: 'Ordens de serviço',
}

export default function Topbar({ section, session, onLogout }) {
  const initials = session.nome?.split(' ').map((part) => part[0]).slice(0, 2).join('')

  return (
    <header className="topbar">
      <div className="breadcrumb">Oficina <span>/</span> <strong>{sectionNames[section]}</strong></div>
      <div className="user-area">
        <div className="avatar">{initials}</div>
        <div className="user-name">{session.nome}<small>Equipe da oficina</small></div>
        <button className="logout" onClick={onLogout}>Sair <span>↗</span></button>
      </div>
    </header>
  )
}
