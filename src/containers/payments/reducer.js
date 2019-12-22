
import { createReducer } from 'redux-act'

import { get, getOne, clearPayment, set, save } from './actions'

import {
  fulfilled,
  pending,
  rejected
} from '../../helpers/reducerPromiseHelper'

const initialState = {
  payments: {
    data: { items: [] }
  },

  payment: {
  },

  response: { status: null }
}

export default createReducer({
  [fulfilled(get)]: (state, payload) => ({
    ...state,
    payments: payload.data
  }),

  [fulfilled(getOne)]: (state, payload) => {
    const payment = payload.data.data

    return {
      ...state,
      payment: {
        ...payment
      }
    }
  },

  [pending(save)]: state => ({
    ...state,
    response: { ...state.response, status: 'pending' }
  }),

  [rejected(save)]: (state, payload) => ({
    ...state,
    response: payload.response.data
  }),

  [set]: (state, payload) => ({
    ...state,
    payment: {
      ...state.payment,
      ...payload
    }
  }),

  [clearPayment]: state => ({
    ...state,
    payment: { ...initialState.payment }
  })
}, { ...initialState })
