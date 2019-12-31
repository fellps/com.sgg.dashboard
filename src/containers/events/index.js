import React from 'react'

import Dashboard from '../dashboard'

import { useSelector, useDispatch } from 'react-redux'

import useMount from '../../helpers/useMount'

import Filters from '../filters'
import toParams from '../filters/toParams'

import {
  ButtonToolbar
} from 'react-bootstrap'

import { get, clearEvent } from './actions'

import Button from '../../components/button'
import Table from '../../components/table'

import qs from 'qs'

const columns = [
  { dataIndex: 'Name', key: 'Name', title: 'Nome' },
  { dataIndex: 'StartAt', key: 'StartAt', title: 'Início' },
  { dataIndex: 'EndAt', key: 'EndAt', title: 'Fim' },
  { dataIndex: 'IsEnabled', key: 'IsEnabled', title: 'Status' },
  {
    dataIndex: 'actions',
    key: 'actions',
    title: 'Ações',
    render: (history, { IdEvent }) => (
      <React.Fragment>
        <Button
          to={`/events/${IdEvent}`}
          size='sm'
          variant='success'
        >Editar Evento</Button>
        <Button
          to={`/events/jobs/${IdEvent}`}
          size='sm'
          variant='primary'
        >Visualizar Vagas</Button>
      </React.Fragment>
    )
  }
]

function useStateAndDispatch () {
  const dispatch = useDispatch()
  const events = useSelector(state => state.events.events)
  const isLoading = useSelector(state => state.isLoading[get])

  return {
    events,
    isLoading,
    get: params => dispatch(get(params)),
    clearEvent: () => dispatch(clearEvent())
  }
}

export default function Events ({ location, history }) {
  const {
    get,
    events,
    clearEvent,
    isLoading
  } = useStateAndDispatch()

  useMount(() => {
    get()
    clearEvent()
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
      title='Eventos'
      header={
        <ButtonToolbar
          className='justify-content-end'
        >
          <Button icon='fat-add' to='/events/create'>
            Criar Evento
          </Button>
        </ButtonToolbar>
      }
    >
      <Filters
        title='Eventos'
        history={history}
        isLoading={isLoading}
        onFilter={filter}
        filters={[
          { name: 'name', input: 'TextInput', label: 'Nome do evento', placeholder: 'Nome do evento' }
        ]}
      >
        <Table
          columns={columns}
          data={events && events.data && events.data.length > 0 && events.data.map(d => ({
            ...d,
            actions: history
          }))}
          pagination={{
            currentPage: events.page,
            perPage: Number(events.pageSize),
            total: events.totalRecords
          }}
          onChange={(pagination) => _updatePagination(pagination)}
        />
      </Filters>
    </Dashboard>
  )
}
