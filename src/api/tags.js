import request, { loggedUser } from './index'
import toFormData from '../helpers/toFormData'

export const get = async ({ ...restParams } = {}) => {
  const { token } = loggedUser()
  return request.get(`/tags/`, {
    params: restParams,
    headers: { 'x-access-token': token }
  })
}

export const getOne = async ({ IdTag, ...restParams } = {}) => {
  const { token } = loggedUser()
  return request.get(`/tags/${IdTag}`, {
    params: restParams,
    headers: { 'x-access-token': token }
  })
}

export const save = async ({ IdTag, ...restData }) => {
  const { token } = loggedUser()

  const formData = toFormData(restData)

  if (IdTag) {
    return request.put(`/tags/${IdTag || ''}`, formData, {
      headers: {
        'x-access-token': token,
        'Content-Type': 'multipart/form-data'
      }
    })
  }

  return request.post(`/tags`, formData, {
    headers: {
      'x-access-token': token,
      'Content-Type': 'multipart/form-data'
    }
  })
}
