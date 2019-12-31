import { createAction } from 'redux-act'

import * as jobs from '../../api/jobs'

export const save = createAction('SAVE_JOB', jobs.save)
export const get = createAction('GET_JOBS', jobs.get)
export const getOne = createAction('GET_JOBS_ONE', jobs.get)
export const getAvailableUsers = createAction('GET_JOBS_AVAILABLE_USERS', jobs.getAvailableUsers)
export const sendPush = createAction('SEND_PUSH', jobs.sendPush)

export const set = createAction('SET_JOB')
export const clearJob = createAction('CLEAR_JOB')
