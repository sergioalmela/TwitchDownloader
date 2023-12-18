import { useEffect, useState } from 'preact/hooks'
import { detectContentType } from './downloader/detectContentType.ts'
import { getContentIdFromUrl } from './downloader/getContentId.ts'
import { getCredentials } from './downloader/auth/getCredentials.ts'
import { getManifest } from './downloader/getManifest.ts'
import { getPlaylist, Playlist } from './downloader/getPlaylist.ts'
import { invoke } from '@tauri-apps/api/tauri'
import { open } from '@tauri-apps/api/dialog'
import { listen } from '@tauri-apps/api/event'

const FormComponent = () => {
  const [showQualities, setShowQualities] = useState(false)
  const [url, setUrl] = useState('')
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [selectedPlaylistUrl, setSelectedPlaylistUrl] = useState('')
  const [folder, setFolder] = useState('')
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [fileName, setFileName] = useState('download.mp4')
  const [downloadCommand, setDownloadCommand] = useState<
    'download_vod' | 'download_clip' | 'download_stream'
  >('download_vod')

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const unlisten = listen('download-progress', (event) => {
      console.log(`Received event: ${event.payload}`)
      if (typeof event.payload === 'number') {
        console.log(`Download progress: ${event.payload}%`)
        setDownloadProgress(event.payload)
      }
    })

    return () => {
      unlisten.then((fn) => fn())
    }
  }, [])

  const handleUrlChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    setUrl(target.value)
    setError('')
  }

  const selectFolder = async () => {
    try {
      const selectedFolder = await open({
        directory: true,
        multiple: false
      })

      if (selectedFolder) {
        setFolder(
          Array.isArray(selectedFolder) ? selectedFolder[0] : selectedFolder
        )
      }
    } catch (error) {
      console.error('Error selecting folder:', error)
    }
  }

  const handleError = (error: string) => {
    setError(error)
    setIsLoading(false)
  }

  const handleGetQualities = async () => {
    setIsLoading(true)

    try {
      if (url === '') {
        handleError('URL is empty')
        return
      }

      const contentType = detectContentType(url)

      if (contentType === null) {
        handleError('Failed to detect content type')
        return
      }

      setDownloadCommand(
        contentType === 'clip'
          ? 'download_clip'
          : contentType === 'live'
          ? 'download_stream'
          : 'download_vod'
      )

      const id = getContentIdFromUrl(contentType, url)

      if (id === null) {
        handleError('Failed to get content id')
        return
      }

      const credentials = await getCredentials(contentType, id)

      const manifest = await getManifest(contentType, id, credentials)

      if (manifest) {
        const playlists = getPlaylist(manifest)

        if (playlists.length === 0) {
          handleError('Failed to get playlists')
          return
        }

        setPlaylists(playlists)
        setSelectedPlaylistUrl(playlists[0].url)
      } else {
        handleError('Failed to get video content')
        return
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        handleError(error.message)
      }
    }

    setIsLoading(false)
    setShowQualities(true)
  }

  const handleQualityChange = (event: Event) => {
    const target = event.target as HTMLSelectElement
    setSelectedPlaylistUrl(target.value)
  }

  const handleFileNameChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    setFileName(target.value)
  }

  const handleSubmit = async (event: Event) => {
    event.preventDefault()
    if (selectedPlaylistUrl && fileName) {
      try {
        const downloadData = {
          args: {
            m3u8_url: selectedPlaylistUrl,
            download_path: folder,
            file_name: fileName
          }
        }

        const result = await invoke(downloadCommand, downloadData)
        console.log(result)
      } catch (error) {
        console.log(error)
        if (error instanceof Error) {
          setError(error.message)
        } else if (typeof error === 'string') {
          setError(error)
        }
      }
    } else {
      setError('Please fill in all fields.')
    }
  }

  return (
    <div class="max-w-lg mx-auto p-4 w-4/5">
      <form onSubmit={handleSubmit} class="space-y-6">
        <div>
          <label
            htmlFor="twitchUrl"
            class="block text-sm font-medium text-gray-700"
          >
            Twitch URL:
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
            Select Folder
          </button>
          {folder && (
            <span class="text-sm text-gray-500 text-center">{folder}</span>
          )}
        </div>

        <div>
          <label
            htmlFor="fileName"
            class="block text-sm font-medium text-gray-700"
          >
            File Name:
          </label>
          <input
            type="text"
            id="fileName"
            name="fileName"
            value={fileName}
            onChange={handleFileNameChange}
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {error && <div className="error-message text-red-500">{error}</div>}

        <div>
          <button
            type="button"
            onClick={handleGetQualities}
            class="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Get Qualities
          </button>
        </div>

        {showQualities && playlists.length && (
          <>
            <div>
              <label
                htmlFor="selectQuality"
                class="block text-sm font-medium text-gray-700"
              >
                Select Quality:
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
              Download
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
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}

      <p>Download Progress: {downloadProgress}%</p>
    </div>
  )
}

export default FormComponent
