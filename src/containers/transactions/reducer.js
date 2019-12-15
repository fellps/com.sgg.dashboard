import { createReducer } from 'redux-act'

import { get } from './actions'

import { fulfilled } from '../../helpers/reducerPromiseHelper'

const initialState = {
  response: {
    data: { items: [] }
  }
}

export default createReducer({
  [fulfilled(get)]: (state, payload) => ({
    ...state,
    response: payload.data
  })
}, { ...initialState })
