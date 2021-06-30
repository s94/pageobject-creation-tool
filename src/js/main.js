const { app, BrowserWindow } = require('electron');

function createWindow () {
	const win = new BrowserWindow({
		minWidth: 800,
		width: 800,
		minHeight: 720,
		height: 720,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false
		}
	});

	win.loadFile('src/index.html');

	//win.removeMenu();
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
