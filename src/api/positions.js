import request, { loggedUser } from './index'
import toFormData from '../helpers/toFormData'

export const get = async ({ uuid: jobId, ...restParams } = {}) => {
  const { token } = loggedUser()
  return request.get(`/positions/${jobId || ''}`, {
    params: restParams,
    headers: { 'x-access-token': token }
  })
}

export const save = async ({ IdJob, ...restData }) => {
  const { token } = loggedUser()

  const formData = toFormData(restData)

  if (IdJob) {
    return request.put(`/positions/${IdJob || ''}`, formData, {
      headers: {
        'x-access-token': token,
        'Content-Type': 'multipart/form-data'
      }
    })
  }

  return request.post(`/positions`, formData, {
    headers: {
      'x-access-token': token,
      'Content-Type': 'multipart/form-data'
    }
  })
}
