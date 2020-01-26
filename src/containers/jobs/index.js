import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  Modal,
  ButtonToolbar,
  ButtonGroup
} from 'react-bootstrap'

import Dashboard from '../dashboard'

import useMount from '../../helpers/useMount'
import { toCPF } from '../../helpers/formatter'

import Filters from '../filters'
import toParams from '../filters/toParams'

import {
  get,
  getInvitationStatistics,
  sendPush,
  clearJob,
  clearStatistics
} from './actions'

import Button from '../../components/button'
import Table from '../../components/table'

import qs from 'qs'

import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'

function useStateAndDispatch () {
  const dispatch = useDispatch()
  const jobs = useSelector(state => state.jobs.jobs)
  const statistics = useSelector(state => state.jobs.statistics)
  const isLoading = useSelector(state => state.isLoading[get])
  const isLoadingPush = useSelector(state => state.isLoading[sendPush])
  const isLoadingInvitations = useSelector(state => state.isLoading[getInvitationStatistics])

  return {
    jobs,
    statistics,
    isLoading,
    isLoadingPush,
    isLoadingInvitations,
    get: params => dispatch(get(params)),
    getInvitationStatistics: params => dispatch(getInvitationStatistics(params)),
    sendPush: params => dispatch(sendPush(params)),
    clearJob: () => dispatch(clearJob()),
    clearStatistics: () => dispatch(clearStatistics())
  }
}

export default function Jobs ({ location, history, match }) {
  const {
    get,
    getInvitationStatistics,
    sendPush,
    jobs,
    statistics,
    clearJob,
    clearStatistics,
    isLoading,
    isLoadingPush,
    isLoadingInvitations
  } = useStateAndDispatch()
  const [showModal, setShowModal] = useState(false)
  const [showModalAccepted, setShowModalAccepted] = useState(false)
  const [showModalRejected, setShowModalRejected] = useState(false)
  const [IdJob, setJob] = useState(0)

  const columns = [
    { dataIndex: 'Name', key: 'Name', title: 'Nome' },
    { dataIndex: 'StartAt', key: 'StartAt', title: 'Início' },
    { dataIndex: 'EndAt', key: 'EndAt', title: 'Fim' },
    { dataIndex: 'Amount', key: 'Amount', title: 'Diária', render: (history, { Amount }) => <span>R$ {Amount.toFixed(2)}</span> },
    {
      dataIndex: 'Accepted',
      key: 'Accepted',
      title: 'Aceitos/Total',
      render: (localHistory, { IdJob, Accepted, Vacancies }) => (
        <Button
          size='sm'
          variant='link'
          onClick={() => {
            clearStatistics()
            setShowModalAccepted(true)
            getInvitationStatistics(toParams({
              IdJob,
              Accepted: 1
            }))
          }}
        >{Accepted} de {Vacancies}</Button>
      )
    },
    {
      dataIndex: 'Rejected',
      key: 'Rejected',
      title: 'Rejeitados',
      render: (localHistory, { IdJob, Rejected }) => (
        <Button
          size='sm'
          variant='link'
          onClick={() => {
            clearStatistics()
            setShowModalRejected(true)
            getInvitationStatistics(toParams({
              IdJob,
              Accepted: 0
            }))
          }}
        >{Rejected}</Button>
      )
    },
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

  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
  const fileExtension = '.xlsx'

  const exportToCSV = (csvData, fileName) => {
    const ws = XLSX.utils.json_to_sheet(csvData, { header: ['Name', 'Document', 'Email', 'Sex'] })
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const data = new Blob([excelBuffer], { type: fileType })
    FileSaver.saveAs(data, fileName + fileExtension)
  }

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

  const handleClose = () => {
    setShowModal(false)
    setShowModalAccepted(false)
    setShowModalRejected(false)
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
            currentPage: jobs.page,
            perPage: Number(jobs.pageSize),
            total: jobs.totalRecords
          }}
          onChange={(pagination) => _updatePagination(pagination)}
        />
      </Filters>
      <Modal centered show={showModal} onHide={handleClose}>
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
      <Modal size='lg' centered show={showModalAccepted} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Aceitaram o convite</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Lista de pessoas que aceitaram o convite até o momento</p>
          <Table
            columns={[
              { dataIndex: 'Name', title: 'Nome' },
              { dataIndex: 'Document', title: 'CPF', render: d => toCPF(d) },
              { dataIndex: 'Email', title: 'Email' },
              { dataIndex: 'Sex', title: 'Sexo' }
            ]}
            data={statistics}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant='primary' onClick={() => exportToCSV(statistics, 'usuarios-confirmados')} isLoading={isLoadingInvitations}>
            Exportar planilha
          </Button>
          <Button isLoading={isLoadingInvitations} onClick={handleClose}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal size='lg' centered show={showModalRejected} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Rejeitaram o convite</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Lista de pessoas que rejeitaram o convite até o momento</p>
          <Table
            columns={[
              { dataIndex: 'Name', title: 'Nome' },
              { dataIndex: 'Document', title: 'CPF', render: d => toCPF(d) },
              { dataIndex: 'Email', title: 'Email' },
              { dataIndex: 'Sex', title: 'Sexo' }
            ]}
            data={statistics}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant='primary' onClick={() => exportToCSV(statistics, 'usuarios-rejeitaram')} isLoading={isLoadingInvitations}>
            Exportar planilha
          </Button>
          <Button isLoading={isLoadingInvitations} onClick={handleClose}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>
    </Dashboard>
  )
}
