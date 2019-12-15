import { createReducer } from 'redux-act'

import { fulfilled, rejected } from '../../helpers/reducerPromiseHelper'

import {
  getSalesSummary,
  getSalesSummaryExternal
} from './actions'

const initialState = {
  salesSummary: {}
}

export default createReducer({
  [fulfilled(getSalesSummary)]: (state, payload) => ({
    ...state,
    salesSummary: payload.data.data
  }),

  [rejected(getSalesSummary)]: (state, payload) => ({
    ...state,
    salesSummary: { ...initialState.salesSummary }
  }),

  [fulfilled(getSalesSummaryExternal)]: (state, payload) => ({
    ...state,
    salesSummary: payload.data.data
  }),

  [rejected(getSalesSummaryExternal)]: (state, payload) => ({
    ...state,
    salesSummary: { ...initialState.salesSummary }
  }),
}, { ...initialState })
