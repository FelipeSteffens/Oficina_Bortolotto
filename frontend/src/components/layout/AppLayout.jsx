import Sidebar from './Sidebar'
import Topbar from './Topbar'

export default function AppLayout({
  section,
  title,
  description,
  session,
  feedback,
  onNavigate,
  onLogout,
  onDismissFeedback,
  children,
}) {
  return (
    <div className="app-shell">
      <Sidebar section={section} onNavigate={onNavigate} />
      <main className="main-area">
        <Topbar section={section} session={session} onLogout={onLogout} />
        <div className="content">
          <div className="page-heading">
            <div>
              <div className="eyebrow">PAINEL DE CONTROLE</div>
              <h1>{title}</h1>
              <p>{description}</p>
            </div>
            <div className="date-chip"><span>◷</span> {new Intl.DateTimeFormat('pt-BR', { dateStyle: 'full' }).format(new Date())}</div>
          </div>
          {feedback && (
            <div className={`${feedback.type} page-alert`} role="status">
              {feedback.message}
              <button onClick={onDismissFeedback} aria-label="Fechar aviso">×</button>
            </div>
          )}
          {children}
          <footer className="page-footer">© 2026 Oficina Bortolotto <span>Feito para manter tudo em movimento.</span></footer>
        </div>
      </main>
    </div>
  )
}
