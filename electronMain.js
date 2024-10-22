const { app, BrowserWindow } = require('electron');
const serverStart = require('./index');

// Run the Node.js server
serverStart();

let mainWindowPos;

function createWindow() {
    mainWindowPos = new BrowserWindow({
        width: 1440,
        height: 900,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            webSecurity: true,
        },
    });

    // Disable DevTools in production mode
    // mainWindowPos.webContents.on('devtools-opened', () => {
    //     mainWindowPos.webContents.closeDevTools();
    // });

    mainWindowPos.loadURL(`http://localhost:4000`);

    mainWindowPos.webContents.openDevTools();

    mainWindowPos.on('closed', () => {
        mainWindowPos = null;
    });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindowPos === null) {
        createWindow();
    }
});
