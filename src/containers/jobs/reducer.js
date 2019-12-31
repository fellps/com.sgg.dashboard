import { createReducer } from 'redux-act'

import {
  set,
  get,
  getOne,
  getAvailableUsers,
  save,
  sendPush,
  clearJob
} from './actions'

import moment from 'moment'

import { fulfilled, pending, rejected } from '../../helpers/reducerPromiseHelper'

const initialState = {
  jobs: {
    data: {
      items: []
    }
  },

  job: {
    isEnabled: false
  },

  availableUsers: 0,

  push: {},

  response: { status: null }
}

export default createReducer({
  [clearJob]: state => ({
    ...state,
    job: { ...initialState.job },
    response: { ...initialState.response }
  }),

  [fulfilled(getOne)]: (state, payload) => ({
    ...state,
    job: {
      ...state.job,
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

  [fulfilled(getAvailableUsers)]: (state, payload) => ({
    ...state,
    availableUsers: payload.data.data
  }),

  [fulfilled(get)]: (state, payload) => ({
    ...state,
    jobs: payload.data
  }),

  [fulfilled(save)]: (state, payload) => ({
    ...state,
    job: {
      ...state.job,
      ...payload.data.data
    }
  }),

  [fulfilled(sendPush)]: (state, payload) => ({
    ...state,
    push: {
      ...state.push,
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
      job: {
        ...state.job,
        ...payload
      }
    }
  }
}, { ...initialState })
