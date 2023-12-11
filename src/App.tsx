import { useState, useEffect } from 'preact/hooks'
import { invoke } from '@tauri-apps/api/tauri'
import FormComponent from './FormComponent'

function App() {
  const [greetMsg, setGreetMsg] = useState('')

  async function download(m3u8: string) {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke('download', { m3u8 }))
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div>
        <img
          src="/logo.png"
          className="h-[10em] p-[1.5em] transition-[0.75s] will-change-filter"
          alt="Twitch Downloader Logo"
        />
      </div>

      <FormComponent />

      <p class="text-center">{greetMsg}</p>
    </div>
  )
}

export default App
