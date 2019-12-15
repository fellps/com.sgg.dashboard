import { createReducer } from 'redux-act'

import {
  set,
  get,
  getOne,
  getAcquirers,
  save,
  clearDevice,
  setShowQRCode
} from './actions'

import { fulfilled, pending, rejected } from '../../helpers/reducerPromiseHelper'

const initialState = {
  devices: {
    data: {
      items: []
    }
  },
  device: {},
  response: {
    status: null
  },
  showQRCode: {
    show: false,
    id: null
  },
  acquirers: []
}

export default createReducer({
  [set]: (state, payload) => {
    return {
      ...state,
      device: {
        ...state.device,
        ...payload
      }
    }
  },

  [setShowQRCode]: (state, payload) => ({
    ...state,
    showQRCode: {
      ...state.showQRCode,
      ...payload
    }
  }),

  [fulfilled(get)]: (state, payload) => ({
    ...state,
    devices: payload.data
  }),

  [rejected(get)]: (state, payload) => ({
    ...state,
    devices: payload.response.data
  }),

  [fulfilled(getOne)]: (state, payload) => ({
    ...state,
    device: {
      ...state.device,
      ...payload.data.data
    }
  }),

  [fulfilled(getAcquirers)]: (state, payload) => ({
    ...state,
    acquirers: payload.data.data.map(d => ({ name: d.name, value: d.value, id: d.value }))
  }),

  [fulfilled(save)]: (state, payload) => ({
    ...state,
    device: {
      ...state.device,
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

  [clearDevice]: state => ({
    ...state,
    device: { ...initialState.device },
    response: { ...initialState.response }
  })
}, { ...initialState })
