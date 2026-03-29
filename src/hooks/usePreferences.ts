import { invoke } from '@tauri-apps/api/core'
import { open } from '@tauri-apps/plugin-dialog'
import { useContext, useEffect, useState } from 'preact/hooks'
import { ConfigContext } from '../ConfigContext.ts'
import {
  type Config,
  DEFAULT_ACTIVE_TAB,
  DEFAULT_LANGUAGE,
  DEFAULT_OPEN_ON_DOWNLOAD,
  DEFAULT_THEME,
  type SetConfig,
} from '../types.ts'

export const useConfig = () => {
  const configContext = useContext(ConfigContext)
  const config = configContext?.config
  const setConfig = configContext?.setConfig
  return { config, setConfig }
}

export const usePreferences = (
  config: Config | null,
  setConfig: SetConfig | null,
) => {
  const [activeTab, setActiveTab] = useState(DEFAULT_ACTIVE_TAB)
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [language, setLanguage] = useState(
    config ? config.language : DEFAULT_LANGUAGE,
  )
  const [openOnDownload, setOpenOnDownload] = useState(
    config ? config.open_on_download : DEFAULT_OPEN_ON_DOWNLOAD,
  )
  const [theme, setTheme] = useState(config ? config.theme : DEFAULT_THEME)
  const [downloadFolder, setDownloadFolder] = useState(
    config ? config.download_folder : '',
  )

  useEffect(() => {
    if (config) {
      setLanguage(config.language)
      setOpenOnDownload(config.open_on_download)
      setTheme(config.theme)
      setDownloadFolder(config.download_folder)
    }
  }, [config])

  // biome-ignore lint/correctness/useExhaustiveDependencies: only trigger on folder change
  useEffect(() => {
    if (config && setConfig && downloadFolder !== config.download_folder) {
      setConfig({ ...config, download_folder: downloadFolder })
    }
  }, [downloadFolder])

  const selectFolder = async () => {
    try {
      const path = await open({
        directory: true,
        multiple: false,
      })

      if (path) {
        const newDownloadFolder = Array.isArray(path) ? path[0] : path
        setDownloadFolder(newDownloadFolder)
      }
    } catch (error) {
      console.error('Error selecting folder:', error)
    }
  }

  const closePreferences = async () => {
    const { getCurrentWindow } = await import('@tauri-apps/api/window')
    await getCurrentWindow().close()
  }

  const updatePreferences = async () => {
    setIsSaving(true)
    setSaved(false)
    const languageChanged = config && language !== config.language

    const values = {
      language,
      download_folder: downloadFolder,
      open_on_download: openOnDownload,
      theme,
    }

    try {
      await invoke('update_preferences', { data: values })

      if (languageChanged) {
        await invoke('rebuild_menu', { language })
      }

      // Notify main window to refresh config
      const { emit } = await import('@tauri-apps/api/event')
      await emit('preferences-updated')

      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSaving(false)
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
        : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-200'
    }`

  return {
    activeTab,
    setActiveTab,
    downloadFolder,
    isSaving,
    saved,
    selectFolder,
    updatePreferences,
    closePreferences,
    handleLanguageChange,
    handleOpenOnDownloadChange,
    handleThemeChange,
    tabClass,
  }
}
