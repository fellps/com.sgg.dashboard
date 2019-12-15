import request, { loggedUser } from './index'
import qs from 'qs'

export const get = async ({ uuid: eventId, ...restParams } = {}) => {
  const { token } = loggedUser()
  return request.get(`/menus/${eventId || ''}/list/`, {
    params: restParams,
    headers: { 'x-access-token': token }
  })
}

export const getOne = async ({ uuidMenu: menuId, ...restParams } = {}) => {
  const { token } = loggedUser()
  return request.get(`/menus/${menuId || ''}`, {
    params: restParams,
    headers: { 'x-access-token': token }
  })
}

export const save = async ({ menuId, ...restData }) => {
  const { token } = loggedUser()

  if (menuId) {
    return request.put(`/menus/${menuId || ''}`, qs.stringify(restData), {
      headers: { 'x-access-token': token }
    })
  }

  return request.post(`/menus/${restData.eventId || ''}`, qs.stringify(restData), {
    headers: { 'x-access-token': token }
  })
}

export const types = async params => {
  const { uuid, token } = loggedUser()
  return request.get(`/usuarios/${uuid}/eventos-tipo`, {
    params,
    headers: { Authorization: `Bearer ${token}` }
  })
}

export const balance = async ({ uuid_evento: uuidEvento, ...restParams }) => {
  const { uuid, token } = loggedUser()
  return request.get(`/usuarios/${uuid}/eventos/${uuidEvento}/saldo`, {
    params: restParams,
    headers: { Authorization: `Bearer ${token}` }
  })
}

export const withdraw = async ({ uuid_evento: uuidEvento, uuid_produtora: uuidProducer, ...restData }) => {
  const { uuid, token } = loggedUser()
  return request.post(
    `/usuarios/${uuid}/eventos/${uuidEvento}/produtoras/${uuidProducer}/saque`,
    restData,
    { headers: { Authorization: `Bearer ${token}` } }
  )
}
