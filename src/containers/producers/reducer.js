import { createReducer } from 'redux-act'

import { fulfilled } from '../../helpers/reducerPromiseHelper'

import {
  get,
  getOne,
  set,
  clearProducer,
  save
} from './actions'

const initialState = {
  response: {
    data: []
  },

  edit: {
    users: [],
    events: []
  },

  saved: {}
}

export default createReducer({
  [fulfilled(save)]: (state, payload) => ({
    ...state,
    saved: payload.data.data
  }),

  [set]: (state, payload) => ({
    ...state,
    edit: { ...state.edit, ...payload }
  }),

  [clearProducer]: state => ({
    ...state,
    edit: { ...initialState.edit }
  }),

  [fulfilled(get)]: (state, payload) => ({
    ...state,
    response: payload.data,
    producers: payload.data.data.map(d => ({ name: d.socialReason, value: d._id, id: d._id }))
  }),

  [fulfilled(getOne)]: (state, payload) => ({
    ...state,
    edit: {
      ...state.edit,
      ...payload.data.data,
      address: {
        address: payload.data.data.address,
        addressNumber: payload.data.data.addressNumber,
        city: payload.data.data.city,
        state: payload.data.data.state,
        cep: payload.data.data.cep
      }
    }
  })
}, { ...initialState })
