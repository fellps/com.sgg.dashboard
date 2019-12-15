import React from 'react'

import InputCurrency from '../../components/inputs/currency'
import InputText from '../../components/inputs/text'
import InputColor from '../../components/inputs/color'

import Button from '../../components/button'

import bootbox from 'bootbox'

import {
  Row,
  Col
} from 'react-bootstrap'

function confirmRemovalProduct (confirm) {
  return () => {
    bootbox.confirm({
      title: 'Remover produto',
      message: `Você gostaria de excluir esse produto? Essa ação é irreversivel.`,
      locale: 'br',
      centerVertical: true,
      callback: yes => {
        yes && confirm()
      }
    })
  }
}

export default function Products ({ children }) {
  return (
    <React.Fragment>
      <Row>
        <Col md={3}><h4>Nome*</h4></Col>
        <Col md={3}><h4>Valor Unitário*</h4></Col>
        <Col md={3}><h4>Cor*</h4></Col>
        <Col md={3} style={{ textAlign: 'right' }}><h4>Ações</h4></Col>
      </Row>
      {children}
    </React.Fragment>
  )
}

export function Product ({ connect, localId, product, removeProduct }) {
  return (
    <Row style={{
      marginTop: 10,
      marginBottom: 10,
      paddingTop: 40,
      paddingBottom: 15,
      borderRadius: 10,
      backgroundColor: 'rgba(0, 0, 0, 0.03)'
    }}>
      <Col md={3}>
        <InputText
          required
          {...connect(`products.${localId}.name`)}
        />
      </Col>
      <Col md={3}>
        <InputCurrency
          required
          {...connect(`products.${localId}.value`)}
        />
      </Col>
      <Col md={3}>
        <InputColor
          required
          {...connect(`products.${localId}.color`)}
        />
      </Col>
      <Col md={3} style={{ textAlign: 'right' }}>
        <Button
          icon='fat-remove'
          variant='danger'
          onClick={confirmRemovalProduct(removeProduct)}
        />
      </Col>
    </Row>
  )
}
