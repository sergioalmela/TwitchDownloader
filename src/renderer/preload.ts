const os = require('os')
const path = require('path')
const { contextBridge, ipcRenderer, dialog } = require('electron')

contextBridge.exposeInMainWorld('os', {
  homedir: () => os.homedir()
})

/*contextBridge.exposeInMainWorld('path', {
  join: (...args) => path.join(...args),
  showOpenDialog: () => dialog.showOpenDialog({ properties: ['openFile', 'multiSelections'] })
})*/

contextBridge.exposeInMainWorld('ipcRenderer', {
  send: (channel, data) => ipcRenderer.send(channel, data),
  on: (channel, func) =>
    ipcRenderer.on(channel, (event, ...args) => func(...args))
})


