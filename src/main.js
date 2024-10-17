const { app, BrowserWindow } = require('electron/main')
const path = require('node:path')

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      //preload: path.join(__dirname, 'preload.js')

      //From https://stackoverflow.com/questions/55785565/how-do-i-blur-an-electron-browserwindow-with-transparency thanks anon!
      vibrancy: 'fullscreen-ui',    // on MacOS
      backgroundMaterial: 'acrylic' // on Windows 11
    }
  })

  win.loadFile('src/editor.html')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})