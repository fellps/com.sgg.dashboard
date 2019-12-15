import { TextInputComponent, validateValueOrRequired } from './text'

import { createInput } from 'react-nonconformist'

export default createInput({
  handleProps: props => ({
    placeholder: 'Informe um valor',
    error: 'Informe um número!',
    type: 'tel',
    mask: '999999',
    ...props
  }),
  validate: validateValueOrRequired(value => parseInt(value || 0) > 0),
  inputComponent: TextInputComponent
})
