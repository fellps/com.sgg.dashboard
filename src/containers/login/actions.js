import { createAction } from 'redux-act'

import * as Auth from '../../api/auth'

export const set = createAction('SET_LOGIN')
export const login = createAction('LOGIN', Auth.login)

export const forgotPassword = createAction('FORGOT_PASSWORD', Auth.forgotPassword)
export const setForgotPassword = createAction('SET_FORGOT_PASSWORD')

export const updatePassword = createAction('UPDATE_PASSWORD', Auth.updatePassword)
