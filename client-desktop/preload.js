const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  getComputerId: () => ipcRenderer.invoke('get-computer-id'),
  launchGame: (game) => ipcRenderer.invoke('launch-game', game),
  sendSocketEvent: (eventName, data) => ipcRenderer.invoke('send-socket-event', eventName, data),
  onSocketConnected: (callback) => ipcRenderer.on('socket:connected', callback),
  onSocketDisconnected: (callback) => ipcRenderer.on('socket:disconnected', callback),
  onLockScreen: (callback) => ipcRenderer.on('lock:screen', (event, data) => callback(data)),
  onUnlockScreen: (callback) => ipcRenderer.on('unlock:screen', callback),
  onBroadcastMessage: (callback) => ipcRenderer.on('message:broadcast', (event, data) => callback(data)),
  offLockScreen: () => ipcRenderer.removeAllListeners('lock:screen'),
  offUnlockScreen: () => ipcRenderer.removeAllListeners('unlock:screen'),
  offBroadcastMessage: () => ipcRenderer.removeAllListeners('message:broadcast'),
});
