import React from 'react'
import { createInput } from 'react-nonconformist'
import MultiSelectInput from '@kenshooui/react-multi-select'
import _ from 'lodash'

class MultiSelect extends React.Component {
  state = {
    messages: {
      searchPlaceholder: 'Buscar cardápios...',
      noItemsMessage: 'Nenhum cardápio encontrado...',
      noneSelectedMessage: 'Nenhum cardápio selecionado',
      selectedMessage: 'cardápio(s) selecionado(s)',
      selectAllMessage: 'Selecionar todos',
      clearAllMessage: 'Limpar todos',
      disabledItemsTooltip: 'Você só pode selecionar somente um'
    },
    items: [],
    selectedItems: []
  }

  handleChange = (selectedItems, onChangeText) => {
    const items = selectedItems.map(item => {
      return item.id
    }, [])
    onChangeText(items)
    this.setState({ selectedItems: items })
  }

  render () {
    const { messages } = this.state
    const {
      items,
      selectedItems,
      onChangeText
    } = this.props

    let menus = []
    let selectedMenus = []

    if (items && items.length) {
      menus = items.map(item => {
        return {
          id: item._id,
          label: item.name
        }
      }, [])
    }

    if (selectedItems && selectedItems.length) {
      selectedMenus = selectedItems.map(uuid => {
        const menu = menus.find(menu => menu.id === uuid)
        return menu !== undefined ? menu : {}
      }, [])
    }

    return (
      <MultiSelectInput
        messages={messages}
        items={menus}
        selectedItems={selectedMenus}
        onChange={e => this.handleChange(e, onChangeText)}
      />
    )
  }
}

export default createInput({
  inputComponent: MultiSelect
})
