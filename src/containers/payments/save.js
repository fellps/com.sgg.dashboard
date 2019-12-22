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

import { getOne, clearPayment, set, save } from './actions'

function useStateAndDispatch () {
  const dispatch = useDispatch()
  const payment = useSelector(state => state.payments.payment)
  const paymentStatus = useSelector(state => state.payments.paymentStatus)
  const response = useSelector(state => state.payments.response)
  const transactions = useSelector(state => state.payments.transactions)
  const isLoading = useSelector(state => state.isLoading[getOne])

  return {
    payment,
    paymentStatus,
    response,
    transactions,
    getOne: params => dispatch(getOne(params)),
    set: params => dispatch(set(params)),
    save: params => dispatch(save(params)),
    clearPayment: () => dispatch(clearPayment()),
    isLoading
  }
}

export default function PaymentView ({ history, match }) {
  const {
    payment,
    response,
    getOne,
    save,
    set,
    clearPayment,
    isLoading
  } = useStateAndDispatch()

  useMount(() => {
    getOne({ IdPayment: match.params.idPayment })
    return clearPayment
  })

  const submit = async () => {
    await save(payment)
    history.push('/payments')
  }

  return (
    <Dashboard
      title='Ver Payment'
      header={
        <ButtonToolbar className='justify-content-between'>
          <ButtonGroup>
            <Button variant='secondary' to={`/payments`}>←&nbsp;&nbsp;Voltar</Button>
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
            header={<h3 className='mb-0'>Payment</h3>}
            shadow
          >
            <Alert variant='danger' show={response.status === 'error'}>
              {response.message}
              <pre>
                {JSON.stringify(response, null, 2)}
              </pre>
            </Alert>
            <Form
              values={payment}
              onChange={set}
              onSubmit={submit}
            >
              {(connect, submit) => (
                <form onSubmit={e => {
                  e.preventDefault()
                  submit()
                }}>
                  <TextInput {...connect('Name')} label='Tipo do payment' required />
                  <InputWysiwyg {...connect('Content')} label='Conteúdo do payment' placeholder='Conteúdo do payment' required />
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
