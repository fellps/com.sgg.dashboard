import { createInput } from 'react-nonconformist'

import { SelectInputComponent } from './select'
import { validateValueOrRequired } from './text'

export default createInput({
  handleProps: props => ({
    label: 'Sexo',
    ...props,
    options: [
      { name: 'Todos', value: '' },
      { name: 'Masculino', value: 'm' },
      { name: 'Feminino', value: 'f' }
    ]
  }),

  validate: validateValueOrRequired(value => !!value),
  inputComponent: SelectInputComponent
})
