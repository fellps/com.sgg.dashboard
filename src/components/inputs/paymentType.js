import { createInput } from 'react-nonconformist'

import { SelectInputComponent } from './select'
import { validateValueOrRequired } from './text'

export default createInput({
  handleProps: props => ({
    label: 'Forma de pagamento',
    ...props,
    options: [
      { name: 'PagSeguro', value: 'p' },
      { name: 'Dinheiro', value: 'd' }
    ]
  }),

  validate: validateValueOrRequired(value => !!value),
  inputComponent: SelectInputComponent
})
