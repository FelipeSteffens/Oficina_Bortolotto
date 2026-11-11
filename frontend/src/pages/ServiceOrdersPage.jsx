import { useEffect, useState } from 'react'
import { api } from '../services/api'

export default function ServiceOrdersPage({ onFeedback }) {
  const [ordens, setOrdens] = useState([])
  const [error, setError] = useState('')

  async function loadOrders() {
    try {
      setOrdens(await api.get('/ordens-servico'))
      setError('')
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  useEffect(() => { loadOrders() }, [])

  async function reschedule(id, date) {
    if (!date) return
    try {
      await api.patch(`/ordens-servico/${id}`, { data_agendada: date })
      onFeedback('success', 'Data da ordem de serviço atualizada.')
      await loadOrders()
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  return (
    <>
      {error && <div className="alert page-alert" role="alert">{error}</div>}
      <div className="panel">
        <div className="panel-head"><div><h2>Agenda de serviços</h2><p>Serviços organizados pela próxima data agendada.</p></div><div className="count-chip">{ordens.length} serviços</div></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>CLIENTE</th><th>VEÍCULO</th><th>SERVIÇO</th><th>DATA AGENDADA</th><th>REMARCAR</th></tr></thead>
            <tbody>{ordens.map((ordem) => (
              <tr key={ordem.id}>
                <td><strong>{ordem.cliente_nome}</strong></td>
                <td>{ordem.marca} {ordem.modelo} <span className="plate">{ordem.placa}</span></td>
                <td>{ordem.descricao}</td>
                <td>{new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(`${ordem.data_agendada}T00:00:00Z`))}</td>
                <td><input className="date-input" aria-label="Nova data" type="date" defaultValue={ordem.data_agendada} onChange={(event) => reschedule(ordem.id, event.target.value)} /></td>
              </tr>
            ))}</tbody>
          </table>
          {!ordens.length && <div className="empty">Nenhuma ordem de serviço cadastrada.</div>}
        </div>
      </div>
    </>
  )
}
