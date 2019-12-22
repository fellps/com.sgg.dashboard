import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Table from 'react-table'
import selectTableHOC from 'react-table/lib/hoc/selectTable'

import 'react-table/react-table.css'

const SelectTable = selectTableHOC(Table)

class TableSelect extends Component {
  static defaultProps = {
    keyField: 'id'
  };

  static propTypes = {
    keyField: PropTypes.string
  };

  /**
   * Toggle a single checkbox for select table
   */
  toggleSelection = (key, shift, row, onSelect) => {
    // start off with the existing state
    let selection = [...this.state.selection]
    let rows = [...this.state.rows]
    const keyIndex = selection.indexOf(key)

    // check to see if the key exists
    if (keyIndex >= 0) {
      // it does exist so we will remove it using destructing
      selection = [
        ...selection.slice(0, keyIndex),
        ...selection.slice(keyIndex + 1)
      ]
      rows = [
        ...rows.slice(0, keyIndex),
        ...rows.slice(keyIndex + 1)
      ]
    } else {
      // it does not exist so add it
      selection.push(key)
      rows.push(row)
    }
    // update the state
    this.setState({ selection })
    this.setState({ rows })
    onSelect({ rows })
  };

  /**
   * Toggle all checkboxes for select table
   */
  toggleAll = (onSelect) => {
    const { keyField } = this.props
    const selectAll = !this.state.selectAll
    const selection = []
    const rows = []

    if (selectAll) {
      // we need to get at the internals of ReactTable
      const wrappedInstance = this.checkboxTable.getWrappedInstance()
      // the 'sortedData' property contains the currently accessible records based on the filter and sort
      const currentRecords = wrappedInstance.getResolvedState().sortedData
      // we just push all the IDs onto the selection array
      currentRecords.forEach(item => {
        rows.push({ ...item._original })
        selection.push(`select-${item._original[keyField]}`)
      })
    }
    this.setState({ selectAll, selection, rows })
    onSelect({ rows })
  };

  /**
   * Whether or not a row is selected for select table
   */
  isSelected = key => {
    return this.state.selection.includes(`select-${key}`)
  };

  rowFn = (state, rowInfo, column, instance) => {
    const { keyField } = this.props
    const { selection } = this.state

    return {
      onClick: (e, handleOriginal) => {
        console.log('It was in this row:', rowInfo)

        // IMPORTANT! React-Table uses onClick internally to trigger
        // events like expanding SubComponents and pivots.
        // By default a custom 'onClick' handler will override this functionality.
        // If you want to fire the original onClick handler, call the
        // 'handleOriginal' function.
        if (handleOriginal) {
          handleOriginal()
        }
      }
      // style: {
      //   background:
      //     rowInfo &&
      //     selection.includes(`select-${rowInfo.original[keyField]}`) &&
      //     'lightgreen'
      // }
    }
  };

  state = {
    selectAll: false,
    selection: [],
    rows: []
  };

  render () {
    const { onSelect } = this.props
    return (
      <SelectTable
        {...this.props}
        ref={r => (this.checkboxTable = r)}
        toggleSelection={(key, shift, row) => this.toggleSelection(key, shift, row, onSelect)}
        selectAll={this.state.selectAll}
        selectType='checkbox'
        toggleAll={(e) => this.toggleAll(onSelect)}
        isSelected={this.isSelected}
        getTrProps={this.rowFn}
        previousText='Voltar'
        nextText='Próximo'
        loadingText='Carregando..'
        noDataText='Sem dados para exibir'
        pageText='Página'
        ofText='de'
        rowsText='registros'
      />
    )
  }
}

export default TableSelect
