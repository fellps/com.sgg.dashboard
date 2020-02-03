import React, { Component } from 'react'

import PropTypes from 'prop-types'

import { createInput } from 'react-nonconformist'

import {
  Form
} from 'react-bootstrap'

import Switch from 'react-switch'

import classname from 'classname'

export class SwitchInputComponent extends Component {
  static propTypes = {
    onChangeText: PropTypes.func,
    value: PropTypes.any,
    error: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool
    ]),
    label: PropTypes.string,
    info: PropTypes.string
  }

  render () {
    const {
      onChangeText,
      value,
      error,
      label,
      info,
      disabledText,
      enabledText
    } = this.props

    return (
      <Form.Group className={classname({ 'has-label': label, 'has-danger': error })}>
        {label && <Form.Label>{label}</Form.Label>}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', color: 'rgba(0,0,0,0.3)' }}>
            { disabledText || 'Inativo' }
            <div style={{ marginLeft: 5, marginRight: 5, marginBottom: -5 }}>
              <Switch
                onChange={onChangeText}
                checked={!!value}
              />
            </div>
            { enabledText || 'Ativo' }
          </div>
        </div>
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
  inputComponent: SwitchInputComponent
})
