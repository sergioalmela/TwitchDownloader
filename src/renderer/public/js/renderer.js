const form = document.querySelector('#img-form')
const folder = document.querySelector('#folder-container')
const folderName = document.querySelector('#folder-name')
const btnQualities = document.querySelector('#btn-qualities')
const qualities = document.querySelector('#qualities')
const url = 'https://www.twitch.tv/videos/839518098'
const path = '/home/torre/Descargas'

// Load image and show form
function loadImage () {
  ipcRenderer.send('dialog:folder')
}

function loadQualities () {
  ipcRenderer.send('qualities:get', {url, path})
}

// When done, show message
ipcRenderer.on('folder:selected', (folderPath) => {
  folderName.textContent = folderPath
  folderName.style.display = 'block'
})

ipcRenderer.on('qualities:got', (feedOptions) => {
  // Foreach quality, add a new select option inside qualities DOM variable
  feedOptions.forEach(quality => {
        const option = document.createElement('option')
        option.value = quality.value.title
        option.innerText = quality.value.title
        qualities.appendChild(option)
    })
})

// File select listener
folder.addEventListener('click', loadImage)
btnQualities.addEventListener('click', loadQualities)
