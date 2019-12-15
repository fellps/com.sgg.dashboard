import React from 'react'
import reactCSS from 'reactcss'
import { SketchPicker } from 'react-color'
import { createInput } from 'react-nonconformist'

class Color extends React.Component {
  state = {
    displayColorPicker: false,
    color: {
      r: '36',
      g: '164',
      b: '109',
      a: '1'
    }
  }

  componentDidMount () {
    const { value } = this.props
    this.setState({ color: this.hexToRgb(value) })
  }

  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker })
  }

  handleClose = () => {
    this.setState({ displayColorPicker: false })
  }

  handleChange = (color, onChangeText) => {
    onChangeText(color.hex)
    this.setState({ color: color.rgb })
  }

  hexToRgb = (hex) => {
    hex = hex.replace('#', '')
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)

    const result = {
      r: r,
      g: g,
      b: b,
      a: 1
    }
    return result
  }

  render () {
    const { onChangeText } = this.props

    const styles = reactCSS({
      default: {
        color: {
          width: '34px',
          height: '36px',
          borderRadius: '2px',
          background: `rgba(${this.state.color.r}, ${this.state.color.g}, ${this.state.color.b}, ${this.state.color.a})`
        },
        swatch: {
          padding: '5px',
          background: '#fff',
          borderRadius: '1px',
          boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
          display: 'inline-block',
          cursor: 'pointer'
        },
        popover: {
          position: 'absolute',
          zIndex: '2'
        },
        cover: {
          position: 'fixed',
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px'
        }
      }
    })

    return (
      <React.Fragment>
        <div style={styles.swatch} onClick={this.handleClick}>
          <div style={styles.color} />
        </div>
        { this.state.displayColorPicker ? <div style={styles.popover}>
          <div style={styles.cover} onClick={this.handleClose} />
          <SketchPicker color={this.state.color} onChange={e => this.handleChange(e, onChangeText)} />
        </div> : null }
      </React.Fragment>
    )
  }
}

export default createInput({
  inputComponent: Color
})
