import { useEffect, useState } from 'react'
import { api } from '../services/api'

export default function ClientsPage({ onFeedback }) {
  const [clientes, setClientes] = useState([])
  const [busca, setBusca] = useState('')
  const [editing, setEditing] = useState(null)
  const [error, setError] = useState('')

  async function loadClients() {
    try {
      setClientes(await api.get(`/clientes?busca=${encodeURIComponent(busca)}`))
      setError('')
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  useEffect(() => { loadClients() }, [busca])

  async function saveCustomer(event) {
    event.preventDefault()
    const form = event.currentTarget
    const payload = Object.fromEntries(new FormData(form).entries())
    const wasEditing = Boolean(editing)
    try {
      if (editing) await api.put(`/clientes/${editing.id}`, payload)
      else await api.post('/clientes', payload)
      setEditing(null)
      form.reset()
      onFeedback('success', wasEditing ? 'Cadastro atualizado.' : 'Cliente cadastrado.')
      await loadClients()
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  async function removeCustomer(id) {
    if (!window.confirm('Excluir este cliente e os veículos e serviços relacionados?')) return
    try {
      await api.delete(`/clientes/${id}`)
      onFeedback('success', 'Cliente excluído.')
      await loadClients()
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  return (
    <>
      {error && <div className="alert page-alert" role="alert">{error}</div>}
      <div className="stats-row">
        <div className="stat-card"><div className="stat-icon gold">◉</div><div><span>CLIENTES CADASTRADOS</span><strong>{clientes.length}</strong></div><small>na lista atual</small></div>
        <div className="stat-card"><div className="stat-icon blue">↗</div><div><span>CADASTRO ORGANIZADO</span><strong>100%</strong></div><small>dados protegidos</small></div>
      </div>
      <div className="panel">
        <div className="panel-head">
          <div><h2>Lista de clientes</h2><p>Visualize e atualize os cadastros da oficina.</p></div>
          <label className="search-box"><span>⌕</span><input placeholder="Buscar cliente..." value={busca} onChange={(event) => setBusca(event.target.value)} /><kbd>⌘ K</kbd></label>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>CLIENTE</th><th>CPF</th><th>TELEFONE</th><th>CADASTRO</th><th /></tr></thead>
            <tbody>{clientes.map((cliente) => (
              <tr key={cliente.id}>
                <td><div className="person"><span className="person-avatar">{cliente.nome.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span><strong>{cliente.nome}</strong></div></td>
                <td>{cliente.cpf || '—'}</td><td>{cliente.telefone}</td><td><span className="status-pill">Ativo</span></td>
                <td><div className="row-actions"><button title="Editar" onClick={() => { setEditing(cliente); window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }) }}>✎</button><button title="Excluir" onClick={() => removeCustomer(cliente.id)}>⌫</button></div></td>
              </tr>
            ))}</tbody>
          </table>
          {!clientes.length && <div className="empty">Nenhum cliente encontrado.</div>}
        </div>
        <form className="inline-form" onSubmit={saveCustomer} key={editing?.id || 'new'}>
          <div className="form-title"><div><h3>{editing ? 'Editar cliente' : 'Novo cliente'}</h3><p>Os dados pessoais são armazenados com proteção.</p></div>{editing && <button type="button" className="text-button" onClick={() => setEditing(null)}>Cancelar edição</button>}</div>
          <div className="fields">
            <label>Nome completo<input name="nome" defaultValue={editing?.nome} placeholder="Ex.: Ana Oliveira" required /></label>
            <label>CPF<input name="cpf" defaultValue={editing?.cpf} placeholder="000.000.000-00" required /></label>
            <label>Telefone<input name="telefone" defaultValue={editing?.telefone} placeholder="(11) 99999-9999" required /></label>
            <button className="primary">{editing ? 'Salvar alterações' : 'Adicionar cliente'} <span>＋</span></button>
          </div>
        </form>
      </div>
    </>
  )
}
