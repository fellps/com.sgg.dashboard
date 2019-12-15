import React, { Component } from 'react'

import PropTypes from 'prop-types'

import { createInput } from 'react-nonconformist'

import {
  InputGroup,
  Form
} from 'react-bootstrap'

import InputMask from 'react-input-mask'

import classname from 'classname'

import isEmpty from 'lodash/isEmpty'

export const validateValueOrRequired = validation => ({ required, value, ...restProps }) => {
  const valued = String(value || '')
  if (required || isEmpty(valued) === false) {
    return validation(value, restProps)
  }
  return true
}

export class TextInputComponent extends Component {
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
    mask: PropTypes.string,
    type: PropTypes.string,
    alternative: PropTypes.bool,
    min: PropTypes.number,
    max: PropTypes.number,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    readOnly: PropTypes.bool
  }

  _renderInputGroupOrFragment = input => {
    const { prepend, alternative } = this.props
    if (prepend) {
      return (
        <InputGroup className={classname({ 'input-group-alternative': alternative })}>
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

  _renderJustInputOrMask = props => {
    const { mask, disabled } = this.props

    if (mask) {
      return (
        <InputMask
          {...props}
          mask={mask}
          alwaysShowMask={false}
          maskChar=''
        >
          {inputProps => {
            return <Form.Control {...inputProps} disabled={disabled} />
          }}
        </InputMask>
      )
    }

    return <Form.Control {...props} />
  }

  render () {
    const {
      onChangeText,
      value,
      error,
      onBlur,
      onFocus,
      placeholder,
      label,
      info,
      type,
      min,
      max,
      disabled,
      required,
      readOnly
    } = this.props

    return (
      <Form.Group className={classname({ 'has-label': label, 'has-danger': error })}>
        {label && <Form.Label>{label}{required && '*'}</Form.Label>}
        {this._renderInputGroupOrFragment(this._renderJustInputOrMask({
          placeholder: placeholder,
          isInvalid: !!error,
          onBlur: onBlur,
          onFocus: onFocus,
          value: value,
          min,
          max,
          ...(type === 'textarea' ? { as: 'textarea' } : { type }),
          required,
          disabled,
          readOnly,
          onChange: e => onChangeText(e.target.value)
        }))}
        {info && <Form.Text className='text-muted'>{info}</Form.Text>}
        {error && (
          <Form.Control.Feedback type='invalid' style={{ display: 'block' }}>
            {error}
          </Form.Control.Feedback>
        )}
      </Form.Group>
    )
  }
}

export const defaultCreateInputProps = {
  handleProps: props => ({
    error: 'Há algum erro com o campo',
    ...props
  }),
  validate: validateValueOrRequired((value, { min, max }) => {
    if (isNaN(min) === false && Number(value) < min) return false
    if (isNaN(max) === false && Number(value) > max) return false
    return String(value || '').length > 0
  }),
  inputComponent: TextInputComponent
}

export default createInput(defaultCreateInputProps)
