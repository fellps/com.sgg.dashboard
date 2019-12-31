import React, { useState } from 'react'

import Dashboard from '../dashboard'

import { useSelector, useDispatch } from 'react-redux'

import useMount from '../../helpers/useMount'

import Filters from '../filters'
import toParams from '../filters/toParams'

import {
  Modal,
  ButtonToolbar,
  ButtonGroup
} from 'react-bootstrap'

import { get, sendPush, clearJob } from './actions'

import Button from '../../components/button'
import Table from '../../components/table'

import qs from 'qs'

function useStateAndDispatch () {
  const dispatch = useDispatch()
  const jobs = useSelector(state => state.jobs.jobs)
  const isLoading = useSelector(state => state.isLoading[get])
  const isLoadingPush = useSelector(state => state.isLoading[sendPush])

  return {
    jobs,
    isLoading,
    isLoadingPush,
    get: params => dispatch(get(params)),
    sendPush: params => dispatch(sendPush(params)),
    clearJob: () => dispatch(clearJob())
  }
}

export default function Jobs ({ location, history, match }) {
  const {
    get,
    sendPush,
    jobs,
    clearJob,
    isLoading,
    isLoadingPush
  } = useStateAndDispatch()
  const [showModal, setShowModal] = useState(false)
  const [IdJob, setJob] = useState(0)

  const columns = [
    { dataIndex: 'Name', key: 'Name', title: 'Nome' },
    { dataIndex: 'StartAt', key: 'StartAt', title: 'Início' },
    { dataIndex: 'EndAt', key: 'EndAt', title: 'Fim' },
    { dataIndex: 'Amount', key: 'Amount', title: 'Diária', render: (history, { Amount }) => (<span>R$ {Amount.toFixed(2)}</span>) },
    {
      dataIndex: 'Accepted',
      key: 'Accepted',
      title: 'Aceitos/Total',
      render: (history, { Accepted, Vacancies }) => (<span>{Accepted} de {Vacancies}</span>)
    },
    { dataIndex: 'Rejected', key: 'Rejected', title: 'Rejeitados' },
    { dataIndex: 'IsEnabled', key: 'IsEnabled', title: 'Status' },
    {
      dataIndex: 'actions',
      key: 'actions',
      title: 'Ações',
      render: (history, { IdEvent, IdJob, IsPushSent }) => (
        <React.Fragment>
          <Button
            to={`/events/jobs/${IdEvent}/edit/${IdJob}`}
            size='sm'
            variant='success'
          >Editar Vaga</Button>
          <Button
            onClick={() => {
              setJob(IdJob)
              setShowModal(true)
            }}
            disabled={IsPushSent === true}
            size='sm'
            variant='primary'
          >{IsPushSent ? 'Push Enviado' : 'Enviar Push'}</Button>
        </React.Fragment>
      )
    }
  ]

  useMount(() => {
    get(toParams(match.params))
    clearJob()
  })

  const filter = params => {
    get(toParams({ ...params, idEvent: match.params.idEvent }))
  }

  const _updatePagination = (pagination) => {
    const query = { _page: pagination }
    history.push({ search: qs.stringify(query) })
    get(toParams({ ...query, idEvent: match.params.idEvent }))
  }

  const handleSubmit = async () => {
    await sendPush({ IdJob })
    setShowModal(false)
    get(toParams(match.params))
  }

  const handleClose = () => setShowModal(false)

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
            currentPage: jobs.page,
            perPage: Number(jobs.pageSize),
            total: jobs.totalRecords
          }}
          onChange={(pagination) => _updatePagination(pagination)}
        />
      </Filters>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Enviar Push</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Deseja enviar uma notificação para todos os usuários compatíveis com a vaga?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='primary' onClick={handleSubmit} isLoading={isLoadingPush}>
            Enviar
          </Button>
          <Button variant='secondary' onClick={handleClose}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>
    </Dashboard>
  )
}
