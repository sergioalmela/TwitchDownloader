import { useEffect, useState } from 'preact/hooks'
import { invoke } from '@tauri-apps/api/tauri'

type Config = {
  theme: string
  language: string
  download_folder: string
  open_on_download: string
}

type ThemeProviderProps = {
  children: preact.ComponentChildren
}

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [config, setConfig] = useState<Config | null>(null)

  useEffect(() => {
    const fetchConfig = async () => {
      const config = (await invoke('get_preferences')) as Config
      setConfig(config)
    }

    fetchConfig()
  }, [])

  useEffect(() => {
    if (config && config.theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [config])

  return <>{children}</>
}

export default ThemeProvider
