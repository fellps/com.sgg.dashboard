import { createAction } from 'redux-act'

import * as whoWorked from '../../api/whoWorked'

export const get = createAction('GET_WHOWORKED', whoWorked.get)
export const getXls = createAction('GET_WHOWORKED_XLS', whoWorked.getXls)

export const clearWhoWorked = createAction('CLEAR_WHOWORKED')
export const set = createAction('SET_WHOWORKED')
