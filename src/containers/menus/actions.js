import { createAction } from 'redux-act'
import dot from 'dot-object'
import * as Menus from '../../api/menus'

export const save = createAction('SAVE_MENU', Menus.save)
export const get = createAction('GET_MENUS', Menus.get)
export const getOne = createAction('GET_MENUS_ONE', Menus.getOne)

export const clearMenu = createAction('CLEAR_MENU')
export const set = createAction('SET_MENU', params => {
  return dot.object({ ...params })
})

export const addProduct = createAction('ADD_PRODUCT')
export const removeProduct = createAction('REMOVE_PRODUCT', async payload => {
  return payload
})
