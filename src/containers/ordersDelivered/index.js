import React from 'react'

import Card from '../../components/card'
import Dashboard from '../dashboard'
import Filters from '../filters'

import { Row, Col, Table, ProgressBar } from 'react-bootstrap'

import { useDispatch, useSelector } from 'react-redux'

import { getOrdersDelivered } from './actions'

import isEmpty from 'lodash/isEmpty'

function useStateAndDispatch () {
  const dispatch = useDispatch()
  const ordersDelivered = useSelector(state => state.ordersDelivered.ordersDelivered)
  const isLoadingOrdersDelivered = useSelector(state => state.isLoading[getOrdersDelivered])

  return {
    ordersDelivered,
    isLoadingOrdersDelivered,
    getOrdersDelivered: params => dispatch(getOrdersDelivered(params))
  }
}

export default function OrdersDelivered ({ history, match }) {
  const {
    ordersDelivered,
    getOrdersDelivered,
    isLoadingOrdersDelivered
  } = useStateAndDispatch()

  const filter = filter => {
    const mapper = {
      uuid: filter.Event
    }

    getOrdersDelivered(mapper)
  }

  return (
    <Dashboard
      title='Resumo de pedidos entregues'
      header={
        <Filters
          isLoading={isLoadingOrdersDelivered}
          history={history}
          onFilter={filter}
          filters={[
            { name: 'Event' }
          ]}
          title='Resumo de vendas'
        />
      }
    >
      <Row style={{ marginTop: 50, display: isEmpty(ordersDelivered) ? 'none' : 'flex' }}>
        <Col lg='6' xl='4'>
          <Card className='card-stats mb-4 mb-xl-0'>
            <Row>
              <div className='col'>
                <h5 className='text-uppercase text-muted mb-0'>
                  Total vendido
                </h5>
                <span className='h2 font-weight-bold mb-0'>
                  R$ {parseFloat(ordersDelivered.totalDeliveredAmount).toLocaleString('pt-BR')}
                </span>
              </div>
              <Col className='col-auto'>
                <div className='icon icon-shape bg-success text-white rounded-circle shadow'>
                  <i className='fas fa-dollar-sign' />
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col lg='6' xl='4'>
          <Card className='card-stats mb-4 mb-xl-0'>
            <Row>
              <div className='col'>
                <h5 className='text-uppercase text-muted mb-0'>
                  Total pedidos entregues
                </h5>
                <span className='h2 font-weight-bold mb-0'>
                  {parseFloat(ordersDelivered.totalOrdersDelivered).toLocaleString('pt-BR')}
                </span>
              </div>
              <Col className='col-auto'>
                <div className='icon icon-shape bg-danger text-white rounded-circle shadow'>
                  <i className='fas fa-truck-loading' />
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col lg='6' xl='4'>
          <Card className='card-stats mb-4 mb-xl-0'>
            <Row>
              <div className='col'>
                <h5 className='text-uppercase text-muted mb-0'>
                    Total entregadores
                </h5>
                <span className='h2 font-weight-bold mb-0'>
                  {ordersDelivered.totalDeliverers}
                </span>
              </div>
              <Col className='col-auto'>
                <div className='icon icon-shape bg-info text-white rounded-circle shadow'>
                  <i className='fas fa-user-friends' />
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col sm={12} style={{ marginTop: 30 }}>
          <Card isLoading={isLoadingOrdersDelivered} shadow header={<h3 className='mb-0'>Resumo de produtos entregues</h3>}>
            <Table className='align-items-center table-flush' responsive style={{ display: isEmpty(ordersDelivered) ? 'none' : 'table' }}>
              <thead className='thead-light'>
                <tr>
                  <th scope='col'>Produto</th>
                  <th scope='col'>Quantidade</th>
                  <th scope='col'>Valor total</th>
                </tr>
              </thead>
              <tbody>
                {!isEmpty(ordersDelivered) && ordersDelivered.products.map(product => (
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
        <Col sm={12} style={{ marginTop: 30 }}>
          <Card isLoading={isLoadingOrdersDelivered} shadow header={<h3 className='mb-0'>Resumo por entregador</h3>}>
            <Table className='align-items-center table-flush' responsive style={{ display: isEmpty(ordersDelivered) ? 'none' : 'table' }}>
              <thead className='thead-light'>
                <tr>
                  <th scope='col'>CPF</th>
                  <th scope='col'>Produto</th>
                  <th scope='col'>Quantidade</th>
                  <th scope='col'>Valor total</th>
                </tr>
              </thead>
              <tbody>
                {!isEmpty(ordersDelivered) && ordersDelivered.ordersDeliveredByUser.map(order => (
                  <tr key={order.productId}>
                    <th scope='row'>{order.cpf}</th>
                    <td>{order.name}</td>
                    <td>{order.totalCount}</td>
                    <td>R$ {parseFloat(order.totalAmount).toLocaleString('pt-BR')}</td>
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
