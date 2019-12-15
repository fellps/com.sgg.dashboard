import React from 'react'
import Slider from 'rc-slider'
import { createInput } from 'react-nonconformist'

const createSliderWithTooltip = Slider.createSliderWithTooltip
const Range = createSliderWithTooltip(Slider.Range)

class SliderComponent extends React.Component {
  state = {
    range: []
  }

  handleChange = (range, onChangeText) => {
    onChangeText(range)
    this.setState({ range })
  }

  render () {
    const { onChangeText, label, value } = this.props
    const defaultValue = value[0] !== void (0) ? value : [18, 100]

    return (
      <React.Fragment>
        <label className='form-label'>{label}</label>
        <Range
          min={18}
          max={100}
          defaultValue={defaultValue}
          tipFormatter={value => `${value} anos`}
          onAfterChange={e => this.handleChange(e, onChangeText)}
          style={{ paddingTop: 15, marginLeft: 5 }}
        />
      </React.Fragment>
    )
  }
}

export default createInput({
  inputComponent: SliderComponent
})
