import { createInput } from 'react-nonconformist'

import { SelectInputComponent } from './select'
import { validateValueOrRequired } from './text'

export default createInput({
  handleProps: props => ({
    label: 'Status do pagamento',
    ...props,
    options: [
      { name: 'Todos', value: null },
      { name: 'Pagamento realizado', value: '1' },
      { name: 'Pendente de pagamento', value: '0' }
    ]
  }),

  validate: validateValueOrRequired(value => !!value),
  inputComponent: SelectInputComponent
})
