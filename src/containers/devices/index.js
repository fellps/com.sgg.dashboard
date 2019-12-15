import React from 'react'

import Dashboard from '../dashboard'

import { useSelector, useDispatch } from 'react-redux'

import useMount from '../../helpers/useMount'

import Filters from '../filters'
import toParams from '../filters/toParams'

import {
  ButtonToolbar,
  ButtonGroup,
  Modal
} from 'react-bootstrap'

import { get, setShowQRCode, clearDevice } from './actions'

import Button from '../../components/button'
import Table from '../../components/table'

import QRCode from 'qrcode.react'

function useStateAndDispatch () {
  const dispatch = useDispatch()
  const devices = useSelector(state => state.devices.devices)
  const showQRCode = useSelector(state => state.devices.showQRCode)
  const isLoading = useSelector(state => state.isLoading[get])

  return {
    devices,
    showQRCode,
    isLoading,
    get: params => dispatch(get(params)),
    setShowQRCode: params => dispatch(setShowQRCode(params)),
    clearDevice: () => dispatch(clearDevice())
  }
}

export default function Events ({ history, match }) {
  const {
    get,
    devices,
    showQRCode,
    setShowQRCode,
    clearDevice,
    isLoading
  } = useStateAndDispatch()

  const handleQRCode = (id) => setShowQRCode({ show: true, id })
  const handleClose = () => setShowQRCode({ show: false })

  const columns = [
    { dataIndex: 'name', key: 'name', title: 'Nome' },
    { dataIndex: 'isEnabled', key: 'isEnabled', title: 'Status' },
    { dataIndex: 'totalMenus', key: 'totalMenus', title: 'Qt. Cardápios' },
    {
      dataIndex: 'actions',
      key: 'actions',
      title: 'Ações',
      render: (history, { _id }) => (
        <React.Fragment>
          <Button
            to={`/events/${match.params.uuid}/pos/${_id}`}
            size='sm'
            variant='success'
          >Editar</Button>
          <Button
            onClick={() => handleQRCode(_id)}
            size='sm'
            variant='primary'
          >QRCode</Button>
        </React.Fragment>
      )
    }
  ]

  useMount(() => {
    get(toParams(match.params))
    clearDevice()
  })

  const filter = params => {
    get(toParams({ ...match.params, ...params }))
  }

  return (
    <Dashboard
      title='Pontos de venda'
      header={
        <ButtonToolbar className='justify-content-between'>
          <ButtonGroup>
            <Button variant='secondary' to={`/events`}>←&nbsp;&nbsp;Voltar</Button>
          </ButtonGroup>
          <div>
            <Button icon='fat-add' to={`/events/${match.params.uuid}/pos/create`}>
              Criar Novo
            </Button>
          </div>
        </ButtonToolbar>
      }
    >
      <Filters
        title='Pontos de venda'
        history={history}
        isLoading={isLoading}
        onFilter={filter}
        filters={[
          { name: 'name', input: 'TextInput', label: 'Nome do ponto de venda' }
        ]}
      >
        <Table
          columns={columns}
          data={devices && devices.data && devices.data.length > 0 && devices.data.map(d => ({
            ...d,
            actions: history
          }))}
          pagination={{
            currentPage: devices.data.current_page,
            perPage: Number(devices.data.per_page),
            total: devices.data.total
          }}
        />
      </Filters>
      <Modal show={showQRCode.show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>QRCode</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Leia o QRCode abaixo para configurar o seu PDV!
          <div style={{ textAlign: 'center', paddingTop: 50 }}>
            <QRCode value={showQRCode.id} />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='primary' onClick={handleClose}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>
    </Dashboard>
  )
}
