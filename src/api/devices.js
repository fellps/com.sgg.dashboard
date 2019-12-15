import request, { loggedUser } from './index'

import qs from 'qs'

export const get = async ({ uuid: eventId, ...restParams } = {}) => {
  const { token } = loggedUser()
  return request.get(`/devices/${eventId || ''}/list`, {
    params: restParams,
    headers: { 'x-access-token': token }
  })
}

export const getOne = async ({ uuidDevice: deviceId, ...restParams } = {}) => {
  const { token } = loggedUser()
  return request.get(`/devices/${deviceId || ''}`, {
    params: restParams,
    headers: { 'x-access-token': token }
  })
}

export const save = async ({ _id: deviceId, ...restData }) => {
  const { token } = loggedUser()

  if (deviceId) {
    return request.put(`/devices/${deviceId || ''}`, qs.stringify(restData), {
      headers: { 'x-access-token': token }
    })
  }

  return request.post(`/devices/${restData.eventId || ''}`, qs.stringify(restData), {
    headers: { 'x-access-token': token }
  })
}
