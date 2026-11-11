import { useState } from 'react'
import { api } from '../services/api'

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(event) {
    event.preventDefault()
    setBusy(true)
    setErro('')
    try {
      const data = await api.post('/auth/login', { email, senha })
      localStorage.setItem('token', data.token)
      localStorage.setItem('nome', data.nome)
      onLogin(data)
    } catch (error) {
      setErro(error.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="login-shell">
      <div className="login-card">
        <div className="brand-mark">OB</div>
        <div className="eyebrow">GESTÃO DA OFICINA</div>
        <h1>Bem-vindo de volta</h1>
        <p className="muted">Entre para acompanhar a operação da oficina.</p>
        <form onSubmit={submit} className="form-stack">
          <label>E-mail<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
          <label>Senha<input type="password" value={senha} onChange={(event) => setSenha(event.target.value)} required /></label>
          {erro && <div className="alert">{erro}</div>}
          <button className="primary wide" disabled={busy}>
            {busy ? 'Entrando…' : 'Entrar na oficina'} <span>→</span>
          </button>
        </form>
        <div className="login-foot">Oficina Bortolotto <span>•</span> Acesso seguro</div>
      </div>
      <div className="login-side">
        <span className="side-kicker">CUIDADO QUE SE MOVE</span>
        <h2>Seu trabalho,<br />em boas mãos.</h2>
        <p>Clientes, veículos e serviços em um só lugar.</p>
        <div className="side-line" />
        <span className="side-small">OFICINA BORTOLOTTO · DESDE SEMPRE EM MOVIMENTO</span>
      </div>
    </main>
  )
}
