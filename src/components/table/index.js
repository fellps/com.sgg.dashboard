import React, { Component } from 'react'

// import { Table } from 'tabler-react'
// import Button from '../button'

// import Pagination from '../pagination'
// import Dimmer from '../dimmer'

import isEmpty from 'lodash/isEmpty'
import isObject from 'lodash/isObject'

import { Table } from 'react-bootstrap'

import Pagination from '../pagination'

import moment from 'moment'

const Dimmer = ({ children, active }) => (
  <div style={active ? { position: 'relative', minHeight: 200 } : {}}>
    {children}
    {active && (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'absolute', textAlign: 'center', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' }}>
        <i className='button is-text is-loading is-large'>Loading</i>
      </div>
    )}
  </div>
)

const RowChildren = ({ passedKey, rows, column }) => {
  return (
    <React.Fragment>
      {rows.map((row, i) => {
        const children = column.render(row[column.dataIndex], row)
        return (
          <tr style={{ opacity: 0.5 }} key={`${passedKey}-row-children-${row.key || i}`}>
            <td {...children.props}>
              {isObject(children) && children.children}
            </td>
          </tr>
        )
      })}
    </React.Fragment>
  )
}

const Row = ({ passedKey, toggle, visible, row, data, columns }) => {
  const columnsRenders = columns.map(column => ({
    parent: column.render ? column.render(row[column.dataIndex], row) : row[column.dataIndex],
    children: column.render && row.children && <RowChildren passedKey={passedKey} rows={row.children} column={column} />
  }))

  const children = columnsRenders.filter(d => d.children && isObject(d.children))
  const hasChildrenSomeColumn = children.length

  return (
    <React.Fragment>
      <tr>
        {columns.map((column, j) => {
          const key = row[column.key] ? row[column.key] : j
          let value = columnsRenders[j].parent

          if (Boolean(value) === value) {
            value = value ? 'Ativo' : 'Desativado'
          }

          return (
            <td key={`col-element-${passedKey}-${key}`}>
              {isObject(columnsRenders[j].children) && j === 0 && (
                {/* <Button
                  htmlType='button'
                  onClick={toggle}
                  icon={visible ? 'minus' : 'plus'}
                /> */}
              )}
              {value}
            </td>
          )
        })}
      </tr>
      {!!hasChildrenSomeColumn && visible && children[0].children}
    </React.Fragment>
  )
}

const NoData = ({ columns }) => {
  return (
    <tr>
      <td colSpan={columns.length}>
        <div style={{ paddingTop: 20, color: 'rgba(0,0,0,0.2)', textAlign: 'center' }}>
          Não há dados
        </div>
      </td>
    </tr>
  )
}

class Table2 extends Component {
  state = {}

  render () {
    const {
      columns = [],
      data = [],
      pagination,
      onChange,
      loading,
      className
    } = this.props
    return (
      <Dimmer active={loading} loader>
        <Table responsive className={className}>
          <thead>
            <tr>
              {isEmpty(columns) && <NoData data={columns} />}
              {columns.map((d, i) => (
                <th key={`col-header-${i}`}>{d.title}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data && data.map((d, i) => {
              const key = `table-row-${d.key || i}`
              const r = (this.state.rows) ? this.state.rows : []
              const isVisible = (r[d.key] ? r[d.key].visible : false)
              return (<Row
                visible={isVisible}
                toggle={() => {
                  r[d.key] = { visible: !isVisible }
                  return this.setState({ rows: r })
                }}
                key={key} passedKey={key} row={d} data={data} columns={columns} />)
            })}
          </tbody>
        </Table>
        {pagination && (
          <Pagination
            activePage={pagination.currentPage}
            itemsCountPerPage={pagination.perPage}
            totalItemsCount={pagination.total}
            onChange={onChange}
          />
        )}
      </Dimmer>
    )
  }
}

export default Table2
