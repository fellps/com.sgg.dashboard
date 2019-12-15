import React from 'react'

import Dashboard from '../dashboard'

import { useDispatch, useSelector } from 'react-redux'

import Card from '../../components/card'
import Alert from '../../components/alert'

import {
  Row,
  Col,
  ButtonToolbar,
  ButtonGroup
} from 'react-bootstrap'

import {
  set,
  save,
  clearDevice,
  getOne,
  getAcquirers
} from './actions'

import {
  get as getMenus
} from '../menus/actions'

import useMount from '../../helpers/useMount'

import Button from '../../components/button'

import InputText from '../../components/inputs/text'
import SwitchInput from '../../components/inputs/switch'
import MultiSelect from '../../components/multiSelect'
import SelectInput from '../../components/inputs/select'

import Form from 'react-nonconformist'

function useStateAndDispatch () {
  const dispatch = useDispatch()
  const device = useSelector(state => state.devices.device)
  const menus = useSelector(state => state.menus.menus)
  const response = useSelector(state => state.devices.response)
  const acquirers = useSelector(state => state.devices.acquirers)
  const isLoading = useSelector(state => state.isLoading[save])

  return {
    device,
    menus,
    response,
    acquirers,
    isLoading,
    save: params => dispatch(save(params)),
    set: params => dispatch(set(params)),
    clearDevice: () => dispatch(clearDevice()),
    getOne: params => dispatch(getOne(params)),
    getMenus: params => dispatch(getMenus(params)),
    getAcquirers: params => dispatch(getAcquirers(params))
  }
}

export default function EventSave ({ history, match }) {
  const {
    device,
    menus,
    response,
    acquirers,
    isLoading,
    save,
    set,
    getOne,
    getMenus,
    getAcquirers
  } = useStateAndDispatch()

  const screenType = match.path === '/events/:uuid/pos/:uuidDevice' ? 'edit' : 'view'

  useMount(() => {
    if (screenType === 'edit') {
      getOne({ uuidDevice: match.params.uuidDevice })
    }
    getMenus({ uuid: match.params.uuid })
    getAcquirers()
  })

  const submit = async () => {
    await save({
      _id: device._id,
      eventId: match.params.uuid,
      name: device.name,
      menusIds: device.menusIds,
      acquirer: device.acquirer,
      isEnabled: device.isEnabled,
      isQRCodeEnabled: device.isQRCodeEnabled !== void (0) ? device.isQRCodeEnabled : false
    })

    history.push('/events/' + match.params.uuid + '/pos')
  }

  return (
    <Dashboard
      title={screenType === 'edit' ? 'Editar PDV' : 'Novo PDV'}
      header={
        <ButtonToolbar className='justify-content-between'>
          <ButtonGroup>
            <Button variant='secondary' to={`/events/${match.params.uuid}/pos`}>←&nbsp;&nbsp;Voltar</Button>
          </ButtonGroup>
        </ButtonToolbar>
      }>
      <Alert variant='danger' show={response.status === 'error'}>
        {response.message}
      </Alert>
      <Form
        values={device}
        onSubmit={submit}
        onChange={set}
      >
        {(connect, submit) => (
          <form onSubmit={e => {
            e.preventDefault()
            submit()
          }}>
            <Card
              header={<h3 className='mb-0'>Ponto de venda</h3>}
              shadow
            >
              <Row>
                <Col sm={12} md={12}>
                  {screenType === 'edit' && <SwitchInput {...connect('isEnabled')} label='Status do PDV' />}
                  <SwitchInput {...connect('isQRCodeEnabled')} label='Imprimir QRCode' />
                  <SelectInput
                    {...connect('acquirer')}
                    label={'Adquirente'}
                    value={device.acquirer}
                    options={acquirers}
                    required
                  />
                  <InputText {...connect('name')} label='Nome do PDV' required />
                  <MultiSelect {...connect('menusIds')}
                    items={menus.data}
                    selectedItems={device.menusIds}
                    required />
                </Col>
              </Row>
            </Card>
            <div style={{ marginTop: 20 }}>
              <Alert variant='danger' show={response.status === 'error'}>
                {response.message}
              </Alert>
              <Button
                isLoading={isLoading}
                type='button'
                onClick={submit}
              >Salvar</Button>
            </div>
          </form>
        )}
      </Form>
    </Dashboard>
  )
}
