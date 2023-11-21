import { useState } from 'preact/hooks'
import { detectContentType } from './downloader/detectContentType.ts'
import { getContentIdFromUrl } from './downloader/getContentId.ts'
import { getCredentials } from './downloader/auth/getCredentials.ts'
import { getManifest } from './downloader/getManifest.ts'
import { getPlaylist } from './downloader/getPlaylist.ts'

const FormComponent = () => {
  const [showQualities, setShowQualities] = useState(false)
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleUrlChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    setUrl(target.value)
    setError('')
  }

  const handleGetQualities = async () => {
    setIsLoading(true)

    if (url === '') {
      setError('URL is required')
    }

    const contentType = detectContentType(url)

    if (contentType === null) {
      console.log('Content type not supported')
      return
    }

    const id = getContentIdFromUrl(contentType, url)

    if (id === null) {
      console.log('Failed to get content id')
      return
    }

    const credentials = await getCredentials(contentType, id)

    const manifest = await getManifest(contentType, id, credentials)

    if (manifest) {
      const playlist = getPlaylist(manifest)
      console.log(playlist[0].url)

      //await downloadContent(playlist[0].url)
    }

    setIsLoading(false)
    setShowQualities(true)
  }

  return (
    <div className="input-form">
      <form>
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
          <input
            type="file"
            id="fileUpload"
            name="fileUpload"
            style="display: none;"
            multiple
            required
          />

          <label htmlFor="fileUpload" className="folder-button">
            Select a folder to save
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="fileName">File Name:</label>
          <input type="text" id="fileName" name="fileName" required />
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <button type="button" onClick={handleGetQualities}>
            Get Qualities
          </button>
        </div>

        {showQualities && (
          <>
            <div className="form-group">
              <label htmlFor="selectQuality">Select Quality:</label>
              <select id="selectQuality" name="selectQuality">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
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
