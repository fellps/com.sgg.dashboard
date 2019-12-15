import React, { Component } from 'react'

import { createInput } from 'react-nonconformist'

import SelectInput from './select'

import { get as getEvents } from '../../api/events'
import { getCashiers } from '../../api/users'

import { Row, Col } from 'react-bootstrap'

import find from 'lodash/find'

class CashierCPF extends Component {
  state = {
    isLoading: false,
    events: [],
    cashiers: []
  }

  componentDidMount () {
    this._loadEvents()
  }

  _loadEvents = async () => {
    try {
      const { data } = await getEvents()
      this.setState({ events: data.data.map(d => ({ name: d.name, value: d._id, id: d._id })) })
    } catch (err) {}
  }

  _loadCashiers = async event => {
    try {
      const { id } = find(this.state.events, { value: event })
      const { data } = await getCashiers({ uuid: id })
      this.setState({ cashiers: data.data.cashiers.map(d => ({ name: d, value: d, id: d })) })
    } catch (err) {}
  }

  onChange (e) {
    this._loadCashiers(e.event)
  }

  render () {
    const {
      onChangeText,
      value = {}
    } = this.props

    return (
      <Row>
        <Col sm={12} md={6}>
          <SelectInput
            label='Evento'
            onChangeText={event => {
              this.onChange({ ...value, event })
              onChangeText({ ...value, event })
            }}
            value={value.event}
            disabled={this.state.isLoading}
            options={this.state.events}
          />
        </Col>
        <Col sm={12} md={6}>
          <SelectInput
            label='Caixa'
            onChangeText={cashier => onChangeText({ ...value, cashier })}
            value={value.cashier}
            disabled={this.state.isLoading}
            options={this.state.cashiers}
          />
        </Col>
      </Row>
    )
  }
}

export default createInput({
  inputComponent: CashierCPF
})
