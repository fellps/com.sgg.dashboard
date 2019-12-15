import { createReducer } from 'redux-act'

import { fulfilled, rejected } from '../../helpers/reducerPromiseHelper'

import {
  getCashierClosing
} from './actions'

const initialState = {
  cashierClosing: {}
}

export default createReducer({
  [fulfilled(getCashierClosing)]: (state, payload) => ({
    ...state,
    cashierClosing: payload.data.data
  }),

  [rejected(getCashierClosing)]: (state, payload) => ({
    ...state,
    cashierClosing: { ...initialState.cashierClosing }
  })
}, { ...initialState })
