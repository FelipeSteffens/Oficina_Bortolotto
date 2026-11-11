import { useEffect, useState } from 'react'
import './App.css'
import AppLayout from './components/layout/AppLayout'
import LoginPage from './pages/LoginPage'
import ClientsPage from './pages/ClientsPage'
import VehiclesPage from './pages/VehiclesPage'
import ServiceOrdersPage from './pages/ServiceOrdersPage'

const initialSession = () => ({
  token: localStorage.getItem('token'),
  nome: localStorage.getItem('nome'),
})

const pages = {
  clientes: { title: 'Clientes', description: 'Gerencie os cadastros e mantenha os dados em dia.', Component: ClientsPage },
  veiculos: { title: 'Veículos', description: 'Cadastre e acompanhe os veículos dos seus clientes.', Component: VehiclesPage },
  ordens: { title: 'Ordens de serviço', description: 'Acompanhe os serviços agendados e organize a agenda.', Component: ServiceOrdersPage },
}

export default function App() {
  const [session, setSession] = useState(initialSession)
  const [section, setSection] = useState('clientes')
  const [feedback, setFeedback] = useState(null)

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('nome')
    setSession({ token: null, nome: null })
  }

  useEffect(() => {
    window.addEventListener('session-expired', logout)
    return () => window.removeEventListener('session-expired', logout)
  }, [])

  function showFeedback(type, message) {
    setFeedback({ type, message })
  }

  if (!session.token) {
    return <LoginPage onLogin={(data) => setSession({ token: data.token, nome: data.nome })} />
  }

  const { title, description, Component } = pages[section]
  return (
    <AppLayout
      section={section}
      title={title}
      description={description}
      session={session}
      feedback={feedback}
      onNavigate={(nextSection) => {
        setSection(nextSection)
        setFeedback(null)
      }}
      onLogout={logout}
      onDismissFeedback={() => setFeedback(null)}
    >
      <Component onFeedback={showFeedback} />
    </AppLayout>
  )
}
