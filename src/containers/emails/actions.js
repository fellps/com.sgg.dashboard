import { createAction } from 'redux-act'

import * as emails from '../../api/emails'

export const get = createAction('GET_EMAILS', emails.get)
export const getOne = createAction('GET_EMAIL', emails.getOne)
export const save = createAction('SAVE_EMAIL', emails.save)

export const clearEmail = createAction('CLEAR_EMAIL')
export const set = createAction('SET_EMAIL')
