import React, { Component } from 'react'

import PropTypes from 'prop-types'

import { createInput } from 'react-nonconformist'

import {
  InputGroup,
  Form
} from 'react-bootstrap'

import classname from 'classname'

import uuid from 'uuid'
import debounce from 'lodash/debounce'

import { validateValueOrRequired } from './text'

import Creatable from 'react-select/creatable'

export class CreatableInputComponent extends Component {
  static defaultProps = {
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
    loadOptions: PropTypes.func,
    createOption: PropTypes.func,
    placeholder: PropTypes.string
  }

  state = { data: [], fixeds: [] }

  _uuid = uuid()

  componentDidMount () {
    this._load(void (0), true)
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

  _load = debounce((value, force) => {
    if (!value && force !== true) return void (0)
    const { loadOptions } = this.props
    this.setState({ isLoading: true })
    loadOptions(value).then(data => {
      this.setState({ data, isLoading: false })
    }).catch(err => {
      console.error(err)
      this.setState({ isLoading: false })
    })
  }, 300)

  _filter = ({ target: { value } }) => {
    this._load(value)
  }

  _onCreateOption = async option => {
    const { onChangeText, createOption } = this.props
    this.setState({ isLoading: true })
    try {
      const result = await createOption(option)

      onChangeText(result.value)

      this._setInFixed(result)
    } catch (err) {}
    this.setState({ isLoading: false })
  }

  _setInFixed = fixed => {
    this.setState({ fixeds: [...this.state.fixeds, fixed] })
  }

  render () {
    const {
      value,
      error,
      onBlur,
      onFocus,
      label,
      info,
      required,
      onChangeText,
      placeholder
    } = this.props

    const options = [...this.state.data, ...this.state.fixeds]

    return (
      <Form.Group className={classname({ 'has-label': label, 'has-danger': error })}>
        {label && <Form.Label>{label}{required && '*'}</Form.Label>}
        {this._renderInputGroupOrFragment(
          <Creatable
            label={placeholder}
            isLoading={this.state.isLoading}
            value={value ? options.find(d => d.value === value) : void (0)}
            onChange={({ value, label }) => {
              onChangeText(value)
              this._setInFixed({ value, label })
            }}
            isSearchable
            loadingMessage={() => 'Carregando...'}
            noOptionsMessage={() => 'Sem opções'}
            onKeyDown={this._filter}
            onCreateOption={this._onCreateOption}
            onBlur={onBlur}
            onFocus={onFocus}
            options={[...this.state.data, ...this.state.fixeds]}
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
  inputComponent: CreatableInputComponent
})
