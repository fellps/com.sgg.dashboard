import { TextInputComponent, validateValueOrRequired } from './text'

import { createInput } from 'react-nonconformist'

export default createInput({
  handleProps: props => ({
    label: 'Agencia (sem dígito)',
    placeholder: 'Agencia...',
    ...props,
    error: 'Agencia inválida',
    type: 'tel',
    mask: '99999999999'
  }),
  validate: validateValueOrRequired(value => value.length >= 4),
  inputComponent: TextInputComponent
})
