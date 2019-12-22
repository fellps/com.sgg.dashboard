import React, { useState } from 'react'

import Dashboard from '../dashboard'
import Filters from '../filters'
import toParams from '../filters/toParams'

import { useSelector, useDispatch } from 'react-redux'
import { Modal, ButtonToolbar } from 'react-bootstrap'
import Form from 'react-nonconformist'

import useMount from '../../helpers/useMount'

import { get, set, save, clearTag } from './actions'

import Button from '../../components/button'
import Table from '../../components/table'
import TextInput from '../../components/inputs/text'

const columns = [
  {
    dataIndex: 'Name',
    key: 'Name',
    title: 'Tipo'
  },
  {
    dataIndex: 'actions',
    key: 'actions',
    title: 'Ações',
    render: (history, { IdTag }) => (
      <React.Fragment>
        <Button
          to={`/tags/${IdTag}`}
          size='sm'
          variant='success'
        >Editar</Button>
      </React.Fragment>
    )
  }
]

function useStateAndDispatch () {
  const dispatch = useDispatch()
  const tags = useSelector(state => state.tags.tags)
  const tag = useSelector(state => state.tags.tag)
  const isLoading = useSelector(state => state.isLoading[get])

  return {
    tags,
    tag,
    set: params => dispatch(set(params)),
    get: params => dispatch(get(params)),
    clearTag: () => dispatch(clearTag()),
    isLoading
  }
}

export default function Tags ({ history }) {
  const { get, set, isLoading, tags, tag, clearTag } = useStateAndDispatch()
  const [showModal, setShowModal] = useState(false)

  useMount(() => {
    get()
  })

  const filter = params => {
    get(toParams(params))
  }

  const submit = async () => {
    await save(tag)
    clearTag()
    get()
    setShowModal(false)
  }

  const handleClose = () => setShowModal(false)

  return (
    <Dashboard
      title='Tags'
      header={
        <ButtonToolbar
          className='justify-content-end'
        >
          <Button icon='fat-add' onClick={() => setShowModal(true)}>
            Criar Tag
          </Button>
        </ButtonToolbar>
      }
    >
      <Filters
        isLoading={isLoading}
        history={history}
        onFilter={filter}
        filters={[
          { name: 'name', input: 'TextInput', label: 'Tag', placeholder: 'Nome da tag' }
        ]}
        title='Tags'
      >
        <Table
          columns={columns}
          data={tags && tags.data && tags.data.length > 0 && tags.data.map(d => ({
            ...d,
            actions: history
          }))}
          pagination={{
            currentPage: tags.data.current_page,
            perPage: Number(tags.data.per_page),
            total: tags.data.total
          }}
        />
      </Filters>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Nova Tag</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
                <TextInput {...connect('Name')} label='Informe o valor da tag' required />
                <div style={{ textAlign: 'right' }}>
                  <Button type='submit'>Salvar</Button>
                </div>
              </form>
            )}
          </Form>
        </Modal.Body>
      </Modal>
    </Dashboard>
  )
}
