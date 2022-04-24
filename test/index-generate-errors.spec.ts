import { test, expect } from '@playwright/test';
import { ElectronApplication, _electron as electron } from 'playwright';
import { ElectronAppInfo, findLatestBuild, parseElectronApp } from 'electron-playwright-helpers';
import { SelectListAttribute } from './enum/select-list-attribute';
import { IndexPage } from './page/index/index-page';

let electronApp: ElectronApplication;
let indexPage: IndexPage;
let expectedErrorMsg: string;

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
	expect(await indexPage.getTemplateListValue(SelectListAttribute.value)).toBe('0');
	expect(await indexPage.getPageObjectNameValue()).toBe('');
	expect(await indexPage.getElementTableRowCount()).toBe(0);
});

test.afterEach(async () => {
	await electronApp.close();
});

test.describe('correct error is shown when clicking \'Generate\' with no template selected', async () => {
	test.beforeAll(async () => {
		expectedErrorMsg = 'Unable to generate PageObject, a template is required.';
	});

	test.afterEach(async () => {
		await indexPage.clickGeneratePageObjectButton();
		expect(await indexPage.isErrorMessageDisplayed(), 'error element is incorrectly hidden').toBe(true);
		expect(await indexPage.getErrorMessageValue(), 'error element text is blank').toBe(expectedErrorMsg);
	});

	test('PageObject Name: blank, Element Table: blank', async () => {
		// PageObject Name and Element Table assertions done in test.beforeEach();
	});
	
	test('PageObject Name: populated, Element Table: blank', async () => {
		await indexPage.enterPageObjectName('Testing');
		expect(await indexPage.getPageObjectNameValue()).toBe('Testing');
	});
	
	test('PageObject Name: blank, Element Table: populated', async () => {
		await indexPage.selectTemplate('Example Template', SelectListAttribute.label);
		expect(await indexPage.getTemplateListValue(SelectListAttribute.label)).toBe('Example Template');
		await indexPage.selectElementType('1', SelectListAttribute.value);
		expect(await indexPage.getElementTypeValue(SelectListAttribute.value)).toBe('1');
		await indexPage.enterElementName('TestElement');
		expect(await indexPage.getElementNameValue()).toBe('TestElement');
		await indexPage.clickAddElementToTableButton();
		expect(await indexPage.getElementTableRowCount()).toBe(1);
		await indexPage.selectTemplate('0', SelectListAttribute.value);
		expect(await indexPage.getTemplateListValue(SelectListAttribute.value)).toBe('0');
	});
	
	test('PageObject Name: populated, Element Table: populated', async () => {
		await indexPage.selectTemplate('Example Template', SelectListAttribute.label);
		expect(await indexPage.getTemplateListValue(SelectListAttribute.label)).toBe('Example Template');
		await indexPage.enterPageObjectName('Testing');
		expect(await indexPage.getPageObjectNameValue()).toBe('Testing');
		await indexPage.selectElementType('1', SelectListAttribute.value);
		await indexPage.enterElementName('TestElement');
		expect(await indexPage.getElementNameValue()).toBe('TestElement');
		await indexPage.clickAddElementToTableButton();
		expect(await indexPage.getElementTableRowCount()).toBe(1);
		await indexPage.selectTemplate('0', SelectListAttribute.value);
		expect(await indexPage.getTemplateListValue(SelectListAttribute.value)).toBe('0');
	});
});

test.describe('correct error is shown when clicking \'Generate\' with no PageObject name entered', async () => {
	test.beforeEach(async () => {
		expectedErrorMsg = 'Unable to generate PageObject, a PageObject name is required.';
		await indexPage.selectTemplate('Example Template', SelectListAttribute.label);
		expect(await indexPage.getTemplateListValue(SelectListAttribute.label)).toBe('Example Template');
	});

	test.afterEach(async () => {
		await indexPage.clickGeneratePageObjectButton();
		expect(await indexPage.isErrorMessageDisplayed(), 'error element is incorrectly hidden').toBe(true);
		expect(await indexPage.getErrorMessageValue(), 'error element text is blank').toBe(expectedErrorMsg);
	});

	test('Template Name: populated, Element Table: blank', async () => {
		// Template Name populated in test.beforeEach();
		// Check for blank Element Table also done in test.beforeEach();
	});

	test('Template Name: populated, Element Table: populated', async () => {
		await indexPage.selectElementType('1', SelectListAttribute.value);
		expect(await indexPage.getElementTypeValue(SelectListAttribute.value)).toBe('1');
		await indexPage.enterElementName('TestElement');
		expect(await indexPage.getElementNameValue()).toBe('TestElement');
		await indexPage.clickAddElementToTableButton();
		expect(await indexPage.getElementTableRowCount()).toBe(1);
	});
});

test.describe('correct error is shown when clicking \'Generate\' with the element table blank', async () => {
	test('Template Name: populated, PageObject Name: populated', async () => {
		expectedErrorMsg = 'Unable to generate PageObject, element table cannot be empty.';
		await indexPage.selectTemplate('Example Template', SelectListAttribute.label);
		expect(await indexPage.getTemplateListValue(SelectListAttribute.label)).toBe('Example Template');
		await indexPage.enterPageObjectName('Testing');
		expect(await indexPage.getPageObjectNameValue()).toBe('Testing');
	});
});

test.describe('no error is shown when clicking \'Generate\' when a template selected, PageObject Name and element table is populated', async () => {
	test('Template Name: populated, PageObject Name: populated, Element Table: populated', async () => {
		await indexPage.selectTemplate('Example Template', SelectListAttribute.label);
		expect(await indexPage.getTemplateListValue(SelectListAttribute.label)).toBe('Example Template');
		await indexPage.enterPageObjectName('Testing');
		expect(await indexPage.getPageObjectNameValue()).toBe('Testing');
		await indexPage.selectElementType('1', SelectListAttribute.value);
		expect(await indexPage.getElementTypeValue(SelectListAttribute.value)).toBe('1');
		await indexPage.enterElementName('TestElement');
		expect(await indexPage.getElementNameValue()).toBe('TestElement');
		await indexPage.clickAddElementToTableButton();
		expect(await indexPage.getElementTableRowCount()).toBe(1);
		await indexPage.clickGeneratePageObjectButton();
		expect(await indexPage.isErrorMessageDisplayed(), 'error element is incorrectly visible').toBe(false);
		expect(await indexPage.getErrorMessageValue(), 'error element text is not blank').toBe('');
	});
});
