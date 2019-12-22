import request, { loggedUser } from './index'
import qs from 'qs'

export const get = async ({ ...restParams } = {}) => {
  const { token } = loggedUser()
  return request.get(`/payments/`, {
    params: restParams,
    headers: { 'x-access-token': token }
  })
}

export const getOne = async ({ IdPayment, ...restParams } = {}) => {
  const { token } = loggedUser()
  return request.get(`/payments/${IdPayment}`, {
    params: restParams,
    headers: { 'x-access-token': token }
  })
}

export const save = async ({ rows }) => {
  const { token } = loggedUser()
  return request.post(`/payments/`, qs.stringify(rows), {
    headers: { 'x-access-token': token }
  })
}
