import { createInput } from 'react-nonconformist'

import { validateValueOrRequired } from './text'

import { CreatableInputComponent } from './creatable'

import { types, createType } from '../../api/ticket'

const findEventTypes = async value => {
  const { data } = await types({ name: value })

  const items = data.data.items.map(d => ({
    value: d.uuid,
    label: d.nome
  }))

  return items
}

const createOption = async option => {
  const { data } = await createType({ nome: option })
  return { value: data.data.uuid, label: data.data.nome }
}

export default createInput({
  handleProps: props => ({
    placeholder: 'Escolher...',
    ...props,
    loadOptions: findEventTypes,
    createOption: createOption
  }),

  validate: validateValueOrRequired(value => !!value),
  inputComponent: CreatableInputComponent
})
