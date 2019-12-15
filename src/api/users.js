import request, { loggedUser } from './index'
import qs from 'qs'

export const get = async ({ uuid: userId, ...restParams } = {}) => {
  const { token } = loggedUser()
  return request.get(`/users/`, {
    params: restParams,
    headers: { 'x-access-token': token }
  })
}

export const getOne = async ({ _id: userId, ...restParams } = {}) => {
  const { token } = loggedUser()
  return request.get(`/users/${userId}`, {
    params: restParams,
    headers: { 'x-access-token': token }
  })
}

export const getUserStatus = async ({ ...restParams } = {}) => {
  const { token } = loggedUser()
  return request.get(`/userstatus`, {
    params: restParams,
    headers: { 'x-access-token': token }
  })
}

export const save = async ({ IdUser, ...restData }) => {
  const { token } = loggedUser()
  return request.put(`/users/${IdUser}`, qs.stringify(restData), {
    headers: { 'x-access-token': token }
  })
}

export const getCashiers = async ({ uuid: eventId, ...restParams } = {}) => {
  const { token } = loggedUser()
  return request.get(`/users/cashiers/${eventId || ''}`, {
    params: restParams,
    headers: { 'x-access-token': token }
  })
}
