import { createReducer } from 'redux-act'

import { fulfilled, pending, rejected } from '../../helpers/reducerPromiseHelper'

import {
  get,
  getOne,
  set,
  clearMenu,
  save,
  addProduct,
  removeProduct
} from './actions'

import uuid from 'uuid'

import reduce from 'lodash/reduce'
import omitBy from 'lodash/omitBy'

const initialState = {
  products: {},

  menus: {
    data: {
      items: []
    }
  },

  menu: {
    isEnabled: true,
    products: {
      [uuid()]: {}
    }
  },

  edit: {
    menus: []
  },

  response: {
    data: []
  }
}

export default createReducer({
  [addProduct]: state => ({
    ...state,
    menu: {
      ...state.menu,
      ...state.products,
      products: {
        ...state.menu.products,
        [uuid()]: { }
      }
    }
  }),

  [fulfilled(removeProduct)]: (state, { uuid, localId }) => ({
    ...state,
    menu: {
      ...state.menu,
      products: omitBy(state.menu.products, (value, key) => {
        return (localId != null && key === localId) || (uuid != null && value.uuid === uuid)
      })
    }
  }),

  [fulfilled(save)]: (state, payload) => ({
    ...state,
    menu: {
      ...state.menu,
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
    const products = {
      ...state.menu.products,
      ...(reduce(payload.products, (acc, value, key) => {
        return {
          ...acc,
          [key]: { ...state.menu.products[key], ...value }
        }
      }, {}))
    }

    return {
      ...state,
      menu: {
        ...state.menu,
        ...payload,
        products
      }
    }
  },

  [clearMenu]: state => ({
    ...state,
    menu: { ...initialState.menu },
    response: { ...initialState.response }
  }),

  [fulfilled(get)]: (state, payload) => ({
    ...state,
    menus: payload.data
  }),

  [rejected(get)]: (state, payload) => ({
    ...state,
    menus: payload.response.data
  }),

  [fulfilled(getOne)]: (state, payload) => ({
    ...state,
    menu: {
      ...state.menu,
      ...payload.data.data
    }
  })
}, { ...initialState })
