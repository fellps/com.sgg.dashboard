import React from 'react'

import Dashboard from '../dashboard'

import Card from '../../components/card'
import Button from '../../components/button'
import Alert from '../../components/alert'

import Form from 'react-nonconformist'

import TextInput from '../../components/inputs/text'

import {
  Row,
  Col,
  ButtonToolbar,
  ButtonGroup
} from 'react-bootstrap'

import useMount from '../../helpers/useMount'

import { useDispatch, useSelector } from 'react-redux'

import { getOne, clearTag, set, save } from './actions'

function useStateAndDispatch () {
  const dispatch = useDispatch()
  const tag = useSelector(state => state.tags.tag)
  const response = useSelector(state => state.tags.response)
  const transactions = useSelector(state => state.tags.transactions)
  const isLoading = useSelector(state => state.isLoading[save])

  return {
    tag,
    response,
    transactions,
    getOne: params => dispatch(getOne(params)),
    set: params => dispatch(set(params)),
    save: params => dispatch(save(params)),
    clearTag: () => dispatch(clearTag()),
    isLoading
  }
}

export default function TagView ({ history, match }) {
  const {
    tag,
    response,
    getOne,
    save,
    set,
    clearTag,
    isLoading
  } = useStateAndDispatch()

  useMount(() => {
    getOne({ IdTag: match.params.idTag })
    return clearTag
  })

  const submit = async () => {
    await save(tag)
    history.push('/tags')
  }

  return (
    <Dashboard
      title='Ver Tag'
      header={
        <ButtonToolbar className='justify-content-between'>
          <ButtonGroup>
            <Button variant='secondary' to={`/tags`}>←&nbsp;&nbsp;Voltar</Button>
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
            header={<h3 className='mb-0'>Tag</h3>}
            shadow
          >
            <Alert variant='danger' show={response.status === 'error'}>
              {response.message}
              <pre>
                {JSON.stringify(response, null, 2)}
              </pre>
            </Alert>
            <Form
              values={tag}
              onChange={set}
              onSubmit={submit}
            >
              {(connect, submit) => (
                <form onSubmit={e => {
                  e.preventDefault()
                  submit()
                }}>
                  <TextInput {...connect('Name')} label='Nome da tag' required />
                  <div style={{ textAlign: 'right' }}>
                    <Button
                      type='submit'
                      isLoading={isLoading}
                    >Salvar</Button>
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
