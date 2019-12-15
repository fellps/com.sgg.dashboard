import React, { Component } from 'react'

import Select from 'react-select'

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
    placeholder: 'Selecione...',
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
    loadOptions: PropTypes.func,
    disabled: PropTypes.bool,
    isMulti: PropTypes.bool,
    placeholder: PropTypes.string
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
    const values = await loadOptions(this.props)

    this.setState({ loadedOptions: values })
  }

  _onChange = value => {
    const { isMulti, onChangeText } = this.props

    if (!value) {
      onChangeText(value)
      return void (0)
    }

    if (isMulti) {
      onChangeText(value.map(d => d.value))
    } else {
      onChangeText(value.value)
    }
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

  _handleValue = () => {
    const { value, isMulti, loadOptions, options } = this.props

    const _options = (loadOptions ? this.state.loadedOptions : options)

    if (isMulti) {
      const selecteds = _options
        .filter(op => value && value.includes(op.value))
        .map(option => ({ ...option, label: option.name }))

      return selecteds
    }

    const selected = _options.find(op => op.value === value)

    if (selected) {
      return { ...selected, label: selected.name }
    }
  }

  render () {
    const {
      error,
      onBlur,
      onFocus,
      label,
      info,
      required,
      loadOptions,
      options,
      disabled,
      isMulti,
      placeholder
    } = this.props

    return (
      <Form.Group className={classname({ 'has-label': label, 'has-danger': error })}>
        {label && <Form.Label>{label}{required && '*'}</Form.Label>}
        {this._renderInputGroupOrFragment(
          <Select
            isDisabled={disabled}
            isClearable
            isSearchable
            value={this._handleValue()}
            onChange={this._onChange}
            placeholder={placeholder}
            isMulti={isMulti}
            onFocus={onFocus}
            onBlur={onBlur}
            options={
              (loadOptions ? this.state.loadedOptions : options)
                .map(option => ({ ...option, label: option.name }))
            }
          />
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
