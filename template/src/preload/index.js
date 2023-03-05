import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
const fs = require('fs')

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('ipcRenderer', {
      invoke: ipcRenderer.invoke.bind(ipcRenderer),
      on: ipcRenderer.on.bind(ipcRenderer),
      removeAllListeners: ipcRenderer.removeAllListeners.bind(ipcRenderer)
    })
    contextBridge.exposeInMainWorld('fs', fs)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
}
