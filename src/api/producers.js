import request, { loggedUser } from './index'
import qs from 'qs'

export const get = async ({ uuid: producerId, ...restParams } = {}) => {
  const { token } = loggedUser()
  return request.get(`/producers/${producerId || ''}`, {
    params: restParams,
    headers: { 'x-access-token': token }
  })
}

export const save = async ({ _id: producerId, ...restData } = {}) => {
  const { token } = loggedUser()

  if (producerId) {
    return request.put(`/producers/${producerId || ''}`, qs.stringify(restData), {
      headers: { 'x-access-token': token }
    })
  }

  return request.post(`/producers`, qs.stringify(restData), {
    headers: { 'x-access-token': token }
  })
}

export const getEvents = async ({ uuidProducer }) => {
  const { token } = loggedUser()
  return request.get(`/producers/${uuidProducer || ''}/eventos`, {
    headers: { 'x-access-token': token }
  })
}
