import { TextInputComponent, validateValueOrRequired } from './text'

import { createInput } from 'react-nonconformist'

export default createInput({
  handleProps: props => ({
    label: 'Telefone',
    placeholder: '(XX) XXXXX-XXXX',
    ...props,
    error: 'Telefone Inválido',
    type: 'tel',
    mask: '(99) 99999-9999'
  }),
  validate: validateValueOrRequired(value => String(value || '').length > 8),
  inputComponent: TextInputComponent
})
