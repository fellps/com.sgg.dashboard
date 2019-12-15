import { createAction } from 'redux-act'

import * as devices from '../../api/devices'
import * as acquirers from '../../api/acquirers'

export const save = createAction('SAVE_DEVICE', devices.save)
export const get = createAction('GET_DEVICES', devices.get)
export const getOne = createAction('GET_DEVICES_ONE', devices.getOne)
export const getAcquirers = createAction('GET_ACQUIRERS', acquirers.get)

export const set = createAction('SET_DEVICE')
export const setShowQRCode = createAction('SHOW_QRCODE')
export const clearDevice = createAction('CLEAR_DEVICE')
