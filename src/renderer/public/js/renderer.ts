const form = document.querySelector('#img-form')
const folder = document.querySelector('#folder-container')
const folderName = document.querySelector<HTMLInputElement>('#folder-name')
const btnQualities = document.querySelector('#btn-qualities')
const qualities = document.querySelector('#qualities')
const qualitiesContainer = document.querySelector<HTMLInputElement>('#qualities-container')
const qualitiesLoadingContainer = document.querySelector('#qualities-loading-container')
const btnDownload = document.querySelector('#btn-download')
const downloadLoadingContainer = document.querySelector('#download-loading-container')
const downloadProgress = document.querySelector('#download-progress')
const downloadAnother = document.querySelector('#download-another')
const url = 'https://www.twitch.tv/videos/839518098'
const downloadPath = '/home/torre/Descargas/'
const file = 'test.mp4'
const feed = {
  video: '160p30',
  quality: { width: 160, height: 120 },
  url: 'https://d2nvs31859zcd8.cloudfront.net/497098a0678fbd887f14_twitch_40976239230_1608141314/160p30/index-dvr.m3u8',
  framerate: 30,
  bandwidth: 205123,
  codecs: 'avc1.4d401f,mp4a.40.2'
}

// Load image and show form
function loadImage () {
  ipcRenderer.send('dialog:folder')
}

function loadQualities () {
  ipcRenderer.send('qualities:get', { url, downloadPath })
  qualitiesLoadingContainer && (qualitiesLoadingContainer.classList.toggle("hidden"))
}

function downloadContent () {
  ipcRenderer.send('download:start', { downloadPath, file, feed })
  downloadProgress && (downloadProgress.classList.toggle("hidden"))
  downloadLoadingContainer && (downloadLoadingContainer.classList.toggle("hidden"))
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

  qualitiesLoadingContainer && (qualitiesLoadingContainer.classList.toggle("hidden"))
  btnQualities && (btnQualities.classList.toggle("hidden"))
  qualitiesContainer && (qualitiesContainer.classList.toggle("hidden"))
  btnDownload && (btnDownload.classList.toggle("hidden"))
})

ipcRenderer.on('qualities:error', (message) => {
  alertError(message)
  qualitiesLoadingContainer && (qualitiesLoadingContainer.classList.toggle("hidden"))
})

ipcRenderer.on('download:finished', () => {
  // Set text of downloadProgress to "Download finished"
  downloadLoadingContainer && (downloadLoadingContainer.classList.toggle("hidden"))
  downloadProgress && (downloadProgress.textContent = 'Download finished')
  downloadAnother && (downloadAnother.classList.toggle("hidden"))
})

function alertError(message) {
  Toastify.toast({
    text: message,
    duration: 5000,
    close: false,
    style: {
      background: 'red',
      color: 'white',
      textAlign: 'center',
    },
  });
}

// File select listener
folder && folder.addEventListener('click', loadImage)
btnQualities && btnQualities.addEventListener('click', loadQualities)
btnDownload && btnDownload.addEventListener('click', downloadContent)
