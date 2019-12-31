import React, { useState, useCallback } from 'react'

import Dashboard from '../dashboard'

import Card from '../../components/card'
import Button from '../../components/button'
import Alert from '../../components/alert'

import Form from 'react-nonconformist'

import TextInput from '../../components/inputs/text'
import NumericInput from '../../components/inputs/numeric'
import PhoneInput from '../../components/inputs/phone'
import CPFInput from '../../components/inputs/cpf'
import SelectInput from '../../components/inputs/select'
import InputAddress from '../../components/inputs/address'
import SwitchInput from '../../components/inputs/switch'
import TagsInput from '../../components/inputs/tags'
import PositionsSelector from '../../components/inputs/positionsSelector'
import Table from '../../components/table'
import InputWysiwyg from '../../components/inputs/wysiwyg'

import Gallery from 'react-photo-gallery'
import Carousel, { Modal, ModalGateway } from 'react-images'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'

import {
  Row,
  Col,
  ButtonToolbar,
  ButtonGroup
} from 'react-bootstrap'

import useMount from '../../helpers/useMount'

import { useDispatch, useSelector } from 'react-redux'

import { getOne, getUserStatus, clearUser, set, save } from './actions'

const columns = [
  {
    dataIndex: 'EventName',
    key: 'EventName',
    title: 'Nome do evento'
  },
  {
    dataIndex: 'JobName',
    key: 'JobName',
    title: 'Cargo'
  },
  {
    dataIndex: 'Amount',
    key: 'Amount',
    title: 'Valor do pagamento',
    render: (history, { Amount }) => (
      <span>R$ {Amount.toFixed(2)}</span>
    )
  },
  {
    dataIndex: 'CreatedAt',
    key: 'CreatedAt',
    title: 'Data do pagamento'
  }
]

function useStateAndDispatch () {
  const dispatch = useDispatch()
  const user = useSelector(state => state.users.user)
  const userStatus = useSelector(state => state.users.userStatus)
  const response = useSelector(state => state.users.response)
  const transactions = useSelector(state => state.users.transactions)
  const isLoading = useSelector(state => state.isLoading[getOne])

  return {
    user,
    userStatus,
    response,
    transactions,
    getOne: params => dispatch(getOne(params)),
    getUserStatus: params => dispatch(getUserStatus(params)),
    set: params => dispatch(set(params)),
    save: params => dispatch(save(params)),
    clearUser: () => dispatch(clearUser()),
    isLoading
  }
}

export default function UserView ({ history, match }) {
  const [currentImage, setCurrentImage] = useState(0)
  const [viewerIsOpen, setViewerIsOpen] = useState(false)

  const openLightbox = useCallback((event, { photo, index }) => {
    setCurrentImage(index)
    setViewerIsOpen(true)
  }, [])

  const closeLightbox = () => {
    setCurrentImage(0)
    setViewerIsOpen(false)
  }

  const {
    user,
    userStatus,
    response,
    getOne,
    getUserStatus,
    save,
    set,
    clearUser,
    isLoading
  } = useStateAndDispatch()

  useMount(() => {
    getOne({ _id: match.params.uuid })
    getUserStatus()
    return clearUser
  })

  const submit = async () => {
    await save(user)
    history.push('/users')
  }

  return (
    <Dashboard
      title='Ver Usuário'
      header={
        <ButtonToolbar className='justify-content-between'>
          <ButtonGroup>
            <Button variant='secondary' to={`/users`}>←&nbsp;&nbsp;Voltar</Button>
          </ButtonGroup>
        </ButtonToolbar>
      }
    >
      <Row>
        <Col
          md={12} sm={12}
        >
          <Card
            isLoading={isLoading}
            header={<h3 className='mb-0'>Perfil</h3>}
            shadow
          >
            <Alert variant='danger' show={response.status === 'error'}>
              {response.message}
              <pre>
                {JSON.stringify(response, null, 2)}
              </pre>
            </Alert>
            <Tabs>
              <TabList>
                <Tab>Dados pessoais</Tab>
                <Tab>Documentos</Tab>
                <Tab>Histórico de Pagamentos</Tab>
              </TabList>
              <TabPanel>
                <Form
                  values={user}
                  onChange={set}
                  onSubmit={submit}
                >
                  {(connect, submit) => (
                    <form onSubmit={e => {
                      e.preventDefault()
                      submit()
                    }}>
                      <SwitchInput {...connect('IsBlacklisted')} label='Blacklist' />
                      <PositionsSelector {...connect('IdPosition')} label='Cargo' />
                      <TagsInput {...connect('Tags')} label='Tags' />
                      <NumericInput {...connect('Score')} label='Pontuação' />
                      <SelectInput
                        {...connect('Status')}
                        label={'Status'}
                        value={user.Status}
                        options={userStatus}
                        required
                      />
                      <TextInput {...connect('Name')} label='Nome Completo' required />
                      <CPFInput {...connect('Document')} label='CPF' disabled required />
                      <TextInput {...connect('Email')} label='Email' required />
                      <PhoneInput {...connect('PhoneNumber')} />
                      <TextInput {...connect('Instagram')} label='Instagram' required />
                      <InputAddress {...connect('Address')} />
                      <InputWysiwyg {...connect('Description')} label='Descrição' placeholder='Descrição' required />
                      <hr />
                      <div style={{ textAlign: 'right' }}>
                        <Button type='submit'>Salvar</Button>
                      </div>
                    </form>
                  )}
                </Form>
              </TabPanel>
              <TabPanel>
                {user.Documents.length > 0
                  ? <div>
                    <Gallery photos={user.Documents.map(document => ({ src: document.Url, width: 1.75, height: 1 }))} onClick={openLightbox} direction='column' columns={3} />
                    <ModalGateway>
                      {viewerIsOpen ? (
                        <Modal onClose={closeLightbox}>
                          <Carousel
                            currentIndex={currentImage}
                            views={user.Documents.map(document => ({ src: document.Url, width: 1.75, height: 1 })).map(x => ({
                              ...x,
                              srcset: x.srcSet,
                              caption: x.title
                            }))}
                          />
                        </Modal>
                      ) : null}
                    </ModalGateway>
                  </div>
                  : <p>Nenhum documento para exibir!</p>}
              </TabPanel>
              <TabPanel>
                {user.Payments.length > 0
                  ? <Table
                    columns={columns}
                    data={user.Payments.map(d => ({
                      ...d,
                      actions: history
                    }))}
                  />
                  : <p>Nenhum pagamento para exibir!</p>
                }
              </TabPanel>
            </Tabs>
          </Card>
        </Col>
      </Row>
    </Dashboard>
  )
}
