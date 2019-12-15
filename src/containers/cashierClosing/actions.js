import { createAction } from 'redux-act'

import * as reports from '../../api/reports'

export const getCashierClosing = createAction('GET_CASHIER_CLOSING', reports.cashierClosing)
