import React from 'react'

import Dashboard from '../dashboard'

import { useSelector, useDispatch } from 'react-redux'

import useMount from '../../helpers/useMount'

import Filters from '../filters'
import toParams from '../filters/toParams'

import {
  ButtonToolbar,
  ButtonGroup
} from 'react-bootstrap'

import { get, clearMenu } from './actions'

import Button from '../../components/button'
import Table from '../../components/table'

function useStateAndDispatch () {
  const dispatch = useDispatch()
  const menus = useSelector(state => state.menus.menus)
  const isLoading = useSelector(state => state.isLoading[get])

  return {
    menus,
    isLoading,
    get: params => dispatch(get(params)),
    clearMenu: () => dispatch(clearMenu())
  }
}

export default function Events ({ history, match }) {
  const {
    get,
    menus,
    clearMenu,
    isLoading
  } = useStateAndDispatch()

  const columns = [
    { dataIndex: 'name', key: 'name', title: 'Nome' },
    { dataIndex: 'isEnabled', key: 'isEnabled', title: 'Status' },
    { dataIndex: 'totalProducts', key: 'totalProducts', title: 'Qt. Produtos' },
    {
      dataIndex: 'actions',
      key: 'actions',
      title: 'Ações',
      render: (history, { _id }) => (
        <React.Fragment>
          <Button
            to={`/events/${match.params.uuid}/menus/${_id}`}
            size='sm'
            variant='success'
          >Editar</Button>
        </React.Fragment>
      )
    }
  ]

  useMount(() => {
    get(toParams(match.params))
    clearMenu()
  })

  const filter = params => {
    get(toParams({ ...match.params, ...params }))
  }

  return (
    <Dashboard
      title='Cardápios'
      header={
        <ButtonToolbar className='justify-content-between'>
          <ButtonGroup>
            <Button variant='secondary' to={`/events`}>←&nbsp;&nbsp;Voltar</Button>
          </ButtonGroup>
          <div>
            <Button icon='fat-add' to={`/events/${match.params.uuid}/menus/create`}>
              Criar Novo
            </Button>
          </div>
        </ButtonToolbar>
      }
    >
      <Filters
        title='Cardápios'
        history={history}
        isLoading={isLoading}
        onFilter={filter}
        filters={[
          { name: 'name', input: 'TextInput', label: 'Nome do cardápio' }
        ]}
      >
        <Table
          columns={columns}
          data={menus && menus.data && menus.data.length > 0 && menus.data.map(d => ({
            ...d,
            actions: history
          }))}
          pagination={{
            currentPage: menus.data.current_page,
            perPage: Number(menus.data.per_page),
            total: menus.data.total
          }}
        />
      </Filters>
    </Dashboard>
  )
}
