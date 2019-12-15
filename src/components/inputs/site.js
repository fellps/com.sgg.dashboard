import { TextInputComponent, validateValueOrRequired } from './text'

import { createInput } from 'react-nonconformist'

export default createInput({
  handleProps: props => ({
    label: 'Site',
    placeholder: 'http://...',
    ...props,
    onBlur: e => {
      if (e.target.value && e.target.value.contains('http') === false) {
        props.onChangeText(`http://${e.target.value}`)
        props.onBlur && props.onBlur(e)
      }
    },
    error: 'Site inválido'
  }),
  validate: validateValueOrRequired(value => (value || '').length > 5),
  inputComponent: TextInputComponent
})
