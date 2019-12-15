import { createAction } from 'redux-act'

import * as reports from '../../api/reports'

export const getSalesSummary = createAction('GET_SALES_SUMMARY', reports.salesSummary)
export const getSalesSummaryExternal = createAction('GET_SALES_SUMMARY_EXTERNAL', reports.salesSummaryExternal)
