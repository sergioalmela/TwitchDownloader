/* eslint-disable @typescript-eslint/prefer-optional-chain */
const folderContainer = document.querySelector('#folder-container')
const folderName = document.querySelector<HTMLInputElement>('#folder-name')
const folderNameInput = document.querySelector<HTMLInputElement>('#folder-name-input')
const fileNameInput = document.querySelector<HTMLInputElement>('#file-name-input')
const btnQualities = document.querySelector<HTMLButtonElement>('#btn-qualities')
const qualitiesSelect = document.querySelector('#qualities-select')
const qualitiesContainer = document.querySelector<HTMLInputElement>('#qualities-container')
const qualitiesLoadingContainer = document.querySelector('#qualities-loading-container')
const btnDownload = document.querySelector<HTMLButtonElement>('#btn-download')
const downloadLoadingContainer = document.querySelector('#download-loading-container')
const downloadFinishedButtons = document.querySelector('#download-finished-buttons')
const downloadProgress = document.querySelector('#download-progress')
const downloadFinished = document.getElementById('download-finished')
const btnResetFields = document.querySelector('#reset-fields')
const btnOpenFileFolder = document.querySelector('#open-file-folder-button')
const urlInput = document.querySelector<HTMLInputElement>('#url')
const liveNotStartedCheckbox = document.querySelector<HTMLInputElement>('#live-not-started')
let selectedFeed
let loadedFeeds
let completeFolderPath

const preferences = ipcRenderer.sendSync('getPreferences')

// Add default folder to input
try {
  const defaultDownloadFolder = preferences?.downloader?.defaultDownloadFolder
  ;(folderName != null) && (folderName.textContent = defaultDownloadFolder.toString())
  ;(folderNameInput != null) && (folderNameInput.value = defaultDownloadFolder.toString())
} catch (error) {
  console.log(error)
}

// Add CSS if dark mode is enabled
try {
  const darkMode = Boolean(preferences?.ui?.darkMode)
  if (darkMode) {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'css/dark.css'
    document.head.appendChild(link)
  }
} catch (error) {
  console.log(error)
}

// Load folder dialog and show form
function loadFolderDialog (): void {
  ipcRenderer.send('dialog:folder')
}

function loadQualities (): void {
  ipcRenderer.send('qualities:get', { url: (urlInput != null) && urlInput.value })
  ;(btnQualities != null) && (btnQualities.disabled = true)
  ;(qualitiesLoadingContainer != null) && (qualitiesLoadingContainer.classList.remove('hidden'))
}

function changeQuality (): void {
  selectedFeed = loadedFeeds[this.value].value
}

function downloadContent (): void {
  const isLive = (liveNotStartedCheckbox != null) && (liveNotStartedCheckbox.checked)

  if (isLive) {
    ipcRenderer.send('downloadNotStartedLive:start', {
      downloadPath: (folderNameInput != null) && folderNameInput.value,
      file: (fileNameInput != null) && fileNameInput.value,
      feed: selectedFeed,
      url: (urlInput != null) && urlInput.value
    })
  } else {
    ipcRenderer.send('download:start', {
      downloadPath: (folderNameInput != null) && folderNameInput.value,
      file: (fileNameInput != null) && fileNameInput.value,
      feed: selectedFeed
    })
  }

  ;(btnDownload != null) && (btnDownload.disabled = true)
  ;(downloadProgress != null) && (downloadProgress.classList.remove('hidden'))
  ;(downloadLoadingContainer != null) && (downloadLoadingContainer.classList.remove('hidden'))
}

function resetFields (): void {
  ;(urlInput != null) && (urlInput.value = '')
  // Consider set default download folder instead of empty
  ;(folderName != null) && (folderName.textContent = '')
  ;(folderNameInput != null) && (folderNameInput.value = '')
  ;(fileNameInput != null) && (fileNameInput.value = '')
  ;(qualitiesContainer != null) && (qualitiesContainer.classList.add('hidden'))
  ;(btnQualities != null) && (btnQualities.disabled = false)
  ;(btnQualities != null) && (btnQualities.classList.remove('hidden'))
  ;(qualitiesSelect != null) && (removeOptions(qualitiesSelect))
  ;(btnDownload != null) && (btnDownload.classList.add('hidden'))
  ;(downloadFinishedButtons != null) && (downloadFinishedButtons.classList.add('hidden'))
  ;(downloadFinished != null) && (downloadFinished.classList.add('hidden'))
  ;(liveNotStartedCheckbox != null) && (liveNotStartedCheckbox.checked = false)
}

function openFileFolder (): void {
  ipcRenderer.send('folder:open', { completeFolderPath })
}

// Change download button depending on content type
function changeContentType (): void {
  const isLive = (liveNotStartedCheckbox != null) && (liveNotStartedCheckbox.checked)
  isLive && (urlInput != null && /\.tv\/[\w]*/i.test(urlInput.value)) ? changeLayoutLiveUrl() : changeLayoutVodUrl()
}

function changeLayoutLiveUrl (): void {
  ;(qualitiesLoadingContainer != null) && (qualitiesLoadingContainer.classList.add('hidden'))
  ;(btnQualities != null) && (btnQualities.classList.add('hidden'))
  ;(qualitiesLoadingContainer != null) && (qualitiesLoadingContainer.classList.add('hidden'))
  ;(btnDownload != null) && (btnDownload.classList.remove('hidden'))
  ;(qualitiesContainer != null) && (qualitiesContainer.classList.add('hidden'))
}

function changeLayoutVodUrl (): void {
  ;(qualitiesLoadingContainer != null) && (qualitiesLoadingContainer.classList.remove('hidden'))
  ;(btnQualities != null) && (btnQualities.classList.remove('hidden'))
  ;(qualitiesLoadingContainer != null) && (qualitiesLoadingContainer.classList.add('hidden'))
  ;(btnDownload != null) && (btnDownload.classList.add('hidden'))
  ;(qualitiesContainer != null) && (qualitiesContainer.classList.add('hidden'))
}

function alertError (message): void {
  Toastify.toast({
    text: message,
    duration: 5000,
    close: false,
    style: {
      background: 'red',
      color: 'white',
      textAlign: 'center'
    }
  })
}

// Remove select options to clear form
function removeOptions (selectElement): void {
  let i; const L = selectElement.options.length - 1
  for (i = L; i >= 0; i--) {
    selectElement.remove(i)
  }
}

// Set feed options into select
function setFeedOptions (feeds, feedOptions): void {
  // Set global variable to use it later
  loadedFeeds = feeds

  // Foreach quality, add a new select option inside qualities DOM variable
  feedOptions.forEach((quality, index) => {
    const option = document.createElement('option')
    option.value = index
    option.innerText = quality.value.title
    ;(qualitiesSelect != null) && (qualitiesSelect.appendChild(option))
  })

  selectedFeed = feeds[0].value
}

// Select folder and show into input
ipcRenderer.on('folder:selected', (folderPath) => {
  ;(folderName != null) && (folderName.textContent = folderPath.toString()) // eslint-disable-line @typescript-eslint/no-base-to-string
  ;(folderNameInput != null) && (folderNameInput.value = folderPath.toString()) // eslint-disable-line @typescript-eslint/no-base-to-string
})

// Once qualities are loaded, show them into select
ipcRenderer.on('qualities:got', (feeds, feedOptions) => {
  ;(btnQualities != null) && (btnQualities.disabled = false)

  setFeedOptions(feeds, feedOptions)

  ;(qualitiesLoadingContainer != null) && (qualitiesLoadingContainer.classList.add('hidden'))
  ;(btnQualities != null) && (btnQualities.classList.add('hidden'))
  ;(qualitiesContainer != null) && (qualitiesContainer.classList.remove('hidden'))
  ;(btnDownload != null) && (btnDownload.classList.remove('hidden'))
})

// If qualities loading fails, show error message
ipcRenderer.on('qualities:error', (message) => {
  alertError(message)
  ;(btnQualities != null) && (btnQualities.disabled = false)
  ;(qualitiesLoadingContainer != null) && (qualitiesLoadingContainer.classList.add('hidden'))
})

// When download finishes, show download progress
ipcRenderer.on('download:finished', (folderPathWithFile) => {
  (downloadLoadingContainer != null) && (downloadLoadingContainer.classList.add('hidden'))
  ;(btnDownload != null) && (btnDownload.disabled = false)
  ;(downloadFinishedButtons != null) && (downloadFinishedButtons.classList.remove('hidden'))
  ;(downloadProgress != null && downloadProgress.classList.add('hidden'))
  ;(downloadFinished != null) && downloadFinished.classList.remove('hidden')
  completeFolderPath = folderPathWithFile
})

// If download fails, throw error
ipcRenderer.on('download:error', (message) => {
  alertError(message)
  ;(btnDownload != null) && (btnDownload.disabled = false)
  ;(downloadLoadingContainer != null) && (downloadLoadingContainer.classList.add('hidden'))
  ;(downloadProgress != null) && (downloadProgress.classList.add('hidden'))
})

// Listeners
;(folderContainer != null) && folderContainer.addEventListener('click', loadFolderDialog)
;(btnQualities != null) && btnQualities.addEventListener('click', loadQualities)
;(btnDownload != null) && btnDownload.addEventListener('click', downloadContent)
;(qualitiesSelect != null) && qualitiesSelect.addEventListener('change', changeQuality)
;(btnResetFields != null) && btnResetFields.addEventListener('click', resetFields)
;(btnOpenFileFolder != null) && btnOpenFileFolder.addEventListener('click', openFileFolder)
;(liveNotStartedCheckbox != null) && liveNotStartedCheckbox.addEventListener('change', changeContentType)
/* eslint-enable @typescript-eslint/prefer-optional-chain */
