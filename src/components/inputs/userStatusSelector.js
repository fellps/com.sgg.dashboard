import { createInput } from 'react-nonconformist'

import { getUserStatus } from '../../api/users'

import { SelectInputComponent } from './select'
import { validateValueOrRequired } from './text'

const loadOptions = async () => {
  const { data } = await getUserStatus()

  return data.data.map(d => ({
    value: d.Code,
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
