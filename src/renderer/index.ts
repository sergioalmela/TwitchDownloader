import 'reflect-metadata'

import path from 'path'
import os from 'os'
import fs from 'fs'
import {app, BrowserWindow, Menu, ipcMain, dialog } from 'electron'

import container from '../main/container'
import { ContainerSymbols } from '../main/symbols'
import { FeedController } from '../main/infrastructure/controllers/feed.controller'
import { UrlVo } from '../main/domain/valueObjects/url.vo'
import { PlaylistVo } from '../main/domain/valueObjects/playlist.vo'
import { FeedVo } from '../main/domain/valueObjects/feed.vo'
import DownloadPath from '../main/infrastructure/types/prompt/DownloadPath'
import ExportQuality from '../main/infrastructure/types/prompt/ExportQuality'
import { PathVo } from '../main/domain/valueObjects/path.vo'
import { DownloadController } from '../main/infrastructure/controllers/download.controller'
import { FileVo } from '../main/domain/valueObjects/file.vo'
import { FileController } from '../main/infrastructure/controllers/file.controller'
import Url from '../main/infrastructure/types/prompt/Url'
import { ContentTypes } from '../main/domain/constants/contentTypes.enum'
import { IdVo } from '../main/domain/valueObjects/id.vo'

const feedsController = container.get<FeedController>(
    ContainerSymbols.FeedController
)

const downloadController = container.get<DownloadController>(
    ContainerSymbols.DownloadController
)

const fileController = container.get<FileController>(
    ContainerSymbols.FileController
)

const isDev = process.env.NODE_ENV !== 'production'
const isMac = process.platform === 'darwin'

let mainWindow
let aboutWindow

// Main Window
function createMainWindow () {
    mainWindow = new BrowserWindow({
        width: isDev ? 1000 : 500,
        height: 600,
        icon: `${__dirname}/logo.png`,
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

    mainWindow.loadFile(path.join(__dirname, '../../../src/renderer/public/test.html'))
}

// About Window
function createAboutWindow () {
    aboutWindow = new BrowserWindow({
        width: 300,
        height: 300,
        title: 'About Electron',
        icon: `${__dirname}/assets/icons/Icon_256x256.png`
    })

    aboutWindow.loadFile(path.join(__dirname, '../../../src/renderer/public/about.html'))
}

// When the app is ready, create the window
app.on('ready', () => {
    createMainWindow()

    /*const mainMenu = Menu.buildFromTemplate(menu)
    Menu.setApplicationMenu(mainMenu)*/

    // Remove variable from memory
    mainWindow.on('closed', () => (mainWindow = null))
})

// Menu template
/*const menu = [
    ...(isMac
        ? [
            {
                label: app.name,
                submenu: [
                    {
                        label: 'About',
                        click: createAboutWindow
                    }
                ]
            }
        ]
        : []),
    {
        role: 'fileMenu'
    },
    ...(!isMac
        ? [
            {
                label: 'Help',
                submenu: [
                    {
                        label: 'About',
                        click: createAboutWindow
                    }
                ]
            }
        ]
        : []),
    ...(isDev
        ? [
            {
                label: 'Developer',
                submenu: [
                    { role: 'reload' },
                    { role: 'forcereload' },
                    { type: 'separator' },
                    { role: 'toggledevtools' }
                ]
            }
        ]
        : [])
]*/

// Respond to the resize image event
ipcMain.on('dialog:folder', () => {
    dialog.showOpenDialog(mainWindow, {properties: ['openDirectory']}).then(result => {
        if (!result.canceled) {
            mainWindow.webContents.send('folder:selected', result.filePaths[0])
        }
    })
})

let type: ContentTypes
ipcMain.on('qualities:get', async (event, {url, path}) => {
    url = new UrlVo(url)
    path = new PathVo(path)

    type = await feedsController.getContentType(url)

    const feeds: PlaylistVo[] = await feedsController.getFeeds(type, url)

    const feedOptions: FeedVo[] = feedsController.parseFeeds(feeds)

    const file: FileVo = fileController.getFileNameFromPath(path)
    file.removeExtensionFromFileName()

    path.removeFileFromPath()

    mainWindow.webContents.send('qualities:got', feedOptions)
})

ipcMain.on('download:start', async (event, {path, file, feed}) => {
    const selectedFeed: PlaylistVo = feed

    const extension = fileController.getExtensionFromPlaylist(selectedFeed)

    const downloadUrl: UrlVo = new UrlVo(selectedFeed.value.url)

    await downloadController.download(type, downloadUrl, path, file, extension)
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    if (!isMac) app.quit()
})

// Open a window if none are open (macOS)
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
})
