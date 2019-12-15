import { createInput } from 'react-nonconformist'

import { get } from '../../api/users'

import mem from 'mem'

import { SelectInputComponent } from './select'
import { validateValueOrRequired } from './text'

import { CPF } from 'cpf_cnpj'

const loadOptions = mem(async () => {
  const { data } = await get()

  return data.data.items.map(d => ({
    value: d.uuid,
    name: `${CPF.format(d.cpf)} - ${d.nome}`
  }))
})

export default createInput({
  handleProps: props => ({
    label: 'Usuário',
    ...props,
    loadOptions
  }),

  validate: validateValueOrRequired(value => !!value),
  inputComponent: SelectInputComponent
})
