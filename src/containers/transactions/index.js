import React from 'react'

import { useDispatch, useSelector } from 'react-redux'

import Dashboard from '../dashboard'
import Filters from '../filters'

import Table from '../../components/table'

import toParams from '../filters/toParams'

import { get } from './actions'

import { toReais, toCPF } from '../../helpers/formatter'
import useMount from '../../helpers/useMount'

import qs from 'qs'

import moment from 'moment'

const columns = [
  { dataIndex: 'codigo', key: 'codigo', title: 'Código' },
  { dataIndex: 'bilhete', key: 'bilhete', title: 'Nome do Ingresso' },
  {
    dataIndex: 'cadastro',
    key: 'cadastro',
    title: 'Comprado em',
    render: d => moment(d).format('DD/MM/YYYY HH:mm:ss')
  },
  { dataIndex: 'pdv', key: 'pdv', title: 'PDV', render: d => d || '-' },
  { dataIndex: 'setor', key: 'setor', title: 'Setor', render: d => d || '-' },
  { dataIndex: 'valor', key: 'valor', title: 'Valor', render: toReais },
  { dataIndex: 'cpf', key: 'cpf', title: 'CPF', render: d => d ? toCPF(d) : '-' }
]

function useStateAndDispatch () {
  const dispatch = useDispatch()
  const transactions = useSelector(state => state.transactions.response)
  const isLoading = useSelector(state => state.isLoading[get])

  return {
    transactions,
    isLoading,
    get: params => dispatch(get(params))
  }
}

export default function Transactions ({ history }) {
  const {
    isLoading,
    transactions,
    get
  } = useStateAndDispatch()

  useMount(() => {
    get()
  })

  const filter = params => get(toParams(params))

  const paginate = page => {
    const query = toParams({ ...qs.parse(window.location.search, { ignoreQueryPrefix: true }), page })
    // console.log(query)
    get(query)
  }

  return (
    <Dashboard>
      <Filters
        title='Transações'
        history={history}
        isLoading={isLoading}
        onFilter={filter}
        filters={[
          { name: 'codigo', input: 'TextInput', label: 'Código' },
          { name: 'CPF', label: 'CPF' }
        ]}
      >
        <Table
          columns={columns}
          onChange={paginate}
          data={transactions.data.items.map(d => ({
            ...d,
            actions: history
          }))}
          pagination={{
            currentPage: transactions.data.current_page,
            perPage: Number(transactions.data.per_page),
            total: transactions.data.total
          }}
        />
      </Filters>
    </Dashboard>
  )
}
