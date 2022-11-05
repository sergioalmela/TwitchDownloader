const electron = require('electron')

let controllers = null

// Electron apps have two processes: a main process (node) runs first and starts
// a renderer process (essentially a Chrome window). We're in the renderer process,
// and this IPC channel receives from and sends messages to the main process
const ipcRenderer = electron.ipcRenderer

controllers = {
  vod: () => {
    const vodController = require('../main/controllers/vod.controller')
    return new vodController()
  }
}

setupIpc()

const dispatchHandlers = {
  getVod: (id) => controllers.vod().getVod(id)
}

function dispatch (action) {
  // Log dispatch calls, for debugging, but don't spam
  if (!['mediaMouseMoved', 'mediaTimeUpdate', 'update'].includes(action)) {
    console.log('dispatch: %s', action)
  }

  const handler = dispatchHandlers[action]
  if (handler) {
    const result = handler()
    console.log(`Result of ${action}: ${result}`)
  } else {
    console.error('Missing dispatch handler: ' + action)
  }

  // Update the virtual DOM, unless it's just a mouse move event
  /* if (action !== 'mediaMouseMoved' ||
        controllers.playback().showOrHidePlayerControls()) {
      update()
    } */
}

// Listen to events from the main and webtorrent processes
function setupIpc () {
  ipcRenderer.on('log', (e, ...args) => console.log(...args))
  ipcRenderer.on('error', (e, ...args) => console.error(...args))

  ipcRenderer.on('dispatch', (e, ...args) => dispatch(e))

  ipcRenderer.on('fullscreenChanged', () => console.log(1))
  ipcRenderer.on('windowBoundsChanged', () => console.log(2))

  ipcRenderer.send('ipcReady')

  // State.on('stateSaved', () => ipcRenderer.send('stateSaved'))
}

dispatch('getVod')
