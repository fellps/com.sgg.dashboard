
import request, { loggedUser } from './index'

export const types = async params => {
  const { uuid, token } = loggedUser()
  return request.get(`/usuarios/${uuid}/bilhetes-tipo`, {
    params,
    headers: { Authorization: `Bearer ${token}` }
  })
}

export const createType = async data => {
  const { uuid, token } = loggedUser()
  return request.post(`/usuarios/${uuid}/bilhetes-tipo`, data, {
    headers: { Authorization: `Bearer ${token}` }
  })
}

export const save = async ({ uuid: bilheteUuid, ...restData }) => {
  const { uuid, token } = loggedUser()

  if (bilheteUuid) {
    return request.put(`/usuarios/${uuid}/bilhetes/${bilheteUuid}`, restData, {
      headers: { Authorization: `Bearer ${token}` }
    })
  }

  return request.post(`/usuarios/${uuid}/eventos/${restData.uuid_evento}/bilhetes`, restData, {
    headers: { Authorization: `Bearer ${token}` }
  })
}

export const get = async ({ uuid_evento, ...params }) => {
  const { uuid, token } = loggedUser()
  return request.get(`/usuarios/${uuid}/eventos/${uuid_evento}/bilhetes`, {
    params,
    headers: { Authorization: `Bearer ${token}` }
  })
}
