import request, { loggedUser } from './index'

export const get = async ({ ...restParams } = {}) => {
  const { token } = loggedUser()
  return request.get(`/whoworked`, {
    params: restParams,
    headers: { 'x-access-token': token }
  })
}

export const getXls = async ({ ...restParams } = {}) => {
  const { token } = loggedUser()
  return request.get(`/whoworked/xls`, {
    params: restParams,
    headers: { 'Content-Type': 'blob', 'x-access-token': token }
  })
}
