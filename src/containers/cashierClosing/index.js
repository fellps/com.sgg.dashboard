import React from 'react'

import Card from '../../components/card'
import Dashboard from '../dashboard'
import Filters from '../filters'

import { Row, Col, Table, ProgressBar } from 'react-bootstrap'

import { useDispatch, useSelector } from 'react-redux'

import { getCashierClosing } from './actions'

import isEmpty from 'lodash/isEmpty'

function useStateAndDispatch () {
  const dispatch = useDispatch()
  const cashierClosing = useSelector(state => state.cashierClosing.cashierClosing)
  const isLoadingCashierClosing = useSelector(state => state.isLoading[getCashierClosing])

  return {
    cashierClosing,
    isLoadingCashierClosing,
    getCashierClosing: params => dispatch(getCashierClosing(params))
    // clearMenu: () => dispatch(clearMenu())
  }
}

export default function Sales ({ history, match }) {
  const {
    cashierClosing,
    getCashierClosing,
    isLoadingCashierClosing
  } = useStateAndDispatch()

  const filter = filter => {
    const cpf = filter.CashierCPF.cashier && filter.CashierCPF.cashier.replace(/[^0-9]/gi, '')
    const mapper = {
      uuid: filter.CashierCPF.event || '',
      cpf: cpf || ''
    }

    getCashierClosing(mapper)
  }

  return (
    <Dashboard
      title='Fechamento de caixa'
      header={
        <Filters
          isLoading={isLoadingCashierClosing}
          history={history}
          onFilter={filter}
          filters={[
            { name: 'CashierCPF', input: 'CashierCPF', label: 'CPF do Caixa' }
          ]}
          title='Fechamento de caixa'
        />
      }
    >
      <Row>
        <Col sm={12} style={{ marginTop: 30 }}>
          <Card isLoading={isLoadingCashierClosing} shadow header={<h3 className='mb-0'>Cancelamentos</h3>}>
            <Table className='align-items-center table-flush' responsive style={{ display: isEmpty(cashierClosing) ? 'none' : 'table' }}>
              <thead className='thead-light'>
                <tr>
                  <th scope='col'>Produto</th>
                  <th scope='col'>Formas de pagamento</th>
                  <th scope='col'>Quantidade</th>
                  <th scope='col'>Valor total</th>
                </tr>
              </thead>
              <tbody>
                {!isEmpty(cashierClosing) && cashierClosing.productsCanceled.length > 0 && cashierClosing.productsCanceled.map(product => (
                  <tr key={product.id}>
                    <th scope='row'>{product.name}</th>
                    <td>{product.paymentMethod}</td>
                    <td>{product.totalCount}</td>
                    <td>R$ {parseFloat(product.totalAmount).toLocaleString('pt-BR')}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td>Total</td>
                  <td> </td>
                  <td>{!isEmpty(cashierClosing) && cashierClosing.paymentMethodCanceled.count}</td>
                  <td>R$ {!isEmpty(cashierClosing) && parseFloat(cashierClosing.paymentMethodCanceled.totalAmount).toLocaleString('pt-BR')}</td>
                </tr>
              </tfoot>
            </Table>
          </Card>
        </Col>
        <Col sm={12} style={{ marginTop: 30 }}>
          <Card isLoading={isLoadingCashierClosing} shadow header={<h3 className='mb-0'>Total Líquido</h3>}>
            <Table className='align-items-center table-flush' responsive style={{ display: isEmpty(cashierClosing) ? 'none' : 'table' }}>
              <thead className='thead-light'>
                <tr>
                  <th scope='col'>Formas de pagamento</th>
                  <th scope='col'>Valor total</th>
                  <th scope='col'>Total operações</th>
                </tr>
              </thead>
              <tbody>
                {!isEmpty(cashierClosing) && cashierClosing.paymentMethod.map(paymentMethod => (
                  <tr key={paymentMethod.id}>
                    <th scope='row'>{paymentMethod.paymentMethod}</th>
                    <td>R$ {parseFloat(paymentMethod.totalAmount).toLocaleString('pt-BR')}</td>
                    <td>{paymentMethod.count}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td>Total</td>
                  <td>R$ {!isEmpty(cashierClosing) && parseFloat(cashierClosing.paymentMethodTotal.totalAmount).toLocaleString('pt-BR')}</td>
                  <td>{!isEmpty(cashierClosing) && cashierClosing.paymentMethodTotal.count}</td>
                </tr>
              </tfoot>
            </Table>
          </Card>
        </Col>
        <Col sm={12} style={{ marginTop: 30 }}>
          <Card isLoading={isLoadingCashierClosing} shadow header={<h3 className='mb-0'>Relatório Analítico</h3>}>
            <Table className='align-items-center table-flush' responsive style={{ display: isEmpty(cashierClosing) ? 'none' : 'table' }}>
              <thead className='thead-light'>
                <tr>
                  <th scope='col'>Produto</th>
                  <th scope='col'>Quantidade</th>
                  <th scope='col'>Valor total</th>
                </tr>
              </thead>
              <tbody>
                {!isEmpty(cashierClosing) && cashierClosing.products.map(product => (
                  <tr key={product.id}>
                    <th scope='row'>{product.name}</th>
                    <td>{product.totalCount}</td>
                    <td>R$ {parseFloat(product.totalAmount).toLocaleString('pt-BR')}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        </Col>
      </Row>
    </Dashboard>
  )
}
