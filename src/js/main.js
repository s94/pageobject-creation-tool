const { app, BrowserWindow } = require('electron');

function createWindow() {
	const browserWindow = new BrowserWindow({
		height: 720,
		width: 1000,
		minHeight: 720,
		minWidth: 1000,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
		},
	});

	browserWindow.loadFile('src/index.html');
	browserWindow.removeMenu();
}

app.whenReady().then(() => {
	createWindow();

	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow();
		}
	});
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});
