import React, { Component } from 'react'

import PropTypes from 'prop-types'

import { createInput } from 'react-nonconformist'

import { validateValueOrRequired } from './text'

import {
  InputGroup,
  Form
} from 'react-bootstrap'

import NumberFormat from 'react-number-format'

import classname from 'classname'

export class CurrencyInputComponent extends Component {
  static propTypes = {
    prepend: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element
    ]),
    onChangeText: PropTypes.func,
    value: PropTypes.any,
    error: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool
    ]),
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    placeholder: PropTypes.string,
    label: PropTypes.string,
    info: PropTypes.string,
    required: PropTypes.bool
  }

  static defaultProps = {
    error: 'Valor inválido'
  }

  currencyFormatter = (value) => {
    if (!Number(value)) return ''

    const amount = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value / 100)

    return `${amount}`
  }

  _renderInputGroupOrFragment = input => {
    const { prepend } = this.props
    if (prepend) {
      return (
        <InputGroup className='input-group-alternative'>
          <InputGroup.Prepend>
            <InputGroup.Text>{prepend}</InputGroup.Text>
          </InputGroup.Prepend>
          {input}
        </InputGroup>
      )
    }

    return (
      <React.Fragment>{input}</React.Fragment>
    )
  }

  render () {
    const {
      value,
      error,
      label,
      info,
      required,
      onChangeText
    } = this.props

    return (
      <Form.Group>
        {label && <Form.Label>{label}{required && '*'}</Form.Label>}
        {this._renderInputGroupOrFragment(
          <NumberFormat
            decimalScale={2}
            decimalSeparator=','
            fixedDecimalScale
            onValueChange={e => onChangeText(parseFloat(e.floatValue) / 100)}
            placeholder='R$ 0,00'
            prefix='R$ '
            thousandSeparator='.'
            value={value * 100}
            format={this.currencyFormatter}
            className={classname('form-control', { 'is-invalid': !!error })}
          />
        )}
        {info && <Form.Text className='text-muted'>{info}</Form.Text>}
        {error && (
          <Form.Control.Feedback style={{ display: 'block' }} type='invalid'>
            {error}
          </Form.Control.Feedback>
        )}
      </Form.Group>
    )
  }
}

export default createInput({
  validate: validateValueOrRequired(value => Number(value) > 0),
  inputComponent: CurrencyInputComponent
})
