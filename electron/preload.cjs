const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('CrypteraDesktop', {
  isElectron: true,
  getVersion: () => ipcRenderer.invoke('Cryptera:get-version'),
  getPlatform: () => ipcRenderer.invoke('Cryptera:platform'),
});
