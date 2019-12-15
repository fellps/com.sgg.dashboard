import { createReducer } from 'redux-act'

import {
  setLoggedUser
} from './actions'

const initialState = {
  loggedUser: {}
}

export default createReducer({
  [setLoggedUser]: (state, payload) => ({
    ...state,
    loggedUser: payload
  })
}, { ...initialState })
