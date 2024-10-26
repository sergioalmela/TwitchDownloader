import { useEffect, useState } from 'preact/hooks'
import { invoke } from '@tauri-apps/api/core'
import { Config } from './types.ts'

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
