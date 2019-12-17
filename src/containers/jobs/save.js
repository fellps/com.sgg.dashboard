import React, { useEffect } from 'react'

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
  clearJob,
  getOne,
  getAvailableUsers
} from './actions'

import useMount from '../../helpers/useMount'

import Button from '../../components/button'

import InputText from '../../components/inputs/text'
import InputNumeric from '../../components/inputs/numeric'
import InputWysiwyg from '../../components/inputs/wysiwyg'
import InputDate from '../../components/inputs/date'
import InputHour from '../../components/inputs/hour'
import InputUpload from '../../components/inputs/upload'
import InputSlider from '../../components/inputs/slider'
import InputGender from '../../components/inputs/gender'
import InputPositions from '../../components/inputs/positionsSelector'
import SwitchInput from '../../components/inputs/switch'
import InputTag from '../../components/inputs/tags'

import Form from 'react-nonconformist'

import moment from 'moment'

function useStateAndDispatch () {
  const dispatch = useDispatch()
  const job = useSelector(state => state.jobs.job)
  const availableUsers = useSelector(state => state.jobs.availableUsers)
  const response = useSelector(state => state.jobs.response)
  const isLoading = useSelector(state => state.isLoading[save])

  return {
    job,
    availableUsers,
    response,
    isLoading,
    save: params => dispatch(save(params)),
    set: params => dispatch(set(params)),
    clearJob: () => dispatch(clearJob()),
    getOne: params => dispatch(getOne(params)),
    getAvailableUsers: params => dispatch(getAvailableUsers(params))
  }
}

export default function JobSave ({ history, match }) {
  const {
    job,
    availableUsers,
    response,
    isLoading,
    save,
    set,
    getOne,
    getAvailableUsers
  } = useStateAndDispatch()

  const screenType = match.path === '/events/jobs/:idEvent/edit/:idJob' ? 'edit' : 'view'

  useMount(() => {
    if (screenType === 'edit') {
      getOne({ idEvent: match.params.idEvent, idJob: match.params.idJob })
    }
  })

  useEffect(() => {
    getAvailableUsers({
      MinAge: job.Age ? job.Age[0] : job.MinAge || 18,
      MaxAge: job.Age ? job.Age[1] : job.MaxAge || 100,
      Sex: job.Sex || '',
      IdPosition: job.IdPosition || '',
      Tags: JSON.stringify(job.Tags || [])
    })
  }, [job.Age, job.Sex, job.IdPosition, job.Tags])

  const submit = async () => {
    await save({
      IdEvent: job.IdEvent || match.params.idEvent,
      IdJob: job.IdJob,
      Name: job.Name,
      Vacancies: job.Vacancies,
      ExtraVacancies: job.ExtraVacancies,
      IdPosition: job.IdPosition || '',
      MinAge: job.Age ? job.Age[0] : 18,
      MaxAge: job.Age ? job.Age[1] : 100,
      Sex: job.Sex || '',
      Tags: JSON.stringify(job.Tags || []),
      Description: job.Description,
      StartAt: moment.utc(job.StartAt + ' ' + job.StartTime, 'DD/MM/YYYY HH:mm').format('YYYY-MM-DD HH:mm:ss'),
      EndAt: moment.utc(job.EndAt + ' ' + job.EndTime, 'DD/MM/YYYY HH:mm').format('YYYY-MM-DD HH:mm:ss'),
      Image: job.Image,
      IsEnabled: job.IsEnabled || 1
    })

    history.push(`/events/jobs/${match.params.idEvent}`)
  }

  return (
    <Dashboard
      title={screenType === 'edit' ? 'Editar Vaga' : 'Nova Vaga'}
      header={
        <ButtonToolbar className='justify-content-between'>
          <ButtonGroup>
            <Button variant='secondary' to={`/events/jobs/${match.params.idEvent}`}>←&nbsp;&nbsp;Voltar</Button>
          </ButtonGroup>
        </ButtonToolbar>
      }>
      <Alert variant='danger' show={response.status === 'error'}>
        {response.message}
      </Alert>
      <Form
        values={job}
        onSubmit={submit}
        onChange={set}
      >
        {(connect, submit) => (
          <form onSubmit={e => {
            e.preventDefault()
            submit()
          }}>
            <Card
              header={<h3 className='mb-0'>Vaga</h3>}
              shadow
            >
              <Row>
                <Col sm={12} md={12}>
                  {screenType === 'edit' && <SwitchInput {...connect('IsEnabled')} label='Status da vaga' />}
                  <InputText
                    {...connect('Name')}
                    label='Nome da vaga'
                    placeholder='Nome da vaga'
                    required
                  />
                  <h4 style={{ paddingTop: 25 }}>Configuração da vaga</h4>
                  <hr />
                  <Row>
                    <Col sm={12} md={6}>
                      <InputNumeric
                        {...connect('Vacancies')}
                        label='Número de vagas'
                        placeholder='Número de vagas'
                        required
                      />
                    </Col>
                    <Col sm={12} md={6}>
                      <InputNumeric
                        {...connect('ExtraVacancies')}
                        label='Número de vagas reservas'
                        placeholder='Número de vagas reservas'
                        required
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={12} md={6}>
                      {(job.MinAge || screenType === 'view') &&
                        <InputSlider {...connect('Age')} label='Faixa de idade *' value={[job.MinAge, job.MaxAge]} required />
                      }
                    </Col>
                    <Col sm={12} md={6}>
                      <InputTag {...connect('Tags')} label='Tags' />
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={12} md={6}>
                      <InputGender {...connect('Sex')} label='Sexo' />
                    </Col>
                    <Col sm={12} md={6}>
                      <InputPositions {...connect('IdPosition')} label='Cargo' />
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={12} md={6}>
                      <label className='form-label'>Total de pessoas compatíveis</label>
                      <div>
                        <h1>{availableUsers.total}</h1>
                      </div>
                    </Col>
                  </Row>
                  <h4 style={{ paddingTop: 25 }}>Data de realização</h4>
                  <hr />
                  <Row>
                    <Col>
                      <InputDate
                        {...connect('StartAt')}
                        placeholder='Data de início'
                        label='Data de início'
                        required
                      />
                    </Col>
                    <Col sm={12} md={6}><InputHour {...connect('StartTime')} label='Hora de início' required /></Col>
                  </Row>
                  <Row>
                    <Col>
                      <InputDate
                        {...connect('EndAt')}
                        placeholder='Data fim'
                        disabledDaysBefore={job.startDate}
                        label='Data fim'
                        required
                      />
                    </Col>
                    <Col sm={12} md={6}><InputHour {...connect('EndTime')} label='Hora Fim' required /></Col>
                  </Row>
                  <h4 style={{ paddingTop: 25 }}>Mídias e informações</h4>
                  <hr />
                  <Row>
                    <Col sm={12} md={4}>
                      <InputUpload {...connect('Image')} label='Imagem da vaga (300x340px)' />
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
