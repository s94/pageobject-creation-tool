import { test, expect } from '@playwright/test';
import { ElectronApplication, _electron as electron } from 'playwright';
import { ElectronAppInfo, findLatestBuild, parseElectronApp } from 'electron-playwright-helpers';
import { SelectListAttribute } from './enum/select-list-attribute';
import { IndexPage } from './page/index/index-page';
import { SettingsPage } from './page/settings/settings-page'

let electronApp: ElectronApplication;
let indexPage: IndexPage;
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

	indexPage = new IndexPage(await electronApp.firstWindow());
	await indexPage.clickSettingsLink();
	settingsPage = new SettingsPage(await electronApp.firstWindow());
});

test.afterEach(async () => {
	await electronApp.close();
});

test('application title is \'pageobject-creation-tool settings\'', async() => {
	expect(await settingsPage.getPageTitle()).toBe('pageobject-creation-tool settings');
});

test('window count equals one', async () => {
	expect(electronApp.windows().length).toBe(1);
});

test('template list contains \'Example Template\'', async () => {
	await settingsPage.selectTemplate('Example Template', SelectListAttribute.label);
	expect(await settingsPage.getTemplateListValue(SelectListAttribute.value)).toBe('1');
});

test('has the correct title', async () => {
	expect(await settingsPage.getHeaderTitleValue()).toBe('pageobject-creation-tool');
});

test('link to home page is displayed', async () => {
	expect(await settingsPage.isHomeLinkDisplayed()).toBe(true);
});
