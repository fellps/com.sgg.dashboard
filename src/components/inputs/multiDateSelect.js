import React, { Component } from 'react'

import PropTypes from 'prop-types'

import { createInput } from 'react-nonconformist'

import moment from 'moment'

import * as DATE_PICKER_LOCALIZATION from '../../constants/datePickerLocalization'

import { validateValueOrRequired } from './text'

import uuid from 'uuid'

import {
  Form,
  Row,
  Col
} from 'react-bootstrap'

import Button from '../../components/button'

import mem from 'mem'

const generateDates = mem((startDate, endDate) => {
  let calendar = []

  const startDay = moment(startDate, 'DD/MM/YYYY').startOf('week')
  const endDay = moment(endDate, 'DD/MM/YYYY').endOf('week')

  const date = startDay.clone().subtract(1, 'day')

  while (date.isBefore(endDay, 'day')) {
    calendar.push(Array(7).fill(0).map(() => date.add(1, 'day').clone()))
  }

  return calendar
})

export class DateInputComponent extends Component {
  static propTypes = {
    onChangeText: PropTypes.func,
    value: PropTypes.array,
    error: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool
    ]),
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    label: PropTypes.string,
    info: PropTypes.string,
    required: PropTypes.bool
  }

  static defaultProps = {
    value: [],
    error: 'Selecione ao menos uma data.'
  }

  _uuid = uuid()

  _renderDate = (date) => {
    const { startDate, endDate, value } = this.props

    if (
      date.isBefore(moment(startDate, 'DD/MM/YYYY')) ||
      date.isAfter(moment(endDate, 'DD/MM/YYYY'))
    ) {
      return <Button
        disabled
        size='sm'
        variant='outline-default'
        style={{ opacity: 0.5, cursor: 'not-allowed' }}
      >{date.format('DD/MM')}</Button>
    }

    return (
      <Button
        size='sm'
        onClick={() => this._onChange(date)}
        variant={value.includes(date.format('DD/MM/YYYY')) ? 'primary' : 'outline-primary'}
      >{date.format('DD/MM')}</Button>
    )
  }

  _onChange = (date) => {
    const { onChangeText, value } = this.props

    const d = date.format('DD/MM/YYYY')

    if (value.includes(d)) {
      onChangeText(value.filter(date => date !== d))
    } else {
      onChangeText([...value, d])
    }
  }

  _renderDays = () => {
    const { startDate, endDate } = this.props
    return (
      <React.Fragment>
        <Row noGutters>
          {DATE_PICKER_LOCALIZATION.WEEKDAYS_SHORT.map(d => (
            <Col
              key={`${this._uuid}-${d}`}
              style={{ textAlign: 'center', fontWeight: '800', fontSize: 12, paddingTop: 20, paddingBottom: 20 }}
            >
              {d}
            </Col>
          ))}
        </Row>
        {generateDates(startDate, endDate).map((row, i) => (
          <Row noGutters key={`mds-${this._uuid}-${i}`}>
            {row.map(date => (
              <Col
                key={`mds-col-${date.format('DDMMYYYY')}`}
                style={{ paddingBottom: 10, paddingTop: 10, textAlign: 'center' }}
              >
                {this._renderDate(date)}
              </Col>
            ))}
          </Row>
        ))}
      </React.Fragment>
    )
  }

  render () {
    const {
      error,
      label,
      info,
      required
    } = this.props

    return (
      <Form.Group>
        {label && <Form.Label>{label}{required && '*'}</Form.Label>}
        {this._renderDays()}
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
  validate: validateValueOrRequired(value => value && value.length > 0),
  inputComponent: DateInputComponent
})
