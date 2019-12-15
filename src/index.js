import React from 'react'
import { hydrate, render } from 'react-dom'

import { Provider } from 'react-redux'

import * as serviceWorker from './serviceWorker'

import 'bootstrap'

// START IMPORT STYLES FROM THEME
import './theme/assets/js/plugins/nucleo/css/nucleo.css'
import './theme/assets/js/plugins/@fortawesome/fontawesome-free/css/all.min.css'
import './theme/assets/scss/argon-dashboard.scss'
import './style/input.css'
import './style/card.css'
import './style/nav.css'
import './style/custom.css'
import './style/ticket.scss'
import '@kenshooui/react-multi-select/dist/style.css'
import 'rc-slider/assets/index.css'
// END IMPORT STYLES FROM THEME

import store from './state/store'

import Routes from './routes'

const rootElement = document.getElementById('root')

const App = () => (
  <Provider store={store}>
    <Routes />
  </Provider>
)

if (rootElement.hasChildNodes()) {
  hydrate(<App />, rootElement)
} else {
  render(<App />, rootElement)
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
