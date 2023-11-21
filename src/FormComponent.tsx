import { useState } from 'preact/hooks'
import { detectContentType } from './downloader/detectContentType.ts'
import { getContentIdFromUrl } from './downloader/getContentId.ts'
import { getCredentials } from './downloader/auth/getCredentials.ts'
import { getManifest } from './downloader/getManifest.ts'
import { getPlaylist, Playlist } from './downloader/getPlaylist.ts'
import { invoke } from '@tauri-apps/api/tauri'
import { open } from '@tauri-apps/api/dialog'

const FormComponent = () => {
  const [showQualities, setShowQualities] = useState(false)
  const [url, setUrl] = useState('')
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [selectedPlaylistUrl, setSelectedPlaylistUrl] = useState('')
  const [folder, setFolder] = useState('')

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

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

  const handleGetQualities = async () => {
    setIsLoading(true)

    try {
      if (url === '') {
        setError('URL is required')
        return
      }

      const contentType = detectContentType(url)

      if (contentType === null) {
        setError('Content type not supported')
        return
      }

      const id = getContentIdFromUrl(contentType, url)

      if (id === null) {
        setError('Failed to get content id')
        return
      }

      const credentials = await getCredentials(contentType, id)

      const manifest = await getManifest(contentType, id, credentials)

      if (manifest) {
        const playlists = getPlaylist(manifest)

        if (playlists.length === 0) {
          setError('Failed to get playlists')
          return
        }

        setPlaylists(playlists)
        setSelectedPlaylistUrl(playlists[0].url)
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message)
      }
    }

    setIsLoading(false)
    setShowQualities(true)
  }

  const handleSelectChange = (event: Event) => {
    const target = event.target as HTMLSelectElement
    setSelectedPlaylistUrl(target.value)
  }

  const handleSubmit = async (event: Event) => {
    event.preventDefault()
    if (selectedPlaylistUrl) {
      try {
        const m3u8 = selectedPlaylistUrl
        const result = await invoke('download', { m3u8 })
        console.log(result)
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message)
        }
      }
    }
  }

  return (
    <div className="input-form">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="twitchUrl">Twitch URL:</label>
          <input
            type="url"
            id="twitchUrl"
            name="twitchUrl"
            value={url}
            onChange={handleUrlChange}
          />
        </div>

        <div className="form-group">
          <button onClick={selectFolder}>Select Folder</button>

          <label>{folder}</label>
        </div>

        <div className="form-group">
          <label htmlFor="fileName">File Name:</label>
          <input
            type="text"
            id="fileName"
            name="fileName"
            value="download.mp4"
            required
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <button type="button" onClick={handleGetQualities}>
            Get Qualities
          </button>
        </div>

        {showQualities && playlists.length && (
          <>
            <div className="form-group">
              <label htmlFor="selectQuality">Select Quality:</label>
              <select
                id="selectQuality"
                name="selectQuality"
                onChange={handleSelectChange}
              >
                {playlists.map((playlist) => (
                  <option value={playlist.url}>{playlist.video}</option>
                ))}
              </select>
            </div>

            <button type="submit">Download</button>
          </>
        )}
      </form>
      {isLoading && (
        <div className="spinner-container">
          <div id="loader" />
        </div>
      )}
    </div>
  )
}

export default FormComponent
