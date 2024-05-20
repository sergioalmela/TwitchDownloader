import { useContext } from 'preact/hooks'
import { ConfigContext, ConfigContextType } from '../ConfigContext.ts'
import { usePreferences } from '../hooks/usePreferences.ts'
import { DEFAULT_ACTIVE_TAB, DEFAULT_OPEN_ON_DOWNLOAD } from '../types.ts'

const Preferences = () => {
  const configContext: ConfigContextType | null = useContext(ConfigContext)
  const config = configContext?.config || null
  const setConfig = configContext?.setConfig || null

  const {
    activeTab,
    setActiveTab,
    downloadFolder,
    selectFolder,
    updatePreferences,
    handleLanguageChange,
    handleOpenOnDownloadChange,
    handleThemeChange,
    tabClass
  } = usePreferences(config, setConfig)

  return (
    <form>
      <div className="App bg-gray-100 min-h-screen p-4 flex flex-col items-center">
        <div className="bg-white shadow rounded-lg w-full max-w-4xl mb-4">
          <div className="flex">
            <div className="w-1/4 flex flex-col">
              <div
                className={tabClass(DEFAULT_ACTIVE_TAB)}
                onClick={() => setActiveTab(DEFAULT_ACTIVE_TAB)}
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
              {activeTab === DEFAULT_ACTIVE_TAB && (
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
                      <option value={DEFAULT_OPEN_ON_DOWNLOAD}>
                        Don't Open
                      </option>
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
