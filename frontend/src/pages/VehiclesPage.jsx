import { useEffect, useState } from 'react'
import { api } from '../services/api'

export default function VehiclesPage({ onFeedback }) {
  const [clientes, setClientes] = useState([])
  const [veiculos, setVeiculos] = useState([])
  const [error, setError] = useState('')

  async function loadData() {
    try {
      const [vehicleList, clientList] = await Promise.all([api.get('/veiculos'), api.get('/clientes')])
      setVeiculos(vehicleList)
      setClientes(clientList)
      setError('')
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  useEffect(() => { loadData() }, [])

  async function saveVehicle(event) {
    event.preventDefault()
    const form = event.currentTarget
    const payload = Object.fromEntries(new FormData(form).entries())
    payload.cliente_id = Number(payload.cliente_id)
    payload.ano = Number(payload.ano)
    try {
      await api.post('/veiculos', payload)
      form.reset()
      onFeedback('success', 'Veículo cadastrado.')
      await loadData()
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  return (
    <>
      {error && <div className="alert page-alert" role="alert">{error}</div>}
      <div className="panel">
        <div className="panel-head"><div><h2>Cadastrar veículo</h2><p>Vincule o veículo ao cadastro de um cliente.</p></div></div>
        <form className="inline-form" onSubmit={saveVehicle}>
          <div className="fields vehicle-fields">
            <label>Cliente<select name="cliente_id" required defaultValue=""><option value="" disabled>Selecione um cliente</option>{clientes.map((cliente) => <option key={cliente.id} value={cliente.id}>{cliente.nome}</option>)}</select></label>
            <label>Marca<input name="marca" placeholder="Ex.: Toyota" required /></label>
            <label>Modelo<input name="modelo" placeholder="Ex.: Corolla" required /></label>
            <label>Ano<input name="ano" type="number" min="1950" max="2100" placeholder="2024" required /></label>
            <label>Placa<input name="placa" placeholder="ABC1D23" required /></label>
            <button className="primary">Cadastrar veículo <span>＋</span></button>
          </div>
        </form>
        <div className="table-wrap">
          <table>
            <thead><tr><th>VEÍCULO</th><th>CLIENTE</th><th>ANO</th><th>PLACA</th></tr></thead>
            <tbody>{veiculos.map((veiculo) => <tr key={veiculo.id}><td><strong>{veiculo.marca} {veiculo.modelo}</strong></td><td>{veiculo.cliente_nome}</td><td>{veiculo.ano}</td><td><span className="plate">{veiculo.placa}</span></td></tr>)}</tbody>
          </table>
          {!veiculos.length && <div className="empty">Nenhum veículo cadastrado.</div>}
        </div>
      </div>
    </>
  )
}
