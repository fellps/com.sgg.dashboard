import { createAction } from 'redux-act'

import * as tags from '../../api/tags'

export const get = createAction('GET_TAGS', tags.get)
export const getOne = createAction('GET_TAG', tags.getOne)
export const save = createAction('SAVE_TAG', tags.save)

export const clearTag = createAction('CLEAR_TAG')
export const set = createAction('SET_TAG')
