import { CPF } from 'cpf_cnpj'

import moment from 'moment'

export const toReais = (amount = 0) => {
  return Number(amount).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    style: 'currency',
    currency: 'BRL'
  })
}

export const toNumeric = (number = 0) => {
  return Number(number).toLocaleString('pt-BR', {
    // minimumFractionDigits: 0,
    style: 'decimal',
    currency: 'BRL'
  })
}

export const toCPF = str => CPF.format(str)

export const toDDMMYYYY = date => moment(date, 'YYYY-MM-DD').format('DD/MM/YYYY')
