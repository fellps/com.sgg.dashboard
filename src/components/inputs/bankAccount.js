import { TextInputComponent, validateValueOrRequired } from './text'

import { createInput } from 'react-nonconformist'

export default createInput({
  handleProps: props => ({
    label: 'Conta bancária (com dígito)',
    placeholder: 'Conta bancária...',
    ...props,
    error: 'Conta inválida',
    type: 'tel',
    mask: '99999999999'
  }),
  validate: validateValueOrRequired(value => value.length > 2),
  inputComponent: TextInputComponent
})
