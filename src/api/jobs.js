import request, { loggedUser } from './index'
import toFormData from '../helpers/toFormData'

export const get = async ({ idEvent, idJob, ...restParams } = {}) => {
  const { token } = loggedUser()
  return request.get(`/events/jobs/${idEvent || ''}/${idJob || ''}`, {
    params: restParams,
    headers: { 'x-access-token': token }
  })
}

export const getAvailableUsers = async ({ ...restData } = {}) => {
  const { token } = loggedUser()

  const formData = toFormData(restData)

  return request.post(`/availableusers`, formData, {
    headers: {
      'x-access-token': token
    }
  })
}

export const save = async ({ IdEvent, IdJob, ...restData }) => {
  const { token } = loggedUser()

  const formData = toFormData(restData)

  if (IdJob) {
    return request.put(`/events/jobs/${IdEvent || ''}/${IdJob || ''}`, formData, {
      headers: {
        'x-access-token': token,
        'Content-Type': 'multipart/form-data'
      }
    })
  }

  return request.post(`/events/jobs/${IdEvent || ''}/${IdJob || ''}`, formData, {
    headers: {
      'x-access-token': token,
      'Content-Type': 'multipart/form-data'
    }
  })
}
