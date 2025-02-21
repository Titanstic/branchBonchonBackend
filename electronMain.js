const { app, BrowserWindow, Tray, Menu, ipcMain, screen   } = require('electron');
const serverStart = require('./index');
const { globalShortcut } = require('electron');

const path = require('path');
const config = require("dotenv");
config.config();

let mainWindowDashboard, tray = null;

const gotTheLock = app.requestSingleInstanceLock();
if(!gotTheLock){
    app.quit();
    return;
}

// Run the Node.js server
serverStart();

app.setLoginItemSettings({
    openAtLogin: true,
    path: process.execPath,
    args: []
})

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
        mainWindowDashboard = null; // Prevent using a destroyed window
    });
}

const createTray = () =>{
    tray = new Tray(path.join(__dirname, 'images', 'icon1.png'));
    const contextMenu = Menu.buildFromTemplate([
        { label: 'Show App', click: () => {
                if (!mainWindowDashboard) {
                    createWindow(); // Recreate window if it was closed
                } else {
                    mainWindowDashboard.show();
                }
            }},
        { label: 'Exit', click: () => {
                app.isQuiting = true;
                app.quit();
            }}
    ]);
    tray.setContextMenu(contextMenu);
    tray.setToolTip('Bonchon Branch Dashboard');
}

ipcMain.on("invokeEnv", (event) => {
    event.sender.send("envReply", config);
});

app.whenReady().then(() => {
    createTray();

    createWindow();

    globalShortcut.register('CommandOrControl+Shift+I', () => {
        mainWindowDashboard.webContents.toggleDevTools();
    });

    app.on('window-all-closed', (event) => {
        if (!app.isQuiting) {
            event.preventDefault();  // Don't exit when all windows are closed
        }
    });
});

app.on('second-instance', () => {
    if (mainWindowDashboard) {
        if (mainWindowDashboard.isMinimized()) mainWindowDashboard.restore();
        mainWindowDashboard.focus();
    } else {
        createWindow();
    }
});

app.on('activate', () => {
    if (mainWindowDashboard === null) {
        createWindow();
    }
});
