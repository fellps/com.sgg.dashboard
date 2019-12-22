
import { createReducer } from 'redux-act'

import { get, getOne, clearEmail, set, save } from './actions'

import {
  fulfilled,
  pending,
  rejected
} from '../../helpers/reducerPromiseHelper'

const initialState = {
  emails: {
    data: { items: [] }
  },

  email: {
  },

  response: { status: null }
}

export default createReducer({
  [fulfilled(get)]: (state, payload) => ({
    ...state,
    emails: payload.data
  }),

  [fulfilled(getOne)]: (state, payload) => {
    const email = payload.data.data

    return {
      ...state,
      email: {
        ...email
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
    email: {
      ...state.email,
      ...payload
    }
  }),

  [clearEmail]: state => ({
    ...state,
    email: { ...initialState.email }
  })
}, { ...initialState })
