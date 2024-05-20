import ProgressBar from './ProgressBar.tsx'
import { useTranslation } from 'react-i18next'
import { useForm } from '../hooks/useForm.ts'

const Form = () => {
  const {
    showQualities,
    url,
    playlists,
    folder,
    downloadProgress,
    isDownloading,
    fileName,
    isLoading,
    error,
    downloadFolder,
    handleUrlChange,
    selectFolder,
    handleGetQualities,
    handleQualityChange,
    handleFileNameChange,
    handleSubmit,
    resetForm
  } = useForm()

  const { t } = useTranslation('translation')

  return (
    <div class="max-w-lg mx-auto p-4 w-4/5">
      <form onSubmit={handleSubmit} class="space-y-6">
        <div>
          <label
            htmlFor="twitchUrl"
            class="block text-sm font-medium text-gray-700"
          >
            {t('twitchUrl')}
          </label>
          <input
            type="url"
            id="twitchUrl"
            name="twitchUrl"
            value={url}
            onChange={handleUrlChange}
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="flex flex-col items-center space-y-2 w-full">
          <button
            onClick={selectFolder}
            type="button"
            className="py-2 px-4 w-full border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            {t('selectFolder')}
          </button>
          {folder ? (
            <span class="text-sm text-gray-500 text-center">{folder}</span>
          ) : downloadFolder ? (
            <span class="text-sm text-gray-500 text-center">
              {downloadFolder}
            </span>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="fileName"
            class="block text-sm font-medium text-gray-700"
          >
            {t('fileName')}:
          </label>
          <input
            type="text"
            id="fileName"
            name="fileName"
            value={fileName}
            onChange={handleFileNameChange}
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {error && (
          <div className="bg-red-500 text-white text-center p-3 rounded-md my-2 border border-red-700 shadow-lg">
            <strong>Error: </strong> {error}
          </div>
        )}

        <div>
          <button
            type="button"
            onClick={handleGetQualities}
            class="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {t('getQualities')}
          </button>
        </div>

        {showQualities && playlists.length > 0 && (
          <>
            <div>
              <label
                htmlFor="selectQuality"
                class="block text-sm font-medium text-gray-700"
              >
                {t('selectQuality')}
              </label>
              <select
                id="selectQuality"
                name="selectQuality"
                onChange={handleQualityChange}
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                {playlists.map((playlist) => (
                  <option value={playlist.url}>{playlist.video}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              class="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {t('download')}
            </button>
          </>
        )}
      </form>
      {isLoading && (
        <div className="flex justify-center mt-4">
          <div
            className="animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-blue-600 rounded-full dark:text-blue-500"
            role="status"
            aria-label="loading"
          >
            <span className="sr-only">{t('loading')}</span>
          </div>
        </div>
      )}

      {isDownloading && <ProgressBar progress={downloadProgress} />}

      {!isDownloading && downloadProgress === 100 && (
        <button
          type="button"
          onClick={resetForm}
          className="mt-4 py-2 px-4 w-full border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          {t('clear')}
        </button>
      )}
    </div>
  )
}

export default Form
