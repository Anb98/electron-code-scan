const path = require('path');

const { app, BrowserWindow } = require('electron');
const isDev = require('electron-is-dev');


const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 950,
        height: 650,
    })

    mainWindow.loadURL(
        isDev
            ? 'http://localhost:3000'
            : `file://${path.join(__dirname, 'build','index.html')}`
    );

    mainWindow.removeMenu();
    if (isDev) mainWindow.webContents.openDevTools({ mode: 'detach' });
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow()})
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
