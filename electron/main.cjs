const { app, BrowserWindow, shell } = require('electron')
const path = require('path')

const isDev = !!process.env.ELECTRON_START_URL

function createWindow() {
  const win = new BrowserWindow({
    width: 1320,
    height: 880,
    minWidth: 900,
    minHeight: 600,
    backgroundColor: '#17130f',
    title: 'Đắk Lắk AI',
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  })

  const startUrl = process.env.ELECTRON_START_URL || `file://${path.join(__dirname, '../dist/index.html')}`
  win.loadURL(startUrl)

  // Open external links (http/https) in the system browser instead of inside the app window.
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http')) {
      shell.openExternal(url)
      return { action: 'deny' }
    }
    return { action: 'allow' }
  })

  if (isDev) {
    win.webContents.openDevTools({ mode: 'detach' })
  }
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
