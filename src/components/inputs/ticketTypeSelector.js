import { createInput } from 'react-nonconformist'

import { types } from '../../api/ticket'

import { SelectInputComponent } from './select'
import { validateValueOrRequired } from './text'

const loadOptions = async () => {
  const { data } = await types()

  return [{}, ...data.data.items.map(d => ({
    value: d.uuid,
    name: d.nome
  }))]
}

export default createInput({
  handleProps: props => ({
    ...props,
    loadOptions
  }),

  validate: validateValueOrRequired(value => !!value),
  inputComponent: SelectInputComponent
})
