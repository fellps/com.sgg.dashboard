import React from 'react'

import Dashboard from '../dashboard'

import { useSelector, useDispatch } from 'react-redux'

import useMount from '../../helpers/useMount'

import Filters from '../filters'
import toParams from '../filters/toParams'

import {
  ButtonToolbar,
  ButtonGroup
} from 'react-bootstrap'

import { get, clearProducer } from './actions'

import Button from '../../components/button'
import Table from '../../components/table'

import { CNPJ } from 'cpf_cnpj'

const columns = [
  { dataIndex: 'socialReason', key: 'socialReason', title: 'Nome da Produtora' },
  { dataIndex: 'cnpj', key: 'cnpj', title: 'CNPJ', render: d => CNPJ.format(d) },
  {
    dataIndex: 'actions',
    key: 'actions',
    title: 'Ações',
    render: (history, { _id }) => (
      <React.Fragment>
        <Button
          to={`/producers/${_id}`}
          size='sm'
          variant='success'
        >Editar</Button>
      </React.Fragment>
    )
  }
]

function useStateAndDispatch () {
  const dispatch = useDispatch()
  const producers = useSelector(state => state.producers.response)
  const isLoading = useSelector(state => state.isLoading[get])

  return {
    producers,
    isLoading,
    get: params => dispatch(get(params)),
    clearProducer: () => dispatch(clearProducer())
  }
}

export default function Producers ({ history }) {
  const {
    get,
    producers,
    clearProducer,
    isLoading
  } = useStateAndDispatch()

  useMount(() => {
    get()
    clearProducer()
  })

  const filter = params => {
    get(toParams(params))
  }

  return (
    <Dashboard
      title='Produtoras'
      header={
        <ButtonToolbar
          className='justify-content-between'
        >
          <ButtonGroup>
            {/* <Button variant='primary' className='active'>Próximos</Button>
            <Button variant='secondary'>Realizados</Button> */}
          </ButtonGroup>
          <Button icon='fat-add' to='/producers/create'>
            Criar Novo
          </Button>
        </ButtonToolbar>
      }
    >
      <Filters
        title='Produtoras'
        history={history}
        isLoading={isLoading}
        onFilter={filter}
        filters={[
          { name: 'socialReason', input: 'TextInput', label: 'Razão Social' },
          { name: 'CNPJ', input: 'CNPJ', label: 'CNPJ' }
        ]}
      >
        <Table
          columns={columns}
          data={producers && producers.data && producers.data.length > 0 && producers.data.map(d => ({
            ...d,
            actions: history
          }))}
          pagination={{
            currentPage: producers.data.current_page,
            perPage: Number(producers.data.per_page),
            total: producers.data.total
          }}
        />
      </Filters>
    </Dashboard>
  )
}
