import { render } from 'preact'
import App from './components/App.tsx'
import Preferences from './components/Preferences'
import './App.css'
import { ConfigProvider } from './ConfigProvider'

const urlParams = new URLSearchParams(window.location.search)
const type = urlParams.get('type')

const Component = type === 'preferences' ? Preferences : App

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error("Couldn't find root element")
}

render(
  <ConfigProvider>
    <Component />
  </ConfigProvider>,
  rootElement
)
