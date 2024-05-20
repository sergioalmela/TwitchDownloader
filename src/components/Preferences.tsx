import { useContext } from 'preact/hooks'
import { ConfigContext, ConfigContextType } from '../ConfigContext.ts'
import { usePreferences } from '../hooks/usePreferences.ts'
import { DEFAULT_ACTIVE_TAB, DEFAULT_OPEN_ON_DOWNLOAD } from '../types.ts'
import { useTranslation } from 'react-i18next'

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

  const { t } = useTranslation('translation')

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
                {t('General')}
              </div>
              <div
                className={tabClass('Downloads')}
                onClick={() => setActiveTab('Downloads')}
              >
                {t('downloads')}
              </div>
              <div
                className={tabClass('Appearance')}
                onClick={() => setActiveTab('Appearance')}
              >
                {t('appearance')}
              </div>
            </div>
            <div className="w-3/4 p-4 overflow-auto">
              {activeTab === DEFAULT_ACTIVE_TAB && (
                <div>
                  <label htmlFor="language" className="block mb-2">
                    {t('language')}
                  </label>
                  <select
                    name="language"
                    id="language"
                    className="border p-2 rounded w-full"
                    value={config?.language}
                    onChange={handleLanguageChange}
                  >
                    <option value="en">{t('languages.en')}</option>
                    <option value="es">{t('languages.es')}</option>
                    <option value="fr">{t('languages.fr')}</option>
                    <option value="it">{t('languages.it')}</option>
                    <option value="de">{t('languages.de')}</option>
                  </select>
                </div>
              )}
              {activeTab === 'Downloads' && (
                <div>
                  <div className="mb-4">
                    <label htmlFor="download-folder" className="block mb-2">
                      {t('downloadFolder')}
                    </label>
                    <button
                      type="button"
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      onClick={selectFolder}
                      name="download-folder"
                    >
                      {t('selectFolder')}
                    </button>

                    {downloadFolder && (
                      <div className="mt-4">
                        {t('selectedFolder')}
                        <span className="font-semibold">{downloadFolder}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <label htmlFor="open-folder" className="block mb-2">
                      {t('openFolderOnDownload')}
                    </label>
                    <select
                      id="open-folder"
                      className="border p-2 rounded w-full"
                      name="open-folder"
                      value={config?.open_on_download}
                      onChange={handleOpenOnDownloadChange}
                    >
                      <option value={DEFAULT_OPEN_ON_DOWNLOAD}>
                        {t('dontOpen')}
                      </option>
                      <option value="open">{t('open')}</option>
                    </select>
                  </div>
                </div>
              )}
              {activeTab === 'Appearance' && (
                <div>
                  <label htmlFor="theme" className="block mb-2">
                    {t('theme')}
                  </label>
                  <select
                    name="theme"
                    id="theme"
                    className="border p-2 rounded w-full"
                    value={config?.theme}
                    onChange={handleThemeChange}
                  >
                    <option value="light">{t('light')}</option>
                    <option value="dark"> {t('dark')}</option>
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
            {t('save')}
          </button>
        </div>
      </div>
    </form>
  )
}

export default Preferences
