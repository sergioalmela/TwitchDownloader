import { useEffect, useState } from 'preact/hooks'
import { open } from '@tauri-apps/api/dialog'
import { invoke, dialog, process } from '@tauri-apps/api'
import useInit from '../hooks/useInit.ts'

type Config = {
  theme: string
  language: string
  download_folder: string
  open_on_download: string
}

const Preferences = () => {
  const [config, setConfig] = useState<Config | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const [activeTab, setActiveTab] = useState('General')
  const [language, setLanguage] = useState(config ? config.language : 'en')
  const [openOnDownload, setOpenOnDownload] = useState(
    config ? config.open_on_download : 'dont-open'
  )
  const [theme, setTheme] = useState(config ? config.theme : 'light')
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
    if (config && downloadFolder !== config.download_folder) {
      setConfig({ ...config, download_folder: downloadFolder })
    }
  }, [downloadFolder])

  useInit(async () => {
    setConfig(await invoke('get_preferences'))
    setIsLoading(false)
  })

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
    if (config) {
      setConfig({ ...config, language: newLanguage })
    }
  }

  const handleOpenOnDownloadChange = (event: Event) => {
    const newOpenOnDownload = (event.target as HTMLSelectElement).value
    setOpenOnDownload(newOpenOnDownload)
    if (config) {
      setConfig({ ...config, open_on_download: newOpenOnDownload })
    }
  }

  const handleThemeChange = (event: Event) => {
    const newTheme = (event.target as HTMLSelectElement).value
    setTheme(newTheme)
    if (config) {
      setConfig({ ...config, theme: newTheme })
    }
  }

  const tabClass = (tabName: string) =>
    `flex-1 cursor-pointer text-center p-4 ${
      activeTab === tabName
        ? 'bg-blue-500 text-white'
        : 'bg-gray-200 hover:bg-gray-300'
    }`

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <form>
      <div className="App bg-gray-100 min-h-screen p-4 flex flex-col items-center">
        <div className="bg-white shadow rounded-lg w-full max-w-4xl mb-4">
          <div className="flex">
            <div className="w-1/4 flex flex-col">
              <div
                className={tabClass('General')}
                onClick={() => setActiveTab('General')}
              >
                General
              </div>
              <div
                className={tabClass('Downloads')}
                onClick={() => setActiveTab('Downloads')}
              >
                Downloads
              </div>
              <div
                className={tabClass('Appearance')}
                onClick={() => setActiveTab('Appearance')}
              >
                Appearance
              </div>
            </div>
            <div className="w-3/4 p-4 overflow-auto">
              {activeTab === 'General' && (
                <div>
                  <label htmlFor="language" className="block mb-2">
                    Language
                  </label>
                  <select
                    name="language"
                    id="language"
                    className="border p-2 rounded w-full"
                    value={config?.language}
                    onChange={handleLanguageChange}
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="it">Italian</option>
                    <option value="de">German</option>
                  </select>
                </div>
              )}
              {activeTab === 'Downloads' && (
                <div>
                  <div className="mb-4">
                    <label htmlFor="download-folder" className="block mb-2">
                      Default Download Folder
                    </label>
                    <button
                      type="button"
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      onClick={selectFolder}
                      name="download-folder"
                    >
                      Select Folder
                    </button>

                    {downloadFolder && (
                      <div className="mt-4">
                        Selected Folder:{' '}
                        <span className="font-semibold">{downloadFolder}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <label htmlFor="open-folder" className="block mb-2">
                      Open Folder on Download?
                    </label>
                    <select
                      id="open-folder"
                      className="border p-2 rounded w-full"
                      name="open-folder"
                      value={config?.open_on_download}
                      onChange={handleOpenOnDownloadChange}
                    >
                      <option value="dont-open">Don't Open</option>
                      <option value="open">Open</option>
                    </select>
                  </div>
                </div>
              )}
              {activeTab === 'Appearance' && (
                <div>
                  <label htmlFor="theme" className="block mb-2">
                    Theme
                  </label>
                  <select
                    name="theme"
                    id="theme"
                    className="border p-2 rounded w-full"
                    value={config?.theme}
                    onChange={handleThemeChange}
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="w-full max-w-4xl px-4 flex justify-end">
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            onClick={(event) => {
              event.preventDefault()
              updatePreferences()
            }}
          >
            Submit
          </button>
        </div>
      </div>
    </form>
  )
}

export default Preferences
