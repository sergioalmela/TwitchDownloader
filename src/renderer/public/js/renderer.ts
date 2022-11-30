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
const btnResetFields = document.querySelector('#reset-fields')
const btnOpenFileFolder = document.querySelector('#open-file-folder-button')
const urlInput = document.querySelector<HTMLInputElement>('#url')
let selectedFeed
let loadedFeeds
let completeFolderPath

// Load folder dialog and show form
function loadFolderDialog (): void {
  ipcRenderer.send('dialog:folder')
}

function loadQualities (): void {
  ipcRenderer.send('qualities:get', { url: (urlInput != null) && urlInput.value })
  ;(btnQualities != null) && (btnQualities.disabled = true)
  ;(qualitiesLoadingContainer != null) && (qualitiesLoadingContainer.classList.toggle('hidden'))
}

function changeQuality (): void {
  selectedFeed = loadedFeeds[this.value].value
}

function downloadContent (): void {
  ipcRenderer.send('download:start', { downloadPath: (folderNameInput != null) && folderNameInput.value, file: (fileNameInput != null) && fileNameInput.value, feed: selectedFeed })
  ;(btnDownload != null) && (btnDownload.disabled = true)
  ;(downloadProgress != null) && (downloadProgress.classList.toggle('hidden'))
  ;(downloadLoadingContainer != null) && (downloadLoadingContainer.classList.toggle('hidden'))
}

function resetFields (): void {
  ;(urlInput != null) && (urlInput.value = '')
  ;(folderName != null) && (folderName.textContent = '')
  ;(folderNameInput != null) && (folderNameInput.value = '')
  ;(fileNameInput != null) && (fileNameInput.value = '')
  ;(qualitiesContainer != null) && (qualitiesContainer.classList.toggle('hidden'))
  ;(btnQualities != null) && (btnQualities.disabled = false)
  ;(btnQualities != null) && (btnQualities.classList.toggle('hidden'))
  ;(qualitiesSelect != null) && (removeOptions(qualitiesSelect))
  ;(downloadProgress != null) && (downloadProgress.classList.toggle('hidden'))
  ;(btnDownload != null) && (btnDownload.classList.toggle('hidden'))
  ;(downloadFinishedButtons != null) && (downloadFinishedButtons.classList.toggle('hidden'))
}

function openFileFolder (): void {
  ipcRenderer.send('folder:open', { completeFolderPath })
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

// Select folder and show into input

ipcRenderer.on('folder:selected', (folderPath) => {
  ;(folderName != null) && (folderName.textContent = folderPath.toString()) // eslint-disable-line @typescript-eslint/no-base-to-string
  ;(folderNameInput != null) && (folderNameInput.value = folderPath.toString()) // eslint-disable-line @typescript-eslint/no-base-to-string
  ;(folderName != null) && (folderName.style.display = 'block')
})

// Once qualities are loaded, show them into select
ipcRenderer.on('qualities:got', (feeds, feedOptions) => {
  ;(btnQualities != null) && (btnQualities.disabled = false)

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

  ;(qualitiesLoadingContainer != null) && (qualitiesLoadingContainer.classList.toggle('hidden'))
  ;(btnQualities != null) && (btnQualities.classList.toggle('hidden'))
  ;(qualitiesContainer != null) && (qualitiesContainer.classList.toggle('hidden'))
  ;(btnDownload != null) && (btnDownload.classList.toggle('hidden'))
})

// If qualities loading fails, show error message
ipcRenderer.on('qualities:error', (message) => {
  alertError(message)
  ;(btnQualities != null) && (btnQualities.disabled = false)
  ;(qualitiesLoadingContainer != null) && (qualitiesLoadingContainer.classList.toggle('hidden'))
})

// When download finishes, show download progress
ipcRenderer.on('download:finished', (folderPathWithFile) => {
  (downloadLoadingContainer != null) && (downloadLoadingContainer.classList.toggle('hidden'))
  ;(btnDownload != null) && (btnDownload.disabled = false)
  ;(downloadProgress != null) && (downloadProgress.textContent = 'Download finished')
  ;(downloadFinishedButtons != null) && (downloadFinishedButtons.classList.toggle('hidden'))
  completeFolderPath = folderPathWithFile
})

// If download fails, throw error
ipcRenderer.on('download:error', (message) => {
  alertError(message)
  ;(btnDownload != null) && (btnDownload.disabled = false)
  ;(downloadLoadingContainer != null) && (downloadLoadingContainer.classList.toggle('hidden'))
  ;(downloadProgress != null) && (downloadProgress.classList.toggle('hidden'))
})

// Listeners
;(folderContainer != null) && folderContainer.addEventListener('click', loadFolderDialog)
;(btnQualities != null) && btnQualities.addEventListener('click', loadQualities)
;(btnDownload != null) && btnDownload.addEventListener('click', downloadContent)
;(qualitiesSelect != null) && qualitiesSelect.addEventListener('change', changeQuality)
;(btnResetFields != null) && btnResetFields.addEventListener('click', resetFields)
;(btnOpenFileFolder != null) && btnOpenFileFolder.addEventListener('click', openFileFolder)
/* eslint-enable @typescript-eslint/prefer-optional-chain */
