import 'reflect-metadata'

import path from 'path'
import { app, BrowserWindow, dialog, ipcMain, Menu, shell } from 'electron'
import preferences from '../../config/user.preferences'

import container from '../main/container'
import { ContainerSymbols } from '../main/symbols'
import { FeedController } from '../main/infrastructure/controllers/feed.controller'
import { UrlVo } from '../main/domain/valueObjects/url.vo'
import { PlaylistVo } from '../main/domain/valueObjects/playlist.vo'
import { FeedVo } from '../main/domain/valueObjects/feed.vo'
import { PathVo } from '../main/domain/valueObjects/path.vo'
import { DownloadController } from '../main/infrastructure/controllers/download.controller'
import { FileVo } from '../main/domain/valueObjects/file.vo'
import { FileController } from '../main/infrastructure/controllers/file.controller'
import { ContentTypes } from '../main/domain/constants/contentTypes.enum'

import { i18n } from '../../config/i18n.config'

i18n.configure({
  directory: 'locales',
  defaultLocale: preferences.value('global.language')
})

const feedsController = container.get<FeedController>(
  ContainerSymbols.FeedController
)

const downloadController = container.get<DownloadController>(
  ContainerSymbols.DownloadController
)

const fileController = container.get<FileController>(
  ContainerSymbols.FileController
)

const isDev = process.env.NODE_ENV === 'dev'
const isMac = process.platform === 'darwin'

let mainWindow
let aboutWindow

if (require('electron-squirrel-startup') === true) {
  app.quit()
}

// Main Window
function createMainWindow (): void {
  mainWindow = new BrowserWindow({
    width: isDev ? 1060 : 530,
    height: 750,
    icon: path.join(__dirname, '../../../logo.png'),
    resizable: isDev,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // Show devtools automatically if in development
  if (isDev) {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.loadFile(path.join(__dirname, '../../../src/renderer/public/index.html'))
}

// About Window
function createAboutWindow (): void {
  aboutWindow = new BrowserWindow({
    width: 300,
    height: 300,
    title: 'About Twitch Downloader',
    icon: path.join(__dirname, '../../../logo.png')
  })

  aboutWindow.loadFile(path.join(__dirname, '../../../src/renderer/public/about.html'))
}

// Handle change locale
function handleChangeLocale (locale: string): void {
  // setLocale(locale)
  preferences.value('global.language', locale)

  const options = {
    type: 'info',
    buttons: ['Cancel', 'Restart'],
    defaultId: 2,
    title: 'Restart required',
    message: 'You should restart the app to apply the changes'
  }

  // Restart the app if the user press Restart button
  dialog.showMessageBox(mainWindow, options).then((result) => {
    if (result.response === 1) {
      app.relaunch()
      app.exit()
    }
  }).catch((error) => {
    console.error(error)
  })
}

// When the app is ready, create the window
app.on('ready', () => {
  createMainWindow()

  const mainMenu = Menu.buildFromTemplate(menu)
  Menu.setApplicationMenu(mainMenu)
  // Remove variable from memory
  mainWindow.on('closed', () => (mainWindow = null))
})

// Menu template
/* eslint-disable @typescript-eslint/no-misused-promises */
const menu: Electron.MenuItemConstructorOptions[] = [{
  label: i18n.__('Edit'),
  submenu: [
    { role: 'undo', label: i18n.__('Undo') },
    { role: 'redo', label: i18n.__('Redo') },
    { type: 'separator' },
    { role: 'cut', label: i18n.__('Cut') },
    { role: 'copy', label: i18n.__('Copy') },
    { role: 'paste', label: i18n.__('Paste') },
    { role: 'delete', label: i18n.__('Delete') },
    { role: 'selectAll', label: i18n.__('Select All') }
  ]
},
{
  label: i18n.__('View'),
  submenu: [
    { role: 'reload', label: i18n.__('Reload') },
    { role: 'forceReload', label: i18n.__('Force Reload') },
    { role: 'toggleDevTools', label: i18n.__('Toggle DevTools') },
    { type: 'separator', label: i18n.__('Separator') },
    { role: 'resetZoom', label: i18n.__('Reset Zoom') },
    { role: 'zoomIn', label: i18n.__('Zoom In') },
    { role: 'zoomOut', label: i18n.__('Zoom Out') },
    { type: 'separator', label: i18n.__('Separator') },
    { role: 'togglefullscreen', label: i18n.__('Toggle Full Screen') }
  ]
},
{
  label: i18n.__('Window'),
  role: 'window',
  submenu: [
    { role: 'minimize', label: i18n.__('Minimize') },
    { role: 'close', label: i18n.__('Close') }
  ]
},
{
  label: i18n.__('Language'),
  submenu: [
    { label: i18n.__('English'), click: () => handleChangeLocale('en') },
    { label: i18n.__('Spanish'), click: () => handleChangeLocale('es') }
  ]
},
{
  label: i18n.__('Settings'),
  submenu: [
    { label: i18n.__('Preferences'), click: () => preferences.show() }
  ]
},
{
  label: i18n.__('Help'),
  role: 'help',
  submenu: [
    {
      label: i18n.__('About'),
      click: createAboutWindow
    },
    {
      label: 'GitHub',
      click: async () => {
        await shell.openExternal('https://github.com/sergioalmela/TwitchDownloader')
      }
    },
    {
      label: i18n.__('Donate'),
      click: async () => {
        await shell.openExternal('https://www.paypal.me/SteamPlaytime')
      }
    }
  ]
}
]
/* eslint-enable @typescript-eslint/no-misused-promises */

// Respond to the resize image event
ipcMain.on('dialog:folder', () => {
  dialog.showOpenDialog(mainWindow, { properties: ['openDirectory'] }).then(result => {
    if (!result.canceled) {
      mainWindow.webContents.send('folder:selected', result.filePaths[0])
    }
  }).catch(err => {
    console.log(err)
  })
})

// Open file folder
ipcMain.on('folder:open', (event, { completeFolderPath }) => {
  try {
    // Windows escape backslashes if any
    const folderPath = completeFolderPath.replace(/\\/g, '\\\\')
    shell.showItemInFolder(folderPath)
  } catch (error) {
    console.log(`${error.message} opening folder ${completeFolderPath}`) // eslint-disable-line @typescript-eslint/restrict-template-expressions
  }
})

let type: ContentTypes
/* eslint-disable @typescript-eslint/no-misused-promises */
ipcMain.on('qualities:get', async (event, { url }) => {
  try {
    url = new UrlVo(url)

    type = await feedsController.getContentType(url)

    const feeds: PlaylistVo[] = await feedsController.getFeeds(type, url)

    const feedOptions: FeedVo[] = feedsController.parseFeeds(feeds)

    mainWindow.webContents.send('qualities:got', feeds, feedOptions)
  } catch (error) {
    mainWindow.webContents.send('qualities:error', error.message)
  }
})

ipcMain.on('download:start', async (event, { downloadPath, file, feed }) => {
  try {
    downloadPath = new PathVo(downloadPath)
    file = new FileVo(file)
    feed = new FeedVo(feed)

    file.removeExtensionFromFileName()
    downloadPath.addTrailingSlash()

    const selectedFeed: PlaylistVo = feed

    const extension = fileController.getExtensionFromPlaylist(selectedFeed)

    const downloadUrl: UrlVo = new UrlVo(selectedFeed.value.url)

    await downloadController.download(type, downloadUrl, downloadPath, file, extension)

    const pathFolder: string = (downloadPath.value === '' ? `${process.cwd()}/` : downloadPath.value)
    const completeFolderPath: string = `${pathFolder}${file.value}${extension.value}` // eslint-disable-line @typescript-eslint/restrict-template-expressions

    mainWindow.webContents.send('download:finished', completeFolderPath)
  } catch (error) {
    mainWindow.webContents.send('download:error', error.message)
  }
})
/* eslint-enable @typescript-eslint/no-misused-promises */

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (!isMac) app.quit()
})

// Open a window if none are open (macOS)
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
})
