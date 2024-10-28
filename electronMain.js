const { app, BrowserWindow } = require('electron');
const serverStart = require('./index');

// Run the Node.js server
serverStart();

let mainWindowDashboard;

function createWindow() {
    mainWindowDashboard = new BrowserWindow({
        width: 1440,
        height: 900,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            webSecurity: true,
        },
    });

    // Disable DevTools in production mode
    mainWindowDashboard.webContents.on('devtools-opened', () => {
        mainWindowDashboard.webContents.closeDevTools();
    });

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
