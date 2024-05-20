import { useEffect, useState } from 'preact/hooks'
import { invoke } from '@tauri-apps/api/tauri'
import { open } from '@tauri-apps/api/dialog'
import { listen } from '@tauri-apps/api/event'
import { open as openShell } from '@tauri-apps/api/shell'
import { detectContentType } from '../downloader/detectContentType.ts'
import { getContentIdFromUrl } from '../downloader/getContentId.ts'
import { getCredentials } from '../downloader/auth/getCredentials.ts'
import { getManifest } from '../downloader/getManifest.ts'
import { getPlaylist, Playlist } from '../downloader/getPlaylist.ts'
import {
  Config,
  DEFAULT_DOWNLOAD_COMMAND,
  DEFAULT_FILE_NAME,
  DOWNLOAD_COMMANDS
} from '../types.ts'

export const useForm = (config: Config | null) => {
  const [showQualities, setShowQualities] = useState(false)
  const [url, setUrl] = useState('')
  const [playlists, setPlaylists] = useState<Playlist[]>([])

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const [selectedPlaylistUrl, setSelectedPlaylistUrl] = useState('')
  const [folder, setFolder] = useState('')
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [isDownloading, setIsDownloading] = useState(false)
  const [fileName, setFileName] = useState(DEFAULT_FILE_NAME)
  const [downloadCommand, setDownloadCommand] = useState<DOWNLOAD_COMMANDS>(
    DEFAULT_DOWNLOAD_COMMAND
  )
  const [downloadFolder, setDownloadFolder] = useState(
    config ? config.download_folder : ''
  )

  useEffect(() => {
    if (config) {
      setDownloadFolder(config.download_folder)
    }
  }, [config])

  useEffect(() => {
    if (config && config.theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [config])

  const clearErrors = () => {
    setError('')
  }

  useEffect(() => {
    const progress = listen('download-progress', (event) => {
      console.log(`Received event: ${event.payload}`)
      if (typeof event.payload === 'number') {
        console.log(`Download progress: ${event.payload}%`)
        setDownloadProgress(event.payload)
        setIsDownloading(event.payload < 100)
      }
    })

    return () => {
      progress.then((fn) => fn())
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
        handleError('Content URL seems wrong')
        return
      }

      setDownloadCommand(
        contentType === 'clip'
          ? 'download_clip'
          : contentType === 'live'
            ? 'download_live'
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
    console.log('submitting')
    console.log(selectedPlaylistUrl, fileName)
    if (!selectedPlaylistUrl || !fileName.trim()) {
      setError('Please fill in all fields.')
      return
    }

    try {
      const downloadData = {
        args: {
          m3u8_url: selectedPlaylistUrl,
          download_path: folder || downloadFolder,
          file_name: fileName
        }
      }

      clearErrors()
      await invoke(downloadCommand, downloadData)

      if (config && config.open_on_download === 'open') {
        const filePath = `${downloadData.args.download_path}/${downloadData.args.file_name}`
        const dirPath = filePath.substring(0, filePath.lastIndexOf('/'))

        await openShell(dirPath)
      }
    } catch (error) {
      console.log(error)
      if (error instanceof Error) {
        setError(error.message)
      } else if (typeof error === 'string') {
        setError(error)
      }
    }
  }

  const resetForm = () => {
    setShowQualities(false)
    setUrl('')
    setPlaylists([])
    setSelectedPlaylistUrl('')
    setFolder('')
    setDownloadProgress(0)
    setIsDownloading(false)
    setFileName(DEFAULT_FILE_NAME)
    setDownloadCommand('download_vod')
    setIsLoading(false)
    setError('')
  }

  return {
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
  }
}
