import { createAction } from 'redux-act'

import * as reports from '../../api/reports'

export const getOrdersDelivered = createAction('GET_ORDERS_DELIVERED', reports.ordersDelivered)
