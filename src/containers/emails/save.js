import React from 'react'

import Dashboard from '../dashboard'

import Card from '../../components/card'
import Button from '../../components/button'
import Alert from '../../components/alert'

import Form from 'react-nonconformist'

import InputWysiwyg from '../../components/inputs/wysiwyg'
import TextInput from '../../components/inputs/text'

import {
  Row,
  Col,
  ButtonToolbar,
  ButtonGroup
} from 'react-bootstrap'

import useMount from '../../helpers/useMount'

import { useDispatch, useSelector } from 'react-redux'

import { getOne, clearEmail, set, save } from './actions'

function useStateAndDispatch () {
  const dispatch = useDispatch()
  const email = useSelector(state => state.emails.email)
  const emailStatus = useSelector(state => state.emails.emailStatus)
  const response = useSelector(state => state.emails.response)
  const transactions = useSelector(state => state.emails.transactions)
  const isLoading = useSelector(state => state.isLoading[getOne])

  return {
    email,
    emailStatus,
    response,
    transactions,
    getOne: params => dispatch(getOne(params)),
    set: params => dispatch(set(params)),
    save: params => dispatch(save(params)),
    clearEmail: () => dispatch(clearEmail()),
    isLoading
  }
}

export default function EmailView ({ history, match }) {
  const {
    email,
    response,
    getOne,
    save,
    set,
    clearEmail,
    isLoading
  } = useStateAndDispatch()

  useMount(() => {
    getOne({ IdEmail: match.params.idEmail })
    return clearEmail
  })

  const submit = async () => {
    await save(email)
    history.push('/emails')
  }

  return (
    <Dashboard
      title='Ver Email'
      header={
        <ButtonToolbar className='justify-content-between'>
          <ButtonGroup>
            <Button variant='secondary' to={`/emails`}>←&nbsp;&nbsp;Voltar</Button>
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
            header={<h3 className='mb-0'>Email</h3>}
            shadow
          >
            <Alert variant='danger' show={response.status === 'error'}>
              {response.message}
              <pre>
                {JSON.stringify(response, null, 2)}
              </pre>
            </Alert>
            <Form
              values={email}
              onChange={set}
              onSubmit={submit}
            >
              {(connect, submit) => (
                <form onSubmit={e => {
                  e.preventDefault()
                  submit()
                }}>
                  <TextInput {...connect('Name')} label='Tipo do email' required />
                  <InputWysiwyg {...connect('Content')} label='Conteúdo do email' placeholder='Conteúdo do email' required />
                  <b>Tags: </b>
                  <p>%primeiro_nome%, %nome_completo% %telefone%, %cpf%, %data_aniversario%</p>
                  <hr />
                  <div style={{ textAlign: 'right' }}>
                    <Button type='submit'>Salvar</Button>
                  </div>
                </form>
              )}
            </Form>
          </Card>
        </Col>
      </Row>
    </Dashboard>
  )
}
