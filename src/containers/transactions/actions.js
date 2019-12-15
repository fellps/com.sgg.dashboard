import { createAction } from 'redux-act'

import * as transactions from '../../api/transactions'

export const get = createAction('GET_TRANSACTIONS', transactions.get)
