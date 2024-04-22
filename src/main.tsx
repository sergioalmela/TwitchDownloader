import { render } from 'preact'
import App from './App'
import Preferences from './components/Preferences'
import './App.css'

const urlParams = new URLSearchParams(window.location.search)
const type = urlParams.get('type')

const Component = type === 'preferences' ? Preferences : App

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error("Couldn't find root element")
}

render(<Component />, rootElement)
