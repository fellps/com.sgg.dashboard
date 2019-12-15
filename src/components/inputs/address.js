import React, { Component } from 'react'

import { createInput } from 'react-nonconformist'

import TextInput from './text'
import SelectInput from './select'

import * as address from '../../api/externals/address'

import { Row, Col, Form } from 'react-bootstrap'

import find from 'lodash/find'

import classname from 'classname'

class AdressBR extends Component {
  state = {
    isLoading: false,
    states: [],
    cities: []
  }

  componentDidMount () {
    this._loadStates()
  }

  _loadStates = async () => {
    try {
      const { data } = await address.getStates()
      this.setState({ states: data.map(d => ({ name: d.nome, value: d.sigla, id: d.id })) })
    } catch (err) {}
  }

  _loadCities = async state => {
    try {
      const { id } = find(this.state.states, { value: state })
      const { data } = await address.getCities({ id })
      this.setState({ cities: data.map(d => ({ name: d.nome, value: d.nome, id: d.id })) })
    } catch (err) {}
  }

  _loadAddress = value => {
    const { onChangeText } = this.props

    if (value.length === 9) {
      this._loadInternalAddress(value.replace(/^\D+/g, ''))
    }

    onChangeText({ cep: value })
  }

  _loadInternalAddress = async value => {
    this.setState({ isLoading: true })
    try {
      const data = await address.getAddressFromCep({ cep: value })
      this.props.onChangeText({ ...data, cep: value })
      // setTimeout(this._numberRef.focus, 200)
    } catch (err) {}
    this.setState({ isLoading: false })
  }

  componentDidUpdate (prevProps) {
    if (this.props.value && prevProps.value && this.props.value.state !== prevProps.value.state) {
      this._loadCities(this.props.value.state)
    }
  }

  render () {
    const {
      label,
      error,
      required,
      onChangeText,
      value = {}
    } = this.props

    return (
      <Form.Group className={classname({ 'has-label': label, 'has-danger': error })}>
        {label && <Form.Label>{label}{required && '*'}</Form.Label>}
        <TextInput
          isLoading={this.state.isLoading}
          disabled={this.state.isLoading}
          label='CEP'
          value={value.cep}
          mask='99999-999'
          type='tel'
          onChangeText={this._loadAddress}
        />
        <Row>
          <Col sm={12} md={4}>
            <SelectInput
              label='Estado'
              onChangeText={state => onChangeText({ ...value, state })}
              value={value.state}
              disabled={this.state.isLoading}
              options={this.state.states}
            />
          </Col>
          <Col>
            <SelectInput
              label='Cidade'
              onChangeText={city => onChangeText({ ...value, city })}
              value={value.city}
              disabled={this.state.isLoading}
              options={this.state.cities}
            />
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={8}>
            <TextInput
              onChangeText={address => onChangeText({ ...value, address })}
              value={value.address}
              disabled={this.state.isLoading}
              label='Endereço'
            />
          </Col>
          <Col>
            <TextInput
              required
              ref={ref => (this._numberRef = ref)}
              onChangeText={addressNumber => onChangeText({ ...value, addressNumber })}
              value={value.addressNumber}
              type='number'
              disabled={this.state.isLoading}
              label='Número'
            />
          </Col>
        </Row>
      </Form.Group>
    )
  }
}

export default createInput({
  inputComponent: AdressBR
  // validate: ({ value }) => CPF.isValid(value || ''),
  // handleProps: props => ({
  //   mask: '999.999.999-99',
  //   maskChar: '',
  //   error: 'CPF Inválido',
  //   ...props
  // })
})
