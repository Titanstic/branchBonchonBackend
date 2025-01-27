const { app, BrowserWindow, ipcMain, screen, dialog   } = require('electron');
const serverStart = require('./index');

const config = require("dotenv");
config.config();

// Run the Node.js server
serverStart();

let mainWindowDashboard, extendWindow2;

ipcMain.on("invokeEnv", (event) => {
    event.sender.send("envReply", config);
});

function createWindow() {
    const displays = screen.getAllDisplays();

    if(displays.length < 2) {
        // window.alert("Please connect a second display to use this application.");
        dialog.showMessageBoxSync({
            type: 'warning',
            title: 'Second Display Required',
            message: 'Please connect a second display to display customer view.',
        });
        // return;
    }

    const primaryDisplay = screen.getPrimaryDisplay();
    const secondaryDisplay = displays.find((display) => display.id !== primaryDisplay.id);

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

    extendWindow2 = new BrowserWindow({
        x: secondaryDisplay.bounds.x,
        y: secondaryDisplay.bounds.y,
        fullscreen: true,
        webPreferences: {
            nodeIntegration: true,
        },
    });

    // Disable DevTools in production mode
    // mainWindowDashboard.webContents.on('devtools-opened', () => {
    //     mainWindowDashboard.webContents.closeDevTools();
    // });

    mainWindowDashboard.loadURL(`http://localhost:5000`);
    extendWindow2.loadURL(`http://localhost:4000`);

    mainWindowDashboard.webContents.openDevTools();

    mainWindowDashboard.on('closed', () => {
        mainWindowDashboard = null;

        if (extendWindow2) {
            extendWindow2.close(); // Close the extended screen window
        }
    });

    extendWindow2.on('closed', () => {
        extendWindow2 = null;
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
