const { app, BrowserWindow, screen, ipcMain, Menu } = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const io = require('socket.io-client');

let mainWindow;
let socket;
const COMPUTER_ID = process.env.REACT_APP_COMPUTER_ID || 'computer_' + require('os').hostname();
const SERVER_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:3000';

function createWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  mainWindow = new BrowserWindow({
    width,
    height,
    x: 0,
    y: 0,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
    },
    frame: false,
    fullscreen: true,
    alwaysOnTop: true,
  });

  const startUrl = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../build/index.html')}`;

  mainWindow.loadURL(startUrl);

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Disable menu
  Menu.setApplicationMenu(null);

  // Prevent exit
  mainWindow.on('close', (e) => {
    e.preventDefault();
  });
}

function initializeSocket() {
  socket = io(SERVER_URL, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: Infinity,
  });

  socket.on('connect', () => {
    console.log('Connected to server');
    socket.emit('register:computer', { computerId: COMPUTER_ID });
    mainWindow?.webContents.send('socket:connected');
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from server');
    mainWindow?.webContents.send('socket:disconnected');
  });

  socket.on('shutdown', () => {
    shutdown();
  });

  socket.on('restart', () => {
    restart();
  });

  socket.on('lock', (data) => {
    mainWindow?.webContents.send('lock:screen', data);
  });

  socket.on('unlock', () => {
    mainWindow?.webContents.send('unlock:screen');
  });

  socket.on('message:broadcast', (data) => {
    mainWindow?.webContents.send('message:broadcast', data);
  });

  socket.on('game:launch', (data) => {
    launchGame(data.game);
  });
}

function shutdown() {
  if (process.platform === 'win32') {
    spawn('shutdown', ['/s', '/t', '30', '/c', 'System will shutdown in 30 seconds']);
  } else if (process.platform === 'darwin') {
    spawn('osascript', [
      '-e',
      'tell application "System Events" to shut down',
    ]);
  } else {
    spawn('shutdown', ['-h', '+1']);
  }
}

function restart() {
  if (process.platform === 'win32') {
    spawn('shutdown', ['/r', '/t', '30', '/c', 'System will restart in 30 seconds']);
  } else if (process.platform === 'darwin') {
    spawn('osascript', [
      '-e',
      'tell application "System Events" to restart',
    ]);
  } else {
    spawn('shutdown', ['-r', '+1']);
  }
}

function launchGame(game) {
  const gamePaths = {
    steam: 'steam://',
    cs2: 'steam://run/730',
    dota2: 'steam://run/570',
    valorant: 'C:\\Program Files\\Riot Games\\Riot Client\\RiotClientServices.exe',
  };

  const path = gamePaths[game.toLowerCase()];
  if (path) {
    if (process.platform === 'win32') {
      require('child_process').exec(`start ${path}`);
    } else if (process.platform === 'darwin') {
      spawn('open', [path]);
    } else {
      spawn('xdg-open', [path]);
    }
  }
}

ipcMain.handle('get-computer-id', () => COMPUTER_ID);

ipcMain.handle('launch-game', async (event, game) => {
  launchGame(game);
  return { success: true };
});

ipcMain.handle('send-socket-event', async (event, eventName, data) => {
  if (socket) {
    socket.emit(eventName, data);
  }
  return { success: true };
});

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  // Don't quit the app
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Auto-start on Windows boot
if (process.platform === 'win32') {
  app.setLoginItemSettings({
    openAtLogin: true,
  });
}

app.whenReady().then(() => {
  createWindow();
  initializeSocket();
});

// Prevent right-click context menu
app.on('web-contents-created', (event, contents) => {
  contents.on('before-input-event', (event, input) => {
    // Block Alt+F4
    if (input.control && input.shift && input.key.toLowerCase() === 'delete') {
      event.preventDefault();
    }
    // Block Alt+Tab
    if (input.alt && input.key === 'Tab') {
      event.preventDefault();
    }
  });

  // Disable right-click
  contents.on('context-menu', (e) => {
    e.preventDefault();
  });
});
