import { createInput } from 'react-nonconformist'

import { SelectInputComponent } from './select'
import { validateValueOrRequired } from './text'

export default createInput({
  handleProps: props => ({
    label: 'Mês',
    ...props,
    options: [
      { name: 'Todos', value: '' },
      { name: 'Janeiro', value: '1' },
      { name: 'Fevereiro', value: '2' },
      { name: 'Março', value: '3' },
      { name: 'Abril', value: '4' },
      { name: 'Maio', value: '5' },
      { name: 'Junho', value: '6' },
      { name: 'Julho', value: '7' },
      { name: 'Agosto', value: '8' },
      { name: 'Setembro', value: '9' },
      { name: 'Outubro', value: '10' },
      { name: 'Novembro', value: '11' },
      { name: 'Dezembro', value: '12' }
    ]
  }),

  validate: validateValueOrRequired(value => !!value),
  inputComponent: SelectInputComponent
})
