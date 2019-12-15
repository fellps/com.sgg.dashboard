import React from 'react'

import Card from '../../components/card'
import Button from '../../components/button'

import { Row, Col } from 'react-bootstrap'

import { set, clearFilter } from './actions'

import { useSelector, useDispatch } from 'react-redux'

import qs from 'qs'

import * as listFilters from './filters'

import useMount from '../../helpers/useMount'

import Form from 'react-nonconformist'

import reduce from 'lodash/reduce'
import isEmpty from 'lodash/isEmpty'

function useStateAndDispatch () {
  const dispatch = useDispatch()
  const filters = useSelector(state => state.filters)

  return {
    filters,
    set: params => dispatch(set(params)),
    clearFilter: params => dispatch(clearFilter(params))
  }
}

export default function Filter ({
  title,
  filters = [],
  onFilter,
  isLoading,
  history,
  children
}) {
  const { filters: values, set, clearFilter } = useStateAndDispatch()

  useMount(() => {
    const { search } = window.location

    if (search) {
      const parsed = qs.parse(search, { ignoreQueryPrefix: true })
      if (isEmpty(parsed) === false) set(parsed)
    }

    clearFilter()
  })

  const onSubmit = () => {
    const { pathname } = window.location

    const val = reduce(values, (acc, value, key) => {
      if (value) return { ...acc, [key]: value }
      return acc
    }, {})

    if (onFilter) onFilter(val)

    if (history) {
      history.push({
        pathname,
        search: qs.stringify(val)
      })
    }
  }

  return (
    <React.Fragment>
      <Card
        header={<h3 className='mb-0'>Filtro</h3>}
        shadow
      >
        <Form
          values={values}
          onChange={set}
          onSubmit={onSubmit}
        >
          {(connect, submit) => (
            <form onSubmit={e => {
              e.preventDefault()
              submit()
            }}>
              <Row>
                {filters.map(({ name, input, ...restFilter }) => (
                  <Col md={name === 'CashierCPF' ? 12 : 6} key={`filter-${name}`}>
                    {React.createElement(listFilters[input || name], {
                      ...restFilter,
                      ...connect(name)
                    })}
                  </Col>
                ))}
              </Row>
              <div style={{ textAlign: 'right' }}>
                <Button
                  type='submit'
                  variant='outline-primary'
                  disabled={isLoading}
                  isLoading={isLoading}
                >Filtrar</Button>
              </div>
            </form>
          )}
        </Form>
      </Card>
      {children && (
        <Card
          isLoading={isLoading}
          header={title && <h3 className='mb-0'>{title}</h3>}
          noBody
          shadow
        >
          {children}
        </Card>
      )}
    </React.Fragment>
  )
}
