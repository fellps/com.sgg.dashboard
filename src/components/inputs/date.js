import React, { Component } from 'react'

import PropTypes from 'prop-types'

import { createInput } from 'react-nonconformist'

import DayPickerInput from 'react-day-picker/DayPickerInput'

import { validateValueOrRequired } from './text'

import 'react-day-picker/lib/style.css'

import {
  formatDate,
  parseDate
} from 'react-day-picker/moment'

import moment from 'moment'

import * as DATE_PICKER_LOCALIZATION from '../../constants/datePickerLocalization'

import {
  InputGroup,
  Form
} from 'react-bootstrap'

export class DateInputComponent extends Component {
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
    required: PropTypes.bool,
    format: PropTypes.string,
    disabledDaysBefore: PropTypes.string
  }

  static defaultProps = {
    format: 'DD/MM/YYYY',
    placeholder: 'DD/MM/YYYY',
    error: 'Selecione uma data',
    months: DATE_PICKER_LOCALIZATION.MONTHS,
    weekdaysLong: DATE_PICKER_LOCALIZATION.WEEKDAYS_LONG,
    weekdaysShort: DATE_PICKER_LOCALIZATION.WEEKDAYS_SHORT
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

  _onDayChange = selectedDay => {
    const { onChangeText } = this.props
    onChangeText(moment(selectedDay).format('DD/MM/YYYY'))
  }

  render () {
    const {
      value,
      error,
      onBlur,
      onFocus,
      placeholder,
      label,
      info,
      format,
      required,
      disabledDaysBefore
    } = this.props

    return (
      <Form.Group>
        {label && <Form.Label>{label}{required && '*'}</Form.Label>}
        {this._renderInputGroupOrFragment(
          <DayPickerInput
            style={{ display: 'block' }}
            onDayChange={this._onDayChange}
            dayPickerProps={{
              ...(disabledDaysBefore && { disabledDays: { before: moment(disabledDaysBefore, format).toDate() } })
            }}
            value={value}
            formatDate={formatDate}
            parseDate={parseDate}
            format={format}
            placeholder={placeholder}

            component={props => (
              <Form.Control
                isInvalid={!!error}
                onBlur={onBlur}
                onFocus={onFocus}
                {...props}
              />
            )}
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
  validate: validateValueOrRequired(value => String(value || '').length === 10),
  inputComponent: DateInputComponent
})
