import { test, expect } from '@playwright/test';
import { ElectronApplication, _electron as electron } from 'playwright';
import { ElectronAppInfo, findLatestBuild, parseElectronApp } from 'electron-playwright-helpers';
import { SelectListAttribute } from './enum/select-list-attribute';
import { IndexPage } from './page/index/index-page';
import { SettingsPage } from './page/settings/settings-page'

let electronApp: ElectronApplication;
let settingsPage: SettingsPage;

const expectedErrorMsg: string = 'Element cannot be added to the table, submission is not valid.';

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
	await electronApp.close()
});

test.describe('correct error is shown when clicking \'Add\' with Element Type and/or General Method Template not populated', async () => {
	test.afterEach(async () => {
		await settingsPage.clickAddElementTypeToTableButton();
		expect(await settingsPage.isErrorMessageDisplayed(), 'error element is incorrectly hidden').toBe(true);
		expect(await settingsPage.getErrorMessageValue(), 'error element text is blank').toBe(expectedErrorMsg);
	});

	test('Element Type: blank, General Method Template: blank', async () => {
		expect(await settingsPage.getElementTypeValue()).toBe('');
		expect(await settingsPage.getGeneralMethodTemplateValue()).toBe('');
	});

	test('Element Type: whitespace, General Method Template: blank', async () => {
		await settingsPage.enterElementType(' ');
		expect(await settingsPage.getElementTypeValue()).toBe(' ');
		expect(await settingsPage.getGeneralMethodTemplateValue()).toBe('');
	});

	test('Element Type: whitespace, General Method Template: whitespace', async () => {
		await settingsPage.enterElementType(' ');
		expect(await settingsPage.getElementTypeValue()).toBe(' ');
		await settingsPage.enterGeneralMethodTemplate(' ');
		expect(await settingsPage.getGeneralMethodTemplateValue()).toBe(' ');
	});

	test('Element Type: populated, General Method Template: blank', async () => {
		await settingsPage.enterElementType('TestElement')
		expect(await settingsPage.getElementTypeValue()).toBe('TestElement');
		expect(await settingsPage.getGeneralMethodTemplateValue()).toBe('');
	});

	test('Element Type: populated, General Method Template: whitespace', async () => {
		await settingsPage.enterElementType('TestElement')
		expect(await settingsPage.getElementTypeValue()).toBe('TestElement');
		await settingsPage.enterGeneralMethodTemplate(' ');
		expect(await settingsPage.getGeneralMethodTemplateValue()).toBe(' ');
	});

	test('Element Type: blank, General Method Template: populated', async () => {
		expect(await settingsPage.getElementTypeValue()).toBe('');
		await settingsPage.enterGeneralMethodTemplate('TestGeneralMethod');
		expect(await settingsPage.getGeneralMethodTemplateValue()).toBe('TestGeneralMethod');
	});

	test('Element Type: whitespace, General Method Template: populated', async () => {
		await settingsPage.enterElementType(' ')
		expect(await settingsPage.getElementTypeValue()).toBe(' ');
		await settingsPage.enterGeneralMethodTemplate('TestGeneralMethod');
		expect(await settingsPage.getGeneralMethodTemplateValue()).toBe('TestGeneralMethod');
	});
});

test.describe('no error is shown when clicking \'Add\' with Element Type and General Method Template populated', async () => {
	test.beforeEach(async () => {
		await settingsPage.enterElementType('TestElement')
		expect(await settingsPage.getElementTypeValue()).toBe('TestElement');
		await settingsPage.enterGeneralMethodTemplate('TestGeneralMethod');
		expect(await settingsPage.getGeneralMethodTemplateValue()).toBe('TestGeneralMethod');
	});
	
	test.afterEach(async () => {
		await settingsPage.clickAddElementTypeToTableButton();
		expect(await settingsPage.isErrorMessageDisplayed(), 'error element is incorrectly visible').toBe(false);
		expect(await settingsPage.getGeneralMethodTemplateValue(), 'error element text is not blank').toBe('');
	});

	test('Element Type: populated, General Method Template: populated, Get Method Template: blank', async () => {
		expect(await settingsPage.getGetMethodTemplateValue()).toBe('');
	});

	test('Element Type: populated, General Method Template: populated, Get Method Template: whitespace', async () => {
		await settingsPage.enterGetMethodTemplate(' ');
		expect(await settingsPage.getGetMethodTemplateValue()).toBe(' ');
	});

	test('Element Type: populated, General Method Template: populated, Get Method Template: populated', async () => {
		await settingsPage.enterGetMethodTemplate('TestGetMethod');
		expect(await settingsPage.getGetMethodTemplateValue()).toBe('TestGetMethod');
	});
});
