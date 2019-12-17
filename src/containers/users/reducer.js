
import { createReducer } from 'redux-act'

import { get, getOne, getUserStatus, clearUser, set, save } from './actions'

import {
  fulfilled,
  pending,
  rejected
} from '../../helpers/reducerPromiseHelper'

const initialState = {
  users: {
    data: { items: [] }
  },

  user: {
    Documents: []
  },

  userStatus: [],

  transactions: [],

  response: { status: null }
}

export default createReducer({
  [fulfilled(get)]: (state, payload) => ({
    ...state,
    users: payload.data
  }),

  [fulfilled(getOne)]: (state, payload) => {
    const user = payload.data.data

    return {
      ...state,
      user: {
        ...user
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

  [fulfilled(getUserStatus)]: (state, payload) => ({
    ...state,
    response: payload.data,
    userStatus: payload.data.data.map(d => ({ name: d.Name, value: d.Code, id: d.IdUserStatus }))
  }),

  [set]: (state, payload) => ({
    ...state,
    user: {
      ...state.user,
      ...payload
    }
  }),

  [clearUser]: state => ({
    ...state,
    user: { ...initialState.user }
  })
}, { ...initialState })
