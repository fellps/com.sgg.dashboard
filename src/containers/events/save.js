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
  clearEvent,
  getOne
} from './actions'

import useMount from '../../helpers/useMount'

import Button from '../../components/button'

import InputText from '../../components/inputs/text'
import SwitchInput from '../../components/inputs/switch'
import InputWysiwyg from '../../components/inputs/wysiwyg'
import InputDate from '../../components/inputs/date'
import InputHour from '../../components/inputs/hour'
import InputUpload from '../../components/inputs/upload'

import Form from 'react-nonconformist'

import moment from 'moment'

function useStateAndDispatch () {
  const dispatch = useDispatch()
  const event = useSelector(state => state.events.event)
  const response = useSelector(state => state.events.response)
  const isLoading = useSelector(state => state.isLoading[save])

  return {
    event,
    response,
    isLoading,
    save: params => dispatch(save(params)),
    set: params => dispatch(set(params)),
    clearEvent: () => dispatch(clearEvent()),
    getOne: params => dispatch(getOne(params))
  }
}

export default function EventSave ({ history, match }) {
  const {
    event,
    response,
    isLoading,
    save,
    set,
    getOne
  } = useStateAndDispatch()

  const screenType = match.path === '/events/:uuid' ? 'edit' : 'view'

  useMount(() => {
    if (match.path === '/events/:uuid') {
      getOne({ uuid: match.params.uuid })
    }
  })

  const submit = async () => {
    await save({
      IdEvent: event.IdEvent,
      Name: event.Name,
      Description: event.Description,
      StartAt: moment.utc(event.StartAt + ' ' + event.StartTime, 'DD/MM/YYYY HH:mm').format('YYYY-MM-DD HH:mm:ss'),
      EndAt: moment.utc(event.EndAt + ' ' + event.EndTime, 'DD/MM/YYYY HH:mm').format('YYYY-MM-DD HH:mm:ss'),
      IsEnabled: event.IsEnabled !== void (0) ? event.IsEnabled : 1,
      Address: event.Address,
      Image: event.Image
    })

    history.push('/home')
  }

  return (
    <Dashboard
      title={screenType === 'edit' ? 'Editar Evento' : 'Novo Evento'}
      header={
        <ButtonToolbar className='justify-content-between'>
          <ButtonGroup>
            <Button variant='secondary' to={`/events`}>←&nbsp;&nbsp;Voltar</Button>
          </ButtonGroup>
        </ButtonToolbar>
      }>
      <Alert variant='danger' show={response.status === 'error'}>
        {response.message}
      </Alert>
      <Form
        values={event}
        onSubmit={submit}
        onChange={set}
      >
        {(connect, submit) => (
          <form onSubmit={e => {
            e.preventDefault()
            submit()
          }}>
            <Card
              header={<h3 className='mb-0'>Evento</h3>}
              shadow
            >
              <Row>
                <Col sm={12} md={12}>
                  {screenType === 'edit' && <SwitchInput {...connect('IsEnabled')} label='Status do evento' />}
                  <InputText
                    {...connect('Name')}
                    label='Nome do evento'
                    placeholder='Nome do evento'
                    required
                  />
                  <Row>
                    <Col>
                      <InputDate
                        {...connect('StartAt')}
                        placeholder='Data de início'
                        label='Data de início'
                        required
                      />
                    </Col>
                    <Col sm={12} md={5}><InputHour {...connect('StartTime')} label='Hora de início' required /></Col>
                  </Row>
                  <Row>
                    <Col>
                      <InputDate
                        {...connect('EndAt')}
                        placeholder='Data fim'
                        disabledDaysBefore={event.startDate}
                        label='Data fim'
                        required
                      />
                    </Col>
                    <Col sm={12} md={5}><InputHour {...connect('EndTime')} label='Hora Fim' required /></Col>
                  </Row>
                  <Row>
                    <Col sm={12} md={4}>
                      <InputUpload {...connect('Image')} label='Imagem do evento (670x450px)' />
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={12} md={12}>
                      <InputText
                        {...connect('Address')}
                        label='Endereço do evento'
                        placeholder='Endereço do evento'
                        required
                      />
                    </Col>
                  </Row>
                  <InputWysiwyg {...connect('Description')} label='Descrição' placeholder='Descrição' required />
                </Col>
              </Row>
            </Card>
            <div style={{ marginTop: 20 }}>
              <Alert variant='danger' show={response.status === 'error'}>
                {response.message}
                <pre>
                  {JSON.stringify(response, null, 2)}
                </pre>
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
