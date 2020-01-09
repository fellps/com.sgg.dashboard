import React, { useState } from 'react'

import Dashboard from '../dashboard'
import Filters from '../filters'
import toParams from '../filters/toParams'

import { useSelector, useDispatch } from 'react-redux'

import useMount from '../../helpers/useMount'

import { get, getXls } from './actions'

import Button from '../../components/button'
import Table from '../../components/table'

import qs from 'qs'

import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'

const columns = [
  {
    dataIndex: 'Nome',
    key: 'Nome',
    title: 'Nome'
  },
  {
    dataIndex: 'Evento',
    key: 'Evento',
    title: 'Evento'
  },
  {
    dataIndex: 'Email',
    key: 'Email',
    title: 'Email'
  },
  {
    dataIndex: 'Telefone',
    key: 'Telefone',
    title: 'Telefone'
  }
]

function useStateAndDispatch () {
  const dispatch = useDispatch()
  const whoWorked = useSelector(state => state.whoWorked.whoWorked)
  const file = useSelector(state => state.whoWorked.file)
  const isLoading = useSelector(state => state.isLoading[get])

  return {
    whoWorked,
    file,
    get: params => dispatch(get(params)),
    getXls: params => dispatch(getXls(params)),
    isLoading
  }
}

export default function WhoWorked ({ location, history }) {
  const { get, getXls, file, isLoading, whoWorked } = useStateAndDispatch()

  useMount(() => {
    get()
  })

  const filter = params => {
    get(toParams(params))
  }

  const _updatePagination = (pagination) => {
    const query = { ...qs.parse(location.search.replace('?', '')), _page: pagination }
    history.push({ search: qs.stringify(query) })
    get(toParams({ ...query }))
  }

  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
  const fileExtension = '.xlsx'

  const exportToCSV = (csvData, fileName) => {
    const ws = XLSX.utils.json_to_sheet(csvData, { header: ['Nome', 'Evento', 'Email', 'Telefone'] })
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const data = new Blob([excelBuffer], { type: fileType })
    FileSaver.saveAs(data, fileName + fileExtension)
  }

  return (
    <Dashboard
      title='Usuários'
    >
      <Filters
        isLoading={isLoading}
        history={history}
        onFilter={filter}
        filters={[
          { name: 'name', input: 'TextInput', label: 'Nome', placeholder: 'Nome do usuário' },
          { name: 'cpf', input: 'CPF', label: 'CPF', placeholder: 'CPF do usuário' }
        ]}
        title='Usuários'
        extras={<Button
          onClick={() => exportToCSV(whoWorked.data, 'relatorio-mensal')}
          size='sm'
          variant='success'
          style={{ float: 'right', marginTop: 20, marginBottom: 20 }}
        >Exportar planilha</Button>}
      >
        <Table
          columns={columns}
          data={whoWorked && whoWorked.data && whoWorked.data.length > 0 && whoWorked.data.map(d => ({
            ...d,
            actions: history
          }))}
          pagination={{
            currentPage: whoWorked.page,
            perPage: Number(whoWorked.pageSize),
            total: whoWorked.totalRecords
          }}
          onChange={(pagination) => _updatePagination(pagination)}
        />
      </Filters>
    </Dashboard>
  )
}
