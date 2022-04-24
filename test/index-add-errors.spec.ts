import { test, expect } from '@playwright/test';
import { ElectronApplication, _electron as electron } from 'playwright';
import { ElectronAppInfo, findLatestBuild, parseElectronApp } from 'electron-playwright-helpers';
import { SelectListAttribute } from './enum/select-list-attribute';
import { IndexPage } from './page/index/index-page';

let electronApp: ElectronApplication;
let indexPage: IndexPage;

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

	indexPage = new IndexPage(await electronApp.firstWindow());
	expect(await indexPage.isErrorMessageDisplayed(), 'error element is incorrectly visible').toBe(false);
	expect(await indexPage.getErrorMessageValue(), 'error element text is not blank').toBe('');
	await indexPage.selectTemplate('Example Template', SelectListAttribute.label);
	expect(await indexPage.getTemplateListValue(SelectListAttribute.value)).toBe('1');
});

test.afterEach(async () => {
	await electronApp.close();
});

test.describe('correct error is shown when clicking \'Add\' with Element Name and/or Element Type not populated', async () => {
	test.afterEach(async () => {
		await indexPage.clickAddElementToTableButton();
		expect(await indexPage.isErrorMessageDisplayed(), 'error element is incorrectly hidden').toBe(true);
		expect(await indexPage.getErrorMessageValue(), 'error element text is blank').toBe(expectedErrorMsg);
	});

	test('Element Name: blank, Element Type: blank', async () => {
		expect(await indexPage.getElementNameValue()).toBe('');
		expect(await indexPage.getElementTypeValue(SelectListAttribute.value)).toBe('');
	});

	test('Element Name: whitespace, Element Type: blank', async () => {
		await indexPage.enterElementName(' ');
		expect(await indexPage.getElementNameValue()).toBe(' ');
		expect(await indexPage.getElementTypeValue(SelectListAttribute.value)).toBe('');
	});

	test('Element Name: populated, Element Type: blank', async () => {
		await indexPage.enterElementName('TestElement');
		expect(await indexPage.getElementNameValue()).toBe('TestElement');
		expect(await indexPage.getElementTypeValue(SelectListAttribute.value)).toBe('');
	});

	test('Element Name: blank, Element Type: populated', async () => {
		expect(await indexPage.getElementNameValue()).toBe('');
		await indexPage.selectElementType('1', SelectListAttribute.value);
		expect(await indexPage.getElementTypeValue(SelectListAttribute.value)).toBe('1');
	});

	test('Element Name: whitespace, Element Type: populated', async () => {
		await indexPage.enterElementName(' ');
		expect(await indexPage.getElementNameValue()).toBe(' ');
		await indexPage.selectElementType('1', SelectListAttribute.value);
		expect(await indexPage.getElementTypeValue(SelectListAttribute.value)).toBe('1');
	});
});

test.describe('no error is shown when clicking \'Add\' when Element Name and Element Type are populated', async () => {
	test('Element Name: populated, Element Type: populated', async () => {
		await indexPage.enterElementName('TestElement');
		expect(await indexPage.getElementNameValue()).toBe('TestElement');
		await indexPage.selectElementType('1', SelectListAttribute.value);
		expect(await indexPage.getElementTypeValue(SelectListAttribute.value)).toBe('1');
		await indexPage.clickAddElementToTableButton();
		expect(await indexPage.isErrorMessageDisplayed(), 'error element is incorrectly visible').toBe(false);
		expect(await indexPage.getErrorMessageValue(), 'error element text is not blank').toBe('');
	});
});
