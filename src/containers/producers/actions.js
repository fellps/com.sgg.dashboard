import { createAction } from 'redux-act'

import * as producers from '../../api/producers'

export const save = createAction('SAVE_PRODUCER', producers.save)
export const get = createAction('GET_PRODUCERS', producers.get)
export const getOne = createAction('GET_PRODUCERS_ONE', producers.get)

export const set = createAction('SET_PRODUCER')
export const clearProducer = createAction('CLEAR_PRODUCER')
