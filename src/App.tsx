import { useState } from 'preact/hooks'
import { invoke } from '@tauri-apps/api/tauri'
import './App.css'
import FormComponent from './FormComponent'

function App() {
  const [greetMsg, setGreetMsg] = useState('')

  async function download(m3u8: string) {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke('download', { m3u8 }))
  }

  return (
    <div class="container">
      <div class="row">
        <img src="/logo.png" class="logo vite" alt="Twitch Downloader Logo" />
      </div>

      <FormComponent />

      <p>{greetMsg}</p>
    </div>
  )
}

export default App
