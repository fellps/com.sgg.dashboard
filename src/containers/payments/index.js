import React, { useState, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Modal } from 'react-bootstrap'
import LoadingScreen from 'react-loading-screen'
import { Link } from 'react-router-dom'
import Form from 'react-nonconformist'
import NumberFormat from 'react-number-format'

import Dashboard from '../dashboard'
import Filters from '../filters'
import toParams from '../filters/toParams'

import useMount from '../../helpers/useMount'

import { get, setPayment, save } from './actions'

import Table from '../../components/tableSelect'
import Button from '../../components/button'
import InputPaymentType from '../../components/inputs/paymentType'

function useStateAndDispatch () {
  const dispatch = useDispatch()
  const payments = useSelector(state => state.payments.payments)
  const isLoading = useSelector(state => state.isLoading[get])

  return {
    payments,
    get: params => dispatch(get(params)),
    save: params => dispatch(save(params)),
    setPayment: params => dispatch(setPayment(params)),
    isLoading
  }
}

export default function Payments ({ history, location }) {
  const { get, save, isLoading, payments, setPayment } = useStateAndDispatch()
  const [rows, setRows] = useState({ rows: [] })
  const [paymentType, setPaymentType] = useState({})
  const [showModal, setShowModal] = useState(false)
  const [showLoading, setShowLoading] = useState(false)

  const currencyFormatter = (value) => {
    if (!Number(value)) return ''

    const amount = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value / 100)

    return `${amount}`
  }

  const handleInputChange = (cellInfo, event) => {
    const newPayments = [...payments.data]
    let value = 0
    try {
      value = parseFloat(parseFloat(event.floatValue) / 100)
    } catch (err) {}
    newPayments[cellInfo.index][cellInfo.column.id] = value
    setPayment(newPayments)
  }

  const renderEditable = cellInfo => {
    const value = payments.data[cellInfo.index][cellInfo.column.id]

    return (
      <NumberFormat
        decimalScale={2}
        decimalSeparator=','
        fixedDecimalScale
        onValueChange={(e) => handleInputChange(cellInfo, e)}
        placeholder='R$ 0,00'
        prefix='R$ '
        thousandSeparator='.'
        value={value * 100}
        format={currencyFormatter}
        className={'form-control'}
      />
    )
  }

  const columns = [
    {
      Header: 'Nome',
      accessor: 'Name',
      Cell: props => <Link to={`/users/${props.original.IdUser}`}>{props.value}</Link>
    },
    {
      Header: 'CPF',
      accessor: 'Document',
      Cell: props => <span className='number'>{props.value}</span>
    },
    {
      Header: 'Email',
      accessor: 'Email',
      Cell: props => <span>{props.value}</span>
    },
    {
      Header: 'Evento',
      accessor: 'EventName',
      Cell: props => <span>{props.value}</span>
    },
    {
      Header: 'Cargo',
      accessor: 'JobName',
      Cell: props => <span className='number'>{props.value}</span>
    },
    {
      Header: 'Valor',
      accessor: 'Amount',
      Cell: props => renderEditable(props)
    }
  ]

  useMount(() => {
    const pairs = location.search.slice(1).split('&')

    let params = {}
    pairs.forEach(function (pair) {
      pair = pair.split('=')
      params[pair[0]] = decodeURIComponent(pair[1] || '')
    })

    params = params.length > 0 ? params : { paymentStatus: 0 }

    get(toParams(params))
  })

  const filter = params => {
    get(toParams(params))
  }

  const submit = async () => {
    setShowModal(false)
    setShowLoading(true)
    await save({ rows, paymentType })
    setRows({ rows: [] })
    window.location.reload()
  }

  return (
    <LoadingScreen
      loading={showLoading}
      bgColor='#ffffff'
      spinnerColor='#5e72e4'
      textColor='#525f7f'
      logoSrc={require('../../assets/logo-black.png')}
      text='Aguarde o processamento dos pagamentos..'
    >
      <Dashboard
        title='Efeturar Pagamentos'
      >
        <Filters
          isLoading={isLoading}
          history={history}
          onFilter={filter}
          filters={[
            { name: 'idEvent', input: 'Event', label: 'Evento', placeholder: 'Nome do evento' },
            { name: 'paymentStatus', input: 'PaymentStatus', label: 'Status do pagamento', placeholder: 'Status do pagamento' },
            { name: 'cpf', input: 'CPF', label: 'CPF', placeholder: 'CPF do usuário' },
            { name: 'name', input: 'TextInput', label: 'Nome', placeholder: 'Nome do usuário' }
          ]}
          title='Selecione para efetuar um pagamento'
        >
          {rows !== 0 && rows.rows.length > 0 &&
            <p className='paymentSummary'>
              <h3>
                Valor total: R$ {rows.rows.reduce((prev, row) => (prev + row.Amount), 0).toFixed(2)}
              </h3>
              <Button
                type='submit'
                variant='outline-primary'
                disabled={isLoading}
                isLoading={isLoading}
                onClick={() => setShowModal(true)}
              >Pagar</Button>
            </p>
          }
          <Table
            columns={columns}
            onSelect={setRows}
            data={(payments && payments.data && payments.data.length > 0 && payments.data) || []}
            keyField='IdUserJob'
          />
        </Filters>
        <Modal show={showModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Efetuar pagamentos</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form
              values={paymentType}
              onChange={setPaymentType}
              onSubmit={submit}
            >
              {(connect, submit) => (
                <form onSubmit={e => {
                  e.preventDefault()
                  submit()
                }}>
                  <InputPaymentType {...connect('PaymentType')} label='Forma de pagamento' required />
                  <span>Valor total:</span> <h2>R$ {rows.rows.reduce((prev, row) => (prev + row.Amount), 0).toFixed(2)}</h2>
                  <div style={{ textAlign: 'right', marginTop: 45 }}>
                    <Button variant='primary' type='submit'>Confirmar</Button>
                    <Button variant='secondary' onClick={() => setShowModal(false)}>
                      Cancelar
                    </Button>
                  </div>
                </form>
              )}
            </Form>
          </Modal.Body>
        </Modal>
      </Dashboard>
    </LoadingScreen>
  )
}
