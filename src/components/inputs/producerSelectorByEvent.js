import { createInput } from 'react-nonconformist'

import { get, getEvents } from '../../api/producers'

import mem from 'mem'

import { SelectInputComponent } from './select'
import { validateValueOrRequired } from './text'

const loadOptions = mem(async ({ uuidEvent }) => {
  const { data } = await get()

  const mapped = await Promise.all(data.data.items.map(async d => {
    try {
      const events = await getEvents({ uuidProducer: d.uuid })
      return { ...d, events: events.data.data.items.map(d => d.uuid) }
    } catch (err) {
      return { ...d, events: [] }
    }
  }))

  return mapped.filter(d => d.events.includes(uuidEvent)).map(d => ({
    value: d.uuid,
    name: d.razao_social
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
