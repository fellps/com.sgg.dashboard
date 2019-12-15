import { createReducer } from 'redux-act'

import { fulfilled, rejected } from '../../helpers/reducerPromiseHelper'

import {
  getOrdersDelivered
} from './actions'

const initialState = {
  ordersDelivered: {}
}

export default createReducer({
  [fulfilled(getOrdersDelivered)]: (state, payload) => ({
    ...state,
    ordersDelivered: payload.data.data
  }),

  [rejected(getOrdersDelivered)]: (state, payload) => ({
    ...state,
    ordersDelivered: { ...initialState.ordersDelivered }
  })
}, { ...initialState })
