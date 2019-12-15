import React, { Component } from 'react'

import PropTypes from 'prop-types'

import { createInput } from 'react-nonconformist'

import { validateValueOrRequired } from './text'

import {
  Form
} from 'react-bootstrap'

import uuid from 'uuid'

import { isFile } from '../../helpers/toFormData'

export class TextInputComponent extends Component {
  static propTypes = {
    onChangeText: PropTypes.func,
    value: PropTypes.any,
    error: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool
    ]),
    label: PropTypes.string,
    info: PropTypes.string,
    required: PropTypes.bool,
    accept: PropTypes.string
  }

  static defaultProps = {
    accept: 'image/*'
  }

  _uuid = uuid()

  render () {
    const {
      value,
      error,
      label,
      info,
      required,
      accept,
      onChangeText
    } = this.props

    return (
      <Form.Group>
        {label && <Form.Label>{label}{required && '*'}</Form.Label>}
        <div>
          <input
            style={{ position: 'absolute', top: -1000, left: -1000 }}
            type='file'
            accept={accept}
            id={`file-${this._uuid}`}
            onChange={e => onChangeText(e.target.files[0])}
          />
          <div
            onClick={() => document.querySelector(`#file-${this._uuid}`).click()}

            onDrop={() => {
              console.log('dropped file')
            }}

            style={{
              cursor: 'pointer',
              textAlign: 'center',
              borderRadius: 4,
              minHeight: 150,
              border: '2px dashed rgba(0, 0, 0, 0.3)',
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'row'
            }}
          >
            <div style={{ opacity: 0.7, flex: 1, textAlign: 'center' }}>Arraste um arquivo ou selecione...</div>
            {value && (
              <div style={{ paddingLeft: 5 }}>
                <img
                  src={isFile(value) ? URL.createObjectURL(value) : value}
                  style={{
                    border: '1px solid rgba(0, 0, 0, 0.2)',
                    margin: 10,
                    maxWidth: '90%',
                    width: '100%',
                    borderRadius: 5
                  }}
                  alt='Imagem Atual'
                />
              </div>
            )}
          </div>
        </div>
        {info && <Form.Text className='text-muted'>{info}</Form.Text>}
        {error && (
          <Form.Control.Feedback type='invalid'>
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
