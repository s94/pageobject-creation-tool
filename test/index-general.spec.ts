import { test, expect } from '@playwright/test';
import { ElectronApplication, _electron as electron } from 'playwright';
import { ElectronAppInfo, findLatestBuild, parseElectronApp } from 'electron-playwright-helpers';
import { SelectListAttribute } from './enum/select-list-attribute';
import { IndexPage } from './page/index/index-page';

let electronApp: ElectronApplication;
let indexPage: IndexPage;

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
});

test.afterEach(async () => {
	await electronApp.close();
});

test('application title is \'pageobject-creation-tool\'', async() => {
	expect(await indexPage.getPageTitle()).toBe('pageobject-creation-tool');
});

test('window count equals one', async () => {
	expect(electronApp.windows().length).toBe(1);
});

test('template list contains \'Example Template\'', async () => {
	await indexPage.selectTemplate('Example Template', SelectListAttribute.label);
	expect(await indexPage.getTemplateListValue(SelectListAttribute.value)).toBe('1');
});

test('include get checkbox is unchecked by default', async () => {
	expect(await indexPage.isIncludeGetChecked()).toBe(false);
});

test('has the correct title', async () => {
	expect(await indexPage.getHeaderTitleValue()).toBe('pageobject-creation-tool');
});

test('link to settings page is displayed', async () => {
	expect(await indexPage.isSettingsLinkDisplayed()).toBe(true);
});
