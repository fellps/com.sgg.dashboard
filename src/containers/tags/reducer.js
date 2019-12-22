
import { createReducer } from 'redux-act'

import { get, getOne, clearTag, set, save } from './actions'

import {
  fulfilled,
  pending,
  rejected
} from '../../helpers/reducerPromiseHelper'

const initialState = {
  tags: {
    data: { items: [] }
  },

  tag: {
  },

  response: { status: null }
}

export default createReducer({
  [fulfilled(get)]: (state, payload) => ({
    ...state,
    tags: payload.data
  }),

  [fulfilled(getOne)]: (state, payload) => {
    const tag = payload.data.data

    return {
      ...state,
      tag: {
        ...tag
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
    tag: {
      ...state.tag,
      ...payload
    }
  }),

  [clearTag]: state => ({
    ...state,
    tag: { ...initialState.tag }
  })
}, { ...initialState })
