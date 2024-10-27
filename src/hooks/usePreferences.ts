import { useContext, useEffect, useState } from 'preact/hooks'
import { open } from '@tauri-apps/plugin-dialog'
import { invoke } from '@tauri-apps/api/core'
import { ConfigContext } from '../ConfigContext.ts'
import {
  Config,
  DEFAULT_ACTIVE_TAB,
  DEFAULT_LANGUAGE,
  DEFAULT_OPEN_ON_DOWNLOAD,
  DEFAULT_THEME,
  SetConfig
} from '../types.ts'
import * as dialog from '@tauri-apps/plugin-dialog'
import * as process from '@tauri-apps/plugin-process'

export const useConfig = () => {
  const configContext = useContext(ConfigContext)
  const config = configContext?.config
  const setConfig = configContext?.setConfig
  return { config, setConfig }
}

export const usePreferences = (
  config: Config | null,
  setConfig: SetConfig | null
) => {
  const [activeTab, setActiveTab] = useState(DEFAULT_ACTIVE_TAB)
  const [language, setLanguage] = useState(
    config ? config.language : DEFAULT_LANGUAGE
  )
  const [openOnDownload, setOpenOnDownload] = useState(
    config ? config.open_on_download : DEFAULT_OPEN_ON_DOWNLOAD
  )
  const [theme, setTheme] = useState(config ? config.theme : DEFAULT_THEME)
  const [downloadFolder, setDownloadFolder] = useState(
    config ? config.download_folder : ''
  )

  useEffect(() => {
    if (config) {
      setLanguage(config.language)
      setOpenOnDownload(config.open_on_download)
      setTheme(config.theme)
      setDownloadFolder(config.download_folder)
    }
  }, [config])

  useEffect(() => {
    if (config && setConfig && downloadFolder !== config.download_folder) {
      setConfig({ ...config, download_folder: downloadFolder })
    }
  }, [downloadFolder])

  const selectFolder = async () => {
    try {
      const path = await open({
        directory: true,
        multiple: false
      })

      if (path) {
        const newDownloadFolder = Array.isArray(path) ? path[0] : path
        setDownloadFolder(newDownloadFolder)
      }
    } catch (error) {
      console.error('Error selecting folder:', error)
    }
  }

  const updatePreferences = async () => {
    const values = {
      language,
      download_folder: downloadFolder,
      open_on_download: openOnDownload,
      theme
    }

    try {
      await invoke('update_preferences', { data: values })
      const isOk = await dialog.ask(
        `Configuration saved successfully, do you want to restart?`,
        {
          title: 'Twitch Downloader Preferences'
        }
      )

      if (isOk) {
        await process.relaunch()
        return
      }
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  const handleLanguageChange = (event: Event) => {
    const newLanguage = (event.target as HTMLSelectElement).value
    setLanguage(newLanguage)
    if (config && setConfig) {
      setConfig({ ...config, language: newLanguage })
    }
  }

  const handleOpenOnDownloadChange = (event: Event) => {
    const newOpenOnDownload = (event.target as HTMLSelectElement).value
    setOpenOnDownload(newOpenOnDownload)
    if (config && setConfig) {
      setConfig({ ...config, open_on_download: newOpenOnDownload })
    }
  }

  const handleThemeChange = (event: Event) => {
    const newTheme = (event.target as HTMLSelectElement).value
    setTheme(newTheme)
    if (config && setConfig) {
      setConfig({ ...config, theme: newTheme })
    }
  }

  const tabClass = (tabName: string) =>
    `flex-1 cursor-pointer text-center p-4 ${
      activeTab === tabName
        ? 'bg-blue-500 text-white'
        : 'bg-gray-200 hover:bg-gray-300'
    }`

  return {
    activeTab,
    setActiveTab,
    downloadFolder,
    selectFolder,
    updatePreferences,
    handleLanguageChange,
    handleOpenOnDownloadChange,
    handleThemeChange,
    tabClass
  }
}
