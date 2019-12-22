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

import { get, clearJob } from './actions'

import Button from '../../components/button'
import Table from '../../components/table'

const columns = [
  { dataIndex: 'Name', key: 'Name', title: 'Nome' },
  { dataIndex: 'StartAt', key: 'StartAt', title: 'Início' },
  { dataIndex: 'EndAt', key: 'EndAt', title: 'Fim' },
{ dataIndex: 'Amount', key: 'Amount', title: 'Diária', render: (history, { Amount }) => (<span>R$ {Amount.toFixed(2)}</span>) },
  { dataIndex: 'IsEnabled', key: 'IsEnabled', title: 'Status' },
  {
    dataIndex: 'actions',
    key: 'actions',
    title: 'Ações',
    render: (history, { IdEvent, IdJob }) => (
      <React.Fragment>
        <Button
          to={`/events/jobs/${IdEvent}/edit/${IdJob}`}
          size='sm'
          variant='success'
        >Editar Vaga</Button>
      </React.Fragment>
    )
  }
]

function useStateAndDispatch () {
  const dispatch = useDispatch()
  const jobs = useSelector(state => state.jobs.jobs)
  const isLoading = useSelector(state => state.isLoading[get])

  return {
    jobs,
    isLoading,
    get: params => dispatch(get(params)),
    clearJob: () => dispatch(clearJob())
  }
}

export default function Jobs ({ history, match }) {
  const {
    get,
    jobs,
    clearJob,
    isLoading
  } = useStateAndDispatch()

  useMount(() => {
    get(toParams(match.params))
    clearJob()
  })

  const filter = params => {
    get(toParams({ ...params, idEvent: match.params.idEvent }))
  }

  return (
    <Dashboard
      title='Vagas'
      header={
        <ButtonToolbar className='justify-content-between'>
          <ButtonGroup>
            <Button variant='secondary' to={`/events`}>←&nbsp;&nbsp;Voltar</Button>
          </ButtonGroup>
          <div>
            <Button icon='fat-add' to={`/events/jobs/${match.params.idEvent}/create`}>
              Criar Vaga
            </Button>
          </div>
        </ButtonToolbar>
      }
    >
      <Filters
        title='Vagas'
        history={history}
        isLoading={isLoading}
        onFilter={filter}
        filters={[
          { name: 'name', input: 'TextInput', label: 'Nome da vaga', placeholder: 'Nome da vaga' }
        ]}
      >
        <Table
          columns={columns}
          data={jobs && jobs.data && jobs.data.length > 0 && jobs.data.map(d => ({
            ...d,
            actions: history
          }))}
          pagination={{
            currentPage: jobs.data.current_page,
            perPage: Number(jobs.data.per_page),
            total: jobs.data.total
          }}
        />
      </Filters>
    </Dashboard>
  )
}
