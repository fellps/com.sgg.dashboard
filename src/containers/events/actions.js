import { createAction } from 'redux-act'

import * as events from '../../api/events'

export const save = createAction('SAVE_EVENT', events.save)
export const get = createAction('GET_EVENTS', events.get)
export const getOne = createAction('GET_EVENTS_ONE', events.get)

export const set = createAction('SET_EVENT')
export const clearEvent = createAction('CLEAR_EVENT')
