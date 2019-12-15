import { TextInputComponent, validateValueOrRequired } from './text'

import { createInput } from 'react-nonconformist'

export default createInput({
  handleProps: props => ({
    placeholder: 'Hora',
    error: 'Digite uma hora.',
    ...props,
    type: 'tel',
    mask: '99:99'
  }),
  validate: validateValueOrRequired(value => String(value || '').length >= 5),
  inputComponent: TextInputComponent
})
