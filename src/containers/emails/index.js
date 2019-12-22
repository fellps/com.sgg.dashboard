import React from 'react'

import Dashboard from '../dashboard'
import Filters from '../filters'
import toParams from '../filters/toParams'

import { useSelector, useDispatch } from 'react-redux'

import useMount from '../../helpers/useMount'

import { get } from './actions'

import Button from '../../components/button'
import Table from '../../components/table'

const columns = [
  {
    dataIndex: 'Name',
    key: 'Name',
    title: 'Tipo'
  },
  {
    dataIndex: 'actions',
    key: 'actions',
    title: 'Ações',
    render: (history, { IdEmail }) => (
      <React.Fragment>
        <Button
          to={`/emails/${IdEmail}`}
          size='sm'
          variant='success'
        >Editar</Button>
      </React.Fragment>
    )
  }
]

function useStateAndDispatch () {
  const dispatch = useDispatch()
  const emails = useSelector(state => state.emails.emails)
  const isLoading = useSelector(state => state.isLoading[get])

  return {
    emails,
    get: params => dispatch(get(params)),
    isLoading
  }
}

export default function Emails ({ history }) {
  const { get, isLoading, emails } = useStateAndDispatch()
  useMount(() => {
    get()
  })

  const filter = params => {
    get(toParams(params))
  }

  return (
    <Dashboard
      title='Emails'
    >
      <Filters
        isLoading={isLoading}
        history={history}
        onFilter={filter}
        filters={[
          { name: 'name', input: 'TextInput', label: 'Tipo', placeholder: 'Nome do tipo do email' }
        ]}
        title='Emails'
      >
        <Table
          columns={columns}
          data={emails && emails.data && emails.data.length > 0 && emails.data.map(d => ({
            ...d,
            actions: history
          }))}
          pagination={{
            currentPage: emails.data.current_page,
            perPage: Number(emails.data.per_page),
            total: emails.data.total
          }}
        />
      </Filters>
    </Dashboard>
  )
}
