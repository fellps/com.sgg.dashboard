import { createInput } from 'react-nonconformist'

import { get } from '../../api/positions'

import { SelectInputComponent } from './select'
import { validateValueOrRequired } from './text'

const loadOptions = async () => {
  const { data } = await get()

  data.data.push({
    IdPosition: '',
    Name: 'Todos'
  })

  return data.data.map(d => ({
    value: d.IdPosition,
    name: d.Name
  }))
}

export default createInput({
  handleProps: props => ({
    ...props,
    loadOptions
  }),

  validate: validateValueOrRequired(value => !!value),
  inputComponent: SelectInputComponent
})
