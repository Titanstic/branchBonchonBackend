const { app, BrowserWindow, ipcMain, screen, dialog   } = require('electron');
const serverStart = require('./index');
const { globalShortcut } = require('electron');

const config = require("dotenv");
config.config();

// Run the Node.js server
serverStart();

let mainWindowDashboard;

ipcMain.on("invokeEnv", (event) => {
    event.sender.send("envReply", config);
});

function createWindow() {
    const primaryDisplay = screen.getPrimaryDisplay();

    mainWindowDashboard = new BrowserWindow({
        x: primaryDisplay.bounds.x,
        y: primaryDisplay.bounds.y,
        width: 1440,
        height: 900,
        webPreferences: {
            nodeIntegration: true   ,
            contextIsolation: false,
            webSecurity: true,
        },
    });
    mainWindowDashboard.loadURL(`http://localhost:5000`);

    mainWindowDashboard.on('closed', () => {
        mainWindowDashboard = null;
    });
}

app.whenReady().then(() => {
    createWindow();

    globalShortcut.register('CommandOrControl+Shift+I', () => {
        mainWindowDashboard.webContents.toggleDevTools();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindowDashboard === null) {
        createWindow();
    }
});
