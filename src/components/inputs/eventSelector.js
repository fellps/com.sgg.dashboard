import { createInput } from 'react-nonconformist'

import { get } from '../../api/events'

import mem from 'mem'

import { SelectInputComponent } from './select'
import { validateValueOrRequired } from './text'

const loadOptions = mem(async () => {
  const { data } = await get()

  return data.data.map(d => ({
    value: d._id,
    name: d.name
  }))
})

export default createInput({
  handleProps: props => ({
    label: 'Evento',
    ...props,
    loadOptions
  }),

  validate: validateValueOrRequired(value => !!value),
  inputComponent: SelectInputComponent
})
