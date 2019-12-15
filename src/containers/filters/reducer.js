import { createReducer } from 'redux-act'

import { set, clearFilter } from './actions'

const initialState = { }

export default createReducer({
  [set]: (state, payload) => {
    return ({
      ...state,
      ...payload
    })
  },

  [clearFilter]: (state, payload) => {
    return ({})
  }
}, { ...initialState })
