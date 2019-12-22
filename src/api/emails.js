import request, { loggedUser } from './index'
import qs from 'qs'

export const get = async ({ ...restParams } = {}) => {
  const { token } = loggedUser()
  return request.get(`/emails/`, {
    params: restParams,
    headers: { 'x-access-token': token }
  })
}

export const getOne = async ({ IdEmail, ...restParams } = {}) => {
  const { token } = loggedUser()
  return request.get(`/emails/${IdEmail}`, {
    params: restParams,
    headers: { 'x-access-token': token }
  })
}

export const save = async ({ IdEmail, ...restData }) => {
  const { token } = loggedUser()
  return request.put(`/emails/${IdEmail}`, qs.stringify(restData), {
    headers: { 'x-access-token': token }
  })
}
