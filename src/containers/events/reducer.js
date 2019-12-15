import { createReducer } from 'redux-act'

import {
  set,
  get,
  getOne,
  save,
  clearEvent
} from './actions'

import moment from 'moment'

import { fulfilled, pending, rejected } from '../../helpers/reducerPromiseHelper'

const initialState = {
  events: {
    data: {
      items: []
    }
  },

  event: {
    isEnabled: false
  },

  response: { status: null }
}

export default createReducer({
  [clearEvent]: state => ({
    ...state,
    event: { ...initialState.event },
    response: { ...initialState.response }
  }),

  [fulfilled(getOne)]: (state, payload) => ({
    ...state,
    event: {
      ...state.event,
      ...payload.data.data,
      startTime: moment.utc(payload.data.data.startDate).format('HH:mm'),
      endTime: moment.utc(payload.data.data.endDate).format('HH:mm'),
      startDate: moment.utc(payload.data.data.startDate).format('DD/MM/YYYY'),
      endDate: moment.utc(payload.data.data.endDate).format('DD/MM/YYYY'),
      address: {
        address: payload.data.data.address,
        addressNumber: payload.data.data.addressNumber,
        city: payload.data.data.city,
        state: payload.data.data.state,
        cep: payload.data.data.cep
      }
    }
  }),

  [fulfilled(get)]: (state, payload) => ({
    ...state,
    events: payload.data
  }),

  [fulfilled(save)]: (state, payload) => ({
    ...state,
    event: {
      ...state.event,
      ...payload.data.data
    }
  }),

  [pending(save)]: state => ({
    ...state,
    response: { ...state.response, status: 'pending' }
  }),

  [rejected(save)]: (state, payload) => ({
    ...state,
    response: payload.response.data
  }),

  [set]: (state, payload) => {
    return {
      ...state,
      event: {
        ...state.event,
        ...payload
      }
    }
  }
}, { ...initialState })
