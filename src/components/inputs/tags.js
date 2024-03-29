import React from 'react'
import ReactTags from 'react-tag-autocomplete'
import { createInput } from 'react-nonconformist'

import { get } from '../../api/tags'

class TagsComponent extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      tags: [],
      suggestions: [
        { id: 1, name: 'Elite' },
        { id: 2, name: 'Comunicativo' },
        { id: 3, name: 'Gente boa' },
        { id: 4, name: 'Esforçado' },
        { id: 5, name: 'Educado' },
        { id: 6, name: 'Bonito(a)' },
        { id: 7, name: 'Chato' }
      ]
    }

    this.handleDelete = this.handleDelete.bind(this)
    this.handleAddition = this.handleAddition.bind(this)
  }

  handleDelete (i, onChangeText) {
    const tags = this.state.tags.slice(0)
    tags.splice(i, 1)
    onChangeText(tags)
    this.setState({ tags })
  }

  handleAddition (tag, onChangeText) {
    const tags = [].concat(this.state.tags, tag)
    onChangeText(tags)
    this.setState({ tags })
  }

  loadOptions = async () => {
    const { data } = await get()
    const suggestions = data.data.map(item => ({ id: item.IdTag, name: item.Name }))
    this.setState({ suggestions })
  }

  componentWillReceiveProps ({ value }) {
    this.setState({ tags: value || [] })
    this.loadOptions()
  }

  render () {
    const { onChangeText, label } = this.props

    return (
      <div className='has-label form-group'>
        <label className='form-label'>{label}</label>
        <ReactTags
          tags={this.state.tags}
          suggestions={this.state.suggestions}
          handleDelete={(i) => this.handleDelete(i, onChangeText)}
          handleAddition={(tag) => this.handleAddition(tag, onChangeText)}
          minQueryLength={1}
          placeholder={'Adicionar nova tag'} />
      </div>
    )
  }
}

export default createInput({
  inputComponent: TagsComponent
})
