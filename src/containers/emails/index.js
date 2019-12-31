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
    title: 'Tipo'
  },
  {
    dataIndex: 'Content',
    key: 'Content',
    title: 'Descrição',
    render: (history, { Content }) => {
      const text = Content.length > 130 ? `${Content.substring(0, 130)}...` : Content
      return text.replace(/(<([^>]+)>)/ig, ' ').replace('&nbsp', ' ').replace(';', '')
    }
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

export default function Emails ({ location, history }) {
  const { get, isLoading, emails } = useStateAndDispatch()
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
            currentPage: emails.page,
            perPage: Number(emails.pageSize),
            total: emails.totalRecords
          }}
          onChange={(pagination) => _updatePagination(pagination)}
        />
      </Filters>
    </Dashboard>
  )
}
