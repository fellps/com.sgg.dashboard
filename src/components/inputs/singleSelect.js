import React, { Component } from 'react'

import PropTypes from 'prop-types'

import { createInput } from 'react-nonconformist'

import {
  InputGroup,
  Form
} from 'react-bootstrap'

import classname from 'classname'

import uuid from 'uuid'

import { validateValueOrRequired } from './text'

export class SelectInputComponent extends Component {
  static defaultProps = {
    options: [],
    error: 'Você precisa escolher uma opção.'
  }

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
    label: PropTypes.string,
    info: PropTypes.string,
    alternative: PropTypes.bool,
    required: PropTypes.bool,
    options: PropTypes.array,
    loadOptions: PropTypes.func
  }

  _uuid = uuid()

  state = { loadedOptions: [] }

  componentDidMount () {
    const { loadOptions } = this.props
    if (loadOptions) {
      this._loadOptions(loadOptions)
    }
  }

  _loadOptions = async loadOptions => {
    const values = await loadOptions()

    this.setState({ loadedOptions: values })
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

  render () {
    const {
      onChangeText,
      value,
      error,
      onBlur,
      onFocus,
      label,
      info,
      required,
      loadOptions,
      options
    } = this.props

    return (
      <Form.Group className={classname({ 'has-label': label, 'has-danger': error })}>
        {label && <Form.Label>{label}{required && '*'}</Form.Label>}
        {this._renderInputGroupOrFragment(
          <Form.Control
            isInvalid={!!error}
            onBlur={onBlur}
            onFocus={onFocus}
            value={value}
            required={required}
            onChange={e => onChangeText(e.target.value)}
            as='select'
          >
            {
              (loadOptions ? this.state.loadedOptions : options)
                .map(option => <option key={`${this._uuid}-${option.value}`} value={option.value}>{option.name}</option>)
            }
          </Form.Control>
        )}
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

export default createInput({
  validate: validateValueOrRequired(value => !!value),
  inputComponent: SelectInputComponent
})
