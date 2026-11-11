const API_BASE = '/api'

async function request(path, options = {}) {
  const token = localStorage.getItem('token')
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  if (response.status === 401) {
    localStorage.removeItem('token')
    localStorage.removeItem('nome')
    window.dispatchEvent(new Event('session-expired'))
  }

  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data.error || 'Não foi possível concluir a solicitação.')
  }

  return response.status === 204 ? null : response.json()
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body) }),
  patch: (path, body) => request(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (path) => request(path, { method: 'DELETE' }),
}
