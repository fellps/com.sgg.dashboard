import axios from 'axios'

import config from '../config'

import cookies from 'js-cookie'

export const loggedUser = () => {
  const loggedUserCookie = cookies.get('loggedUser') || '{}'
  return JSON.parse(loggedUserCookie)
}

export default axios.create({
  baseURL: config.apiUrl,
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  // timeout: 1000,
})
