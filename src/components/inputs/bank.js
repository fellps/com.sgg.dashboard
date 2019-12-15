import { createInput } from 'react-nonconformist'

import banks from '../../helpers/banks'

import { SelectInputComponent } from './select'
import { validateValueOrRequired } from './text'

const options = banks.map(op => ({ value: op.Code, name: `${op.Code} - ${op.Name}` }))

export default createInput({
  handleProps: props => ({
    label: 'Banco',
    ...props,
    options
  }),

  validate: validateValueOrRequired(value => !!value),
  inputComponent: SelectInputComponent
})
