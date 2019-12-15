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
  clearMenu,
  getOne,
  addProduct,
  removeProduct
} from './actions'

import Products, { Product } from './products'

import {
  get as getProducers
} from '../producers/actions'

import useMount from '../../helpers/useMount'

import Button from '../../components/button'

import InputText from '../../components/inputs/text'
import SwitchInput from '../../components/inputs/switch'

import Form from 'react-nonconformist'

import dot from 'dot-object'

function useStateAndDispatch () {
  const dispatch = useDispatch()
  const menu = useSelector(state => state.menus.menu)
  const response = useSelector(state => state.menus.response)
  const isLoading = useSelector(state => state.isLoading[save])

  return {
    menu,
    response,
    isLoading,
    save: params => dispatch(save(params)),
    set: params => dispatch(set(params)),
    clearMenu: () => dispatch(clearMenu()),
    getOne: params => dispatch(getOne(params)),
    getProducers: () => dispatch(getProducers()),
    addProduct: () => dispatch(addProduct()),
    removeProduct: params => dispatch(removeProduct(params))
  }
}

export default function MenuSave ({ history, match }) {
  const {
    menu,
    response,
    isLoading,
    save,
    set,
    getOne,
    getProducers,
    addProduct,
    removeProduct
  } = useStateAndDispatch()

  const screenType = match.path === '/events/:uuid/menus/:uuidMenu' ? 'edit' : 'view'

  useMount(() => {
    if (screenType === 'edit') {
      getOne({ uuidMenu: match.params.uuidMenu })
    } else {
      clearMenu()
    }
    getProducers()
  })

  const submit = async () => {
    await save({
      name: menu.name,
      isEnabled: menu.isEnabled,
      products: menu.products,
      menuId: match.params.uuidMenu,
      eventId: match.params.uuid
    })

    history.push('/events/' + match.params.uuid + '/menus')
  }

  const rmProduct = async ({ uuid, localId }) => {
    removeProduct({ uuid, localId })
  }

  return (
    <Dashboard
      title={screenType === 'edit' ? 'Editar Cardápio' : 'Novo Cardápio'}
      header={
        <ButtonToolbar className='justify-content-between'>
          <ButtonGroup>
            <Button variant='secondary' to={`/events/${match.params.uuid}/menus`}>←&nbsp;&nbsp;Voltar</Button>
          </ButtonGroup>
        </ButtonToolbar>
      }>
      <Alert variant='danger' show={response.status === 'error'}>
        {response.message}
      </Alert>
      <Form
        values={{ ...menu, ...dot.dot({ products: menu.products }) }}
        onSubmit={submit}
        onChange={set}
      >
        {(connect, submit) => (
          <form onSubmit={e => {
            e.preventDefault()
            submit()
          }}>
            <Card
              header={<h3 className='mb-0'>Cardápio</h3>}
              shadow
            >
              <Row>
                <Col sm={12} md={12}>
                  {screenType === 'edit' && <SwitchInput {...connect('isEnabled')} label='Status do cardápio' />}
                  <InputText {...connect('name')} label='Nome do cardápio' required />
                </Col>
              </Row>
            </Card>
            <Card
              header={<h3 className='mb-0'>Produtos</h3>}
              actions={(
                <Button
                  onClick={addProduct}
                  size='sm'
                  variant='default'
                  icon='fat-add'
                >Adicionar novo produto</Button>
              )}
              shadow
            >
              <Products>
                {Object.keys(menu.products).map(key => (
                  <Product
                    key={`product-${key}`}
                    localId={key}
                    connect={connect}
                    removeProduct={() => rmProduct({ uuid: menu.products[key]._id, localId: key })}
                  />
                ))}
              </Products>
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
