import { TextInputComponent, validateValueOrRequired } from './text'

import { createInput } from 'react-nonconformist'

import { CNPJ } from 'cpf_cnpj'

export default createInput({
  handleProps: props => ({
    label: 'CNPJ',
    placeholder: 'CNPJ...',
    ...props,
    error: 'CNPJ Inválido',
    type: 'tel',
    mask: '99.999.999/9999-99'
  }),
  validate: validateValueOrRequired(value => CNPJ.isValid(value || '')),
  inputComponent: TextInputComponent
})
