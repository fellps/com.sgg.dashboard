import request, { loggedUser } from './index'

export const get = async ({ uuid: acquirerId, ...restParams } = {}) => {
  const { token } = loggedUser()
  return request.get(`/acquirers/${acquirerId || ''}`, {
    params: restParams,
    headers: { 'x-access-token': token }
  })
}
