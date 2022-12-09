/* eslint-disable @typescript-eslint/no-var-requires */
const { contextBridge, ipcRenderer } = require('electron')
const Toastify = require('toastify-js')
const { i18n } = require('../../config/i18n.config')

contextBridge.exposeInMainWorld('ipcRenderer', {
  send: (channel, data) => ipcRenderer.send(channel, data),
  on: (channel, func) =>
    ipcRenderer.on(channel, (event, ...args) => func(...args))
})

contextBridge.exposeInMainWorld('Toastify', {
  toast: (options) => Toastify(options).showToast()
})

contextBridge.exposeInMainWorld('i18n', {
  __: (string) => i18n.__(string)
})
/* eslint-enable @typescript-eslint/no-var-requires */
