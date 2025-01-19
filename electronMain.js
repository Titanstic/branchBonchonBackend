const { app, BrowserWindow, ipcMain } = require('electron');
const serverStart = require('./index');

const config = require("dotenv");
config.config();

// Run the Node.js server
serverStart();

let mainWindowDashboard;

ipcMain.on("invokeEnv", (event) => {
    event.sender.send("envReply", config);
});

function createWindow() {
    mainWindowDashboard = new BrowserWindow({
        width: 1440,
        height: 900,
        webPreferences: {
            nodeIntegration: true   ,
            contextIsolation: false,
            webSecurity: true,
        },
    });

    // Disable DevTools in production mode
    // mainWindowDashboard.webContents.on('devtools-opened', () => {
    //     mainWindowDashboard.webContents.closeDevTools();
    // });

    mainWindowDashboard.loadURL(`http://localhost:5000`);

    mainWindowDashboard.webContents.openDevTools();

    mainWindowDashboard.on('closed', () => {
        mainWindowDashboard = null;
    });
}

app.whenReady().then(createWindow);

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
