import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../build/icon.png?asset'
{{#if rsa}}
import validateLicense from './validateLicense'
import getHardwaveId from './getHardwaveId'
import pkg from '../../package.json'
{{/if}}

ipcMain.handle('get-root', () => {
  return process.cwd().split('\\').join('/') + '/Data/'
})

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    x: 0,
    y: 0,
    show: false,
    frame: false,
    center: false,
    alwaysOnTop: false,
    fullscreen: false,
    kiosk: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: false,
      nodeIntegrationInSubFrames: true,
      contextIsolation: true,
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      webSecurity: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })
  {{#if rsa}}
  if (validateLicense()) {
    createWindow()
    app.on('activate', function () {
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
  } else {
    dialog.showMessageBoxSync({
      title: pkg.description,
      message: '试用期结束，请联系软件厂商！',
      type: 'warning',
      detail: '硬件ID:' + getHardwaveId()
    })
    app.quit()
  }
  {{else}}
  createWindow()
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
  {{/if}}
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
