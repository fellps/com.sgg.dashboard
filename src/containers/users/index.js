import React from 'react'

import Dashboard from '../dashboard'
import Filters from '../filters'
import toParams from '../filters/toParams'

import { useSelector, useDispatch } from 'react-redux'

import useMount from '../../helpers/useMount'

import { get } from './actions'

import Button from '../../components/button'
import Table from '../../components/table'

import qs from 'qs'

const columns = [
  {
    dataIndex: 'Name',
    key: 'Name',
    title: 'Nome'
  },
  {
    dataIndex: 'Status',
    key: 'Status',
    title: 'Status'
  },
  {
    dataIndex: 'Email',
    key: 'Email',
    title: 'Email'
  },
  {
    dataIndex: 'PhoneNumber',
    key: 'PhoneNumber',
    title: 'Telefone'
  },
  {
    dataIndex: 'actions',
    key: 'actions',
    title: 'Ações',
    render: (history, { IdUser }) => (
      <React.Fragment>
        <Button
          to={`/users/${IdUser}`}
          size='sm'
          variant='success'
        >Editar</Button>
      </React.Fragment>
    )
  }
]

function useStateAndDispatch () {
  const dispatch = useDispatch()
  const users = useSelector(state => state.users.users)
  const isLoading = useSelector(state => state.isLoading[get])

  return {
    users,
    get: params => dispatch(get(params)),
    isLoading
  }
}

export default function Users ({ location, history }) {
  const { get, isLoading, users } = useStateAndDispatch()
  useMount(() => {
    get()
  })

  const filter = params => {
    get(toParams(params))
  }

  const _updatePagination = (pagination) => {
    const query = { ...qs.parse(location.search.replace('?', '')), _page: pagination }
    history.push({ search: qs.stringify(query) })
    get(toParams({ ...query }))
  }

  return (
    <Dashboard
      title='Usuários'
    >
      <Filters
        isLoading={isLoading}
        history={history}
        onFilter={filter}
        filters={[
          { name: 'name', input: 'TextInput', label: 'Nome', placeholder: 'Nome do usuário' },
          { name: 'cpf', input: 'CPF', label: 'CPF', placeholder: 'CPF do usuário' },
          { name: 'userStatus', input: 'UserStatus', label: 'Status', placeholder: 'Status' }
        ]}
        title='Usuários'
      >
        <Table
          columns={columns}
          data={users && users.data && users.data.length > 0 && users.data.map(d => ({
            ...d,
            actions: history
          }))}
          pagination={{
            currentPage: users.page,
            perPage: Number(users.pageSize),
            total: users.totalRecords
          }}
          onChange={(pagination) => _updatePagination(pagination)}
        />
      </Filters>
    </Dashboard>
  )
}
