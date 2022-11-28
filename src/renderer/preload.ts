const { contextBridge, ipcRenderer } = require('electron')
const Toastify = require('toastify-js')

contextBridge.exposeInMainWorld('ipcRenderer', {
  send: (channel, data) => ipcRenderer.send(channel, data),
  on: (channel, func) =>
    ipcRenderer.on(channel, (event, ...args) => func(...args))
})

contextBridge.exposeInMainWorld('Toastify', {
  toast: (options) => Toastify(options).showToast()
})
