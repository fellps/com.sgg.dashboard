
import { createReducer } from 'redux-act'

import { get, getXls, clearWhoWorked, set } from './actions'

import { fulfilled } from '../../helpers/reducerPromiseHelper'

const initialState = {
  whoWorked: {
    data: { items: [] }
  },

  file: {},

  response: { status: null }
}

export default createReducer({
  [fulfilled(get)]: (state, payload) => ({
    ...state,
    whoWorked: payload.data
  }),

  [fulfilled(getXls)]: (state, response) => ({ ...state, file: response.data }),

  [set]: (state, payload) => ({
    ...state,
    whoWorked: {
      ...state.user,
      ...payload
    }
  }),

  [clearWhoWorked]: state => ({
    ...state,
    whoWorked: { ...initialState.user }
  })
}, { ...initialState })
