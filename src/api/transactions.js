import request, { loggedUser } from './index'

export const get = async params => {
  const { uuid, token } = loggedUser()

  return request.get(`/usuarios/${uuid}/transacoes`, {
    params,
    headers: { Authorization: `Bearer ${token}` }
  })
}

export const checkin = async ({ codigo }) => {
  const { token } = loggedUser()

  return request.get(`/checkin/${codigo}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
}
