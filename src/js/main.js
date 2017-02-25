const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let windowDimensions = {height : 720, width: 1280, show: true, 'node-integration': false, 'minHeight': 600, 'minWidth': 860};
let mainWindow;

app.on('ready', _ =>{
	mainWindow = new BrowserWindow(windowDimensions);
	mainWindow.loadURL(`file://${__dirname}/../html/index.html`)

	mainWindow.on('closed', _ =>{
		mainWindow = null;
	});
})
