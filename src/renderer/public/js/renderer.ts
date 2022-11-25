const form = document.querySelector('#img-form')
const folder = document.querySelector('#folder-container')
const folderName = document.querySelector<HTMLInputElement>('#folder-name')
const btnQualities = document.querySelector('#btn-qualities')
const qualities = document.querySelector('#qualities')
const downloadFinishedContainer = document.querySelector('#download-finished-container')
const qualitiesContainer = document.querySelector<HTMLInputElement>('#qualities-container')
const btnDownload = document.querySelector('#btn-download')
const url = 'https://www.twitch.tv/videos/839518098'
const downloadPath = '/home/torre/Descargas'

// Load image and show form
function loadImage () {
  ipcRenderer.send('dialog:folder')
}

function loadQualities () {
  ipcRenderer.send('qualities:get', { url, downloadPath })
}

function downloadContent () {
  ipcRenderer.send('download:start')
}

// When done, show message
ipcRenderer.on('folder:selected', function (folderPath) {
  folderName && (folderName.textContent = folderPath.toString())
  folderName && (folderName.style.display = 'block')
})

ipcRenderer.on('qualities:got', (feedOptions) => {
  const feedOptionsArray: any = feedOptions
  // Foreach quality, add a new select option inside qualities DOM variable
  feedOptionsArray.forEach(quality => {
    const option = document.createElement('option')
    option.value = quality.value.title
    option.innerText = quality.value.title
    qualities && (qualities.appendChild(option))
  })

  btnQualities && (btnQualities.classList.toggle("hidden"))
  qualitiesContainer && (qualitiesContainer.classList.toggle("hidden"))
  btnDownload && (btnDownload.classList.toggle("hidden"))
})

// File select listener
folder && folder.addEventListener('click', loadImage)
btnQualities && btnQualities.addEventListener('click', loadQualities)
btnDownload && btnDownload.addEventListener('click', downloadContent)
