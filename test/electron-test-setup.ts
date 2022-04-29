import { ElectronApplication, _electron as electron } from 'playwright';
import { ElectronAppInfo, findLatestBuild, parseElectronApp } from 'electron-playwright-helpers';

class ElectronTestSetup {
	private get latestBuild(): string { return findLatestBuild(); }
	private get appInfo(): ElectronAppInfo { return parseElectronApp(this.latestBuild); }

	async startup(): Promise<ElectronApplication> {
		const electronApp = electron.launch({
			args: [this.appInfo.main],
			executablePath: this.appInfo.executable
		});

		(await electronApp).on('window', async (page) => {
			const filename: string = page.url()?.split('/').pop();
			console.log(`Window opened: ${filename}`);

			page.on('pageerror', (error) => {
				console.error(error);
			});
			page.on('console', (msg) => {
				console.log(msg.text());
			});
		});

		return electronApp;
	}
}

export async function getTestElectronApp(): Promise<ElectronApplication> {
	return await new ElectronTestSetup().startup();
}
