import { defaultCreateInputProps } from './text'

import { createInput } from 'react-nonconformist'

export default createInput({
  ...defaultCreateInputProps,
  handleProps: props => ({
    prepend: '%',
    error: '% Inválida',
    type: 'number',
    ...props
  })
})
