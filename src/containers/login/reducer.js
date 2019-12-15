import { createReducer } from 'redux-act'

import {
  set,
  login,
  setForgotPassword,
  forgotPassword,
  updatePassword
} from './actions'

import { rejected, pending, fulfilled } from '../../helpers/reducerPromiseHelper'

const initialState = {
  data: {},
  forgotPassword: {},
  forgotPasswordResponse: {
    status: null
  },
  response: {
    status: null
  }
}

export default createReducer({
  [set]: (state, payload) => ({
    ...state,
    data: { ...state.data, ...payload }
  }),

  [pending(login)]: state => ({
    ...state,
    response: { ...state.response, status: 'pending' }
  }),

  [rejected(login)]: (state, payload) => ({
    ...state,
    response: payload.response.data
  }),

  [fulfilled(forgotPassword)]: (state, payload) => {
    return ({
      ...state,
      forgotPasswordResponse: payload.data
    })
  },

  [rejected(forgotPassword)]: (state, payload) => ({
    ...state,
    forgotPasswordResponse: payload.response.data
  }),

  [rejected(updatePassword)]: (state, payload) => ({
    ...state,
    forgotPasswordResponse: payload.response.data
  }),

  [setForgotPassword]: (state, payload) => ({
    ...state,
    forgotPassword: { ...state.forgotPassword, ...payload }
  })
}, { ...initialState })
