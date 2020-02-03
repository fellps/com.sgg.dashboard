import React, { useState, useCallback } from 'react'

import Dashboard from '../dashboard'

import Card from '../../components/card'
import Button from '../../components/button'
import Alert from '../../components/alert'

import Form from 'react-nonconformist'

import TextInput from '../../components/inputs/text'
import PasswordInput from '../../components/inputs/password'
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
import Events from '../../components/inputs/eventSelector'

import Gallery from 'react-photo-gallery'
import Carousel, { Modal, ModalGateway } from 'react-images'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'

import {
  Row,
  Col,
  ButtonToolbar,
  ButtonGroup,
  Modal as ModalBootstrap
} from 'react-bootstrap'

import useMount from '../../helpers/useMount'

import { useDispatch, useSelector } from 'react-redux'

import { getOne, getUserStatus, clearUser, set, setCheckout, save, manualCheckout } from './actions'

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
  const checkout = useSelector(state => state.users.checkout)
  const response = useSelector(state => state.users.response)
  const transactions = useSelector(state => state.users.transactions)
  const isLoading = useSelector(state => state.isLoading[getOne])

  return {
    user,
    userStatus,
    checkout,
    response,
    transactions,
    getOne: params => dispatch(getOne(params)),
    getUserStatus: params => dispatch(getUserStatus(params)),
    set: params => dispatch(set(params)),
    setCheckout: params => dispatch(setCheckout(params)),
    save: params => dispatch(save(params)),
    manualCheckout: params => dispatch(manualCheckout(params)),
    clearUser: () => dispatch(clearUser()),
    isLoading
  }
}

export default function UserView ({ history, match }) {
  const [currentImage, setCurrentImage] = useState(0)
  const [viewerIsOpen, setViewerIsOpen] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [showModalSuccess, setShowModalSuccess] = useState(false)

  const openLightbox = useCallback((event, { photo, index }) => {
    setCurrentImage(index)
    setViewerIsOpen(true)
  }, [])

  const closeLightbox = () => {
    setCurrentImage(0)
    setViewerIsOpen(false)
  }

  const handleClose = () => {
    setShowModal(false)
    setShowModalSuccess(false)
  }

  const {
    user,
    userStatus,
    checkout,
    response,
    getOne,
    getUserStatus,
    save,
    manualCheckout,
    set,
    setCheckout,
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

  const submitCheckout = async () => {
    if (checkout.Event) {
      try {
        await manualCheckout({ checkout, qrCode: user.QrCode })
        setShowModal(false)
        setShowModalSuccess(true)
      } catch (err) {
        setShowModal(false)
        setShowModalSuccess(true)
      }
    } else {
      setShowModal(false)
    }
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
                <Tab>Checkout manual</Tab>
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
              <TabPanel>
                <Row>
                  <Col sm={12} md={12}>
                    <Form
                      values={checkout}
                      onChange={setCheckout}
                      onSubmit={submitCheckout}
                    >
                      {(connect, submit) => (
                        <form>
                          <Events {...connect('Event')} label='Nome do evento' placeholder='Informe o evento' required />
                        </form>
                      )}
                    </Form>
                  </Col>
                </Row>
                <div style={{ textAlign: 'right' }}>
                  <Button type='submit' onClick={() => setShowModal(true)}>Efetuar checkout</Button>
                </div>
              </TabPanel>
            </Tabs>
          </Card>
        </Col>
      </Row>
      <ModalBootstrap centered show={showModal} onHide={handleClose}>
        <ModalBootstrap.Header closeButton>
          <ModalBootstrap.Title>Efetuar checkout manual</ModalBootstrap.Title>
        </ModalBootstrap.Header>
        <ModalBootstrap.Body>
          <Form
            values={checkout}
            onChange={setCheckout}
            onSubmit={submitCheckout}
          >
            {(connect, submit) => (
              <form onSubmit={e => {
                e.preventDefault()
                submit()
              }}>
                <PasswordInput {...connect('UserPassword')} label='Informe sua senha de acesso ao portal' required />
                <div style={{ textAlign: 'right' }}>
                  <Button type='submit'>Confirmar</Button>
                </div>
              </form>
            )}
          </Form>
        </ModalBootstrap.Body>
      </ModalBootstrap>
      <ModalBootstrap centered show={showModalSuccess} onHide={handleClose}>
        <ModalBootstrap.Header closeButton>
          <ModalBootstrap.Title>Sucesso!</ModalBootstrap.Title>
        </ModalBootstrap.Header>
        <ModalBootstrap.Body>
          <img alt='logo' src={require('../../assets/success.png')} height='22' width='22' /> Checkout realizado com sucesso!
        </ModalBootstrap.Body>
        <ModalBootstrap.Footer>
          <Button variant='primary' onClick={handleClose}>
            Ok
          </Button>
        </ModalBootstrap.Footer>
      </ModalBootstrap>
    </Dashboard>
  )
}
