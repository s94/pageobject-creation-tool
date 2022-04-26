import { test, expect } from '@playwright/test';
import { ElectronApplication, _electron as electron } from 'playwright';
import { ElectronAppInfo, findLatestBuild, parseElectronApp } from 'electron-playwright-helpers';
import { IndexPage } from './page/index/index-page';
import { SettingsPage } from './page/settings/settings-page'
import { SelectListAttribute } from './enum/select-list-attribute';

let electronApp: ElectronApplication;
let settingsPage: SettingsPage;

test.beforeEach(async () => {
	const latestBuild: string = findLatestBuild();
	const appInfo: ElectronAppInfo = parseElectronApp(latestBuild);
	electronApp = await electron.launch({
		args: [appInfo.main],
		executablePath: appInfo.executable
	});

	electronApp.on('window', async (page) => {
		const filename: string = page.url()?.split('/').pop();
		console.log(`Window opened: ${filename}`);

		page.on('pageerror', (error) => {
			console.error(error);
		});
		page.on('console', (msg) => {
			console.log(msg.text());
		});
	});

	const indexPage = new IndexPage(await electronApp.firstWindow());
	await indexPage.clickSettingsLink();
	settingsPage = new SettingsPage(await electronApp.firstWindow());
});

test.afterEach(async () => {
	await electronApp.close();
});

test('correct error is shown when clicking \'Delete\' with no Template selected', async () => {
	const expectedErrorMsg: string = 'Unable to delete template, no template is selected.';
	expect(await settingsPage.getTemplateListValue(SelectListAttribute.value)).toBe('0');
	await settingsPage.clickDeleteTemplateButton();
	expect(await settingsPage.isErrorMessageDisplayed(), 'error element is incorrectly hidden').toBe(true);
	expect(await settingsPage.getErrorMessageValue(), 'error element text is blank').toBe(expectedErrorMsg);
});
