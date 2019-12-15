import request, { loggedUser } from './index'
import toFormData from '../helpers/toFormData'

export const get = async ({ uuid: eventId, ...restParams } = {}) => {
  const { token } = loggedUser()
  return request.get(`/events/${eventId || ''}`, {
    params: restParams,
    headers: { 'x-access-token': token }
  })
}

export const save = async ({ IdEvent, ...restData }) => {
  const { token } = loggedUser()

  const formData = toFormData(restData)

  if (IdEvent) {
    return request.put(`/events/${IdEvent || ''}`, formData, {
      headers: {
        'x-access-token': token,
        'Content-Type': 'multipart/form-data'
      }
    })
  }

  return request.post(`/events`, formData, {
    headers: {
      'x-access-token': token,
      'Content-Type': 'multipart/form-data'
    }
  })
}
