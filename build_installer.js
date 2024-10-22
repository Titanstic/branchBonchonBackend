const { MSICreator } = require('electron-wix-msi');
const path = require('path');

const APP_DIR = path.resolve(__dirname, './out/bonchon_pos-win32-x64');
const OUT_DIR = path.resolve(__dirname, './bonchon_installer');

const  msiCreator = new MSICreator({
    appDirectory: APP_DIR,
    outputDirectory: OUT_DIR,

    description: "This is Bonchon app",
    exe: "bonchon_pos",
    appIconPath: path.resolve(__dirname,'./images/logo.ico'),
    name: "Bonchon Dashboard",
    manufacturer: "Axra Inc",
    version: "1.0.0",

    ui:{
        chooseDirectory: true
    }
})

msiCreator.iconPath = path.resolve(__dirname, './images/logo.png');

msiCreator.create().then(function() {
    msiCreator.compile();
})

