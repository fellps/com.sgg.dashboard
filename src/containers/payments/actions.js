import { createAction } from 'redux-act'

import * as payments from '../../api/payments'

export const get = createAction('GET_PAYMENTS', payments.get)
export const getOne = createAction('GET_PAYMENT', payments.getOne)
export const save = createAction('SAVE_PAYMENT', payments.save)

export const setPayment = createAction('SET_PAYMENTS')
export const clearPayment = createAction('CLEAR_PAYMENT')
export const set = createAction('SET_PAYMENT')
