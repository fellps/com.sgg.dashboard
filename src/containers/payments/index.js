import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Modal } from 'react-bootstrap'
import LoadingScreen from 'react-loading-screen'
import { Link } from 'react-router-dom'

import Dashboard from '../dashboard'
import Filters from '../filters'
import toParams from '../filters/toParams'

import useMount from '../../helpers/useMount'

import { get, save } from './actions'

import Table from '../../components/tableSelect'
import Button from '../../components/button'

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
    Header: 'Cargo',
    accessor: 'JobName',
    Cell: props => <span className='number'>{props.value}</span>
  },
  {
    Header: 'Valor',
    accessor: 'Amount',
    Cell: props => <span className='number'>R$ {props.value.toFixed(2)}</span>
  }
]

function useStateAndDispatch () {
  const dispatch = useDispatch()
  const payments = useSelector(state => state.payments.payments)
  const isLoading = useSelector(state => state.isLoading[get])

  return {
    payments,
    get: params => dispatch(get(params)),
    save: params => dispatch(save(params)),
    isLoading
  }
}

export default function Payments ({ history, location }) {
  const { get, save, isLoading, payments } = useStateAndDispatch()
  const [rows, setRows] = useState({ rows: [] })
  const [showModal, setShowModal] = useState(false)
  const [showLoading, setShowLoading] = useState(false)

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
    await save(rows)
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
        <Modal show={showModal}>
          <Modal.Header closeButton>
            <Modal.Title>Efetuar pagamentos</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Deseja realmente efetuar estes pagamentos?
            <br />
            <h3>Valor total: R$ {rows.rows.reduce((prev, row) => (prev + row.Amount), 0).toFixed(2)}</h3>
          </Modal.Body>
          <Modal.Footer>
            <Button variant='primary' onClick={submit}>
              Confirmar
            </Button>
            <Button variant='secondary' onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
          </Modal.Footer>
        </Modal>
      </Dashboard>
    </LoadingScreen>
  )
}
