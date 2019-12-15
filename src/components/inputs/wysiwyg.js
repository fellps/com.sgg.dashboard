import React, { Component } from 'react'

import PropTypes from 'prop-types'

import { createInput } from 'react-nonconformist'

import { validateValueOrRequired } from './text'

import {
  Form
} from 'react-bootstrap'

import uuid from 'uuid'

import Jodit from 'jodit'

import classname from 'classname'

import 'jodit/build/jodit.min.css'

export class TextInputComponent extends Component {
  static propTypes = {
    onChangeText: PropTypes.func,
    value: PropTypes.any,
    error: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool
    ]),
    placeholder: PropTypes.string,
    label: PropTypes.string,
    info: PropTypes.string,
    required: PropTypes.bool
  }

  static defaultProps = {
    error: 'Preencha com mais de 1 caracter.'
  }

  _uuid = uuid()
  _lastUpdate = +new Date()

  componentDidMount () {
    this.editor = new Jodit(`#jd-${this._uuid}`)

    this._changeEvent = e => {
      const { onChangeText } = this.props
      this._lastUpdate = +new Date()
      if (onChangeText) onChangeText(e)
    }

    this.editor.events.on('change', this._changeEvent)
  }

  componentWillUnmount () {
    this.editor.events.off('change', this._changeEvent)
  }

  componentDidUpdate () {
    const passedTime = (+new Date()) - this._lastUpdate

    if (passedTime > 100 && this.editor.value !== this.props.value) {
      this.editor.value = this.props.value
    }
  }

  render () {
    const {
      error,
      label,
      info,
      placeholder,
      required
    } = this.props

    return (
      <Form.Group className={classname({ 'has-label': label, 'has-danger': error })}>
        {label && <Form.Label>{label} {required && '*'}</Form.Label>}
        <div style={error ? { border: '1px solid var(--danger)' } : { border: '1px solid transparent' }}>
          <textarea id={`jd-${this._uuid}`} placeholder={placeholder} />
        </div>
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
  validate: validateValueOrRequired(value => String(value || '').length > 0),
  inputComponent: TextInputComponent
})
