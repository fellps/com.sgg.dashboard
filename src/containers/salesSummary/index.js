import React from 'react'

import { Link } from 'react-router-dom'

import { Row, Col, Table, ProgressBar } from 'react-bootstrap'

import { useDispatch, useSelector } from 'react-redux'

import useMount from '../../helpers/useMount'
import Card from '../../components/card'
import Dashboard from '../dashboard'
import Filters from '../filters'

import { getSalesSummary, getSalesSummaryExternal } from './actions'

import isEmpty from 'lodash/isEmpty'

function useStateAndDispatch () {
  const dispatch = useDispatch()
  const salesSummary = useSelector(state => state.salesSummary.salesSummary)
  const isLoadingSalesSummary = useSelector(state => state.isLoading[getSalesSummary])

  return {
    salesSummary,
    isLoadingSalesSummary,
    getSalesSummary: params => dispatch(getSalesSummary(params)),
    getSalesSummaryExternal: params => dispatch(getSalesSummaryExternal(params))
    // clearMenu: () => dispatch(clearMenu())
  }
}

export default function Sales ({ history, match }) {
  let hideMenu = false
  if (match.url.includes('/external')) {
    hideMenu = true
  }

  const {
    salesSummary,
    getSalesSummary,
    getSalesSummaryExternal,
    isLoadingSalesSummary
  } = useStateAndDispatch()

  const filter = filter => {
    const mapper = {
      uuid: filter.Event
    }

    getSalesSummary(mapper)
  }

  useMount(() => {
    if (match.url.includes('/external')) {
      getSalesSummaryExternal({ uuid: match.params.uuid })
    }
  })

  return (
    <Dashboard
      title={salesSummary.eventName || 'Resumo de vendas'}
      hideMenu={hideMenu}
      header={!hideMenu &&
        <Filters
          isLoading={isLoadingSalesSummary}
          history={history}
          onFilter={filter}
          filters={[
            { name: 'Event' }
          ]}
          title={salesSummary.eventName || 'Resumo de vendas'}
        />
      }
    >
      {
        !hideMenu &&
        <Row style={{ marginTop: 50, display: isEmpty(salesSummary) ? 'none' : 'flex' }}>
          <Col lg='12' xl='12'>
            <Card className='card-stats mb-4 mb-xl-0'>
              <Row>
                <div className='col'>
                  <h5 className='text-uppercase text-muted mb-0'>
                    Link Externo
                  </h5>
                  <span className='h2 font-weight-bold mb-0'>
                    <Link to={`/external/reports/sales-summary/${salesSummary.eventId}`} target='_blank' className='text-body'>
                      <small><i className='fas fa-sign-out-alt' /> Clique aqui para ir ao link externo do evento</small>
                    </Link>
                  </span>
                </div>
                <Col className='col-auto'>
                  <div className='icon icon-shape bg-success text-white rounded-circle shadow'>
                    <i className='fas fa-sign-out-alt' />
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      }
      <Row style={{ marginTop: 50, display: isEmpty(salesSummary) ? 'none' : 'flex' }}>
        <Col lg='6' xl='4'>
          <Card className='card-stats mb-4 mb-xl-0'>
            <Row>
              <div className='col'>
                <h5 className='text-uppercase text-muted mb-0'>
                  Total vendido
                </h5>
                <span className='h2 font-weight-bold mb-0'>
                  R$ {parseFloat(salesSummary.totalEventAmount).toLocaleString('pt-BR')}
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
                    Total transações
                </h5>
                <span className='h2 font-weight-bold mb-0'>
                  {salesSummary.totalTransactions}
                </span>
              </div>
              <Col className='col-auto'>
                <div className='icon icon-shape bg-info text-white rounded-circle shadow'>
                  <i className='fas fa-chart-bar' />
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
                    Total de pontos de venda
                </h5>
                <span className='h2 font-weight-bold mb-0'>
                  {salesSummary.totalPOS}
                </span>
              </div>
              <Col className='col-auto'>
                <div className='icon icon-shape bg-danger text-white rounded-circle shadow'>
                  <i className='fas fa-store' />
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col sm={12} style={{ marginTop: 30 }}>
          <Card isLoading={isLoadingSalesSummary} shadow header={<h3 className='mb-0'>Estatísticas de pagamentos</h3>}>
            <Table className='align-items-center table-flush' responsive style={{ display: isEmpty(salesSummary) ? 'none' : 'table' }}>
              <thead className='thead-light'>
                <tr>
                  <th scope='col'>Formas de pagamento</th>
                  <th scope='col'>Valor total</th>
                  <th scope='col'>Total operações</th>
                  <th scope='col'>Porcentagem total das vendas</th>
                </tr>
              </thead>
              <tbody>
                {!isEmpty(salesSummary) && salesSummary.paymentMethod.map(paymentMethod => (
                  <tr key={paymentMethod.id}>
                    <th scope='row'>{paymentMethod.paymentMethod}</th>
                    <td>R$ {parseFloat(paymentMethod.totalAmount).toLocaleString('pt-BR')}</td>
                    <td>{paymentMethod.count}</td>
                    <td>
                      <div className='d-flex align-items-center'>
                        <span className='mr-2'>{paymentMethod.percent}%</span>
                        <div>
                          <ProgressBar
                            max='100'
                            now={paymentMethod.percent}
                            variant='success'
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        </Col>
        <Col sm={12} style={{ marginTop: 30 }}>
          <Card isLoading={isLoadingSalesSummary} shadow header={<h3 className='mb-0'>Resumo de produtos</h3>}>
            <Table className='align-items-center table-flush' responsive style={{ display: isEmpty(salesSummary) ? 'none' : 'table' }}>
              <thead className='thead-light'>
                <tr>
                  <th scope='col'>Produto</th>
                  <th scope='col'>Quantidade</th>
                  <th scope='col'>Valor total</th>
                  <th scope='col'>Representação do valor total vendido</th>
                </tr>
              </thead>
              <tbody>
                {!isEmpty(salesSummary) && salesSummary.productSummary.map(product => (
                  <tr key={product.id}>
                    <th scope='row'>{product.name}</th>
                    <td>{product.totalCount}</td>
                    <td>R$ {parseFloat(product.totalAmount).toLocaleString('pt-BR')}</td>
                    <td>
                      <div className='d-flex align-items-center'>
                        <span className='mr-2'>{product.percent}%</span>
                        <div>
                          <ProgressBar
                            max='100'
                            now={product.percent}
                            variant='success'
                          />
                        </div>
                      </div>
                    </td>
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
