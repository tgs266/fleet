/* eslint-disable no-restricted-syntax */
// Modules to control application life and create native browser window
// eslint-disable-next-line import/no-extraneous-dependencies
const { app, BrowserWindow, globalShortcut } = require('electron');
const path = require('path');
require('./server');

const args = process.argv;
let isDev = false;
for (const arg of args) {
    if (arg.includes('APP_DEV')) {
        const split = arg.split('=');
        if (split.length === 1) {
            break;
        }
        const trimmed = split[1].trim();
        if (trimmed.toLowerCase() === 'true') {
            isDev = true;
            break;
        }
    }
}

function createWindow() {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 1000,
        height: 600,
    });
    if (!isDev) {
        mainWindow.setMenu(null);
    }

    // and load the index.html of the app.
    mainWindow.loadFile(path.join(__dirname, '../build/index.html'));
    // Open the DevTools.
    // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

if (!isDev) {
    app.on('ready', () => {
        // Register a shortcut listener for Ctrl + Shift + I
        globalShortcut.register(
            'Control+Shift+I',
            () =>
                // When the user presses Ctrl + Shift + I, this function will get called
                // You can modify this function to do other things, but if you just want
                // to disable the shortcut, you can just return false
                false
        );
    });
}
