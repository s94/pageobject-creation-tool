import { test, expect } from '@playwright/test';
import { ElectronApplication, _electron as electron } from 'playwright';
import { ElectronAppInfo, findLatestBuild, parseElectronApp } from 'electron-playwright-helpers';
import { IndexPage } from './page/index/index-page';
import { SettingsPage } from './page/settings/settings-page'

let electronApp: ElectronApplication;
let settingsPage: SettingsPage;
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

	const indexPage = new IndexPage(await electronApp.firstWindow());
	await indexPage.clickSettingsLink();
	settingsPage = new SettingsPage(await electronApp.firstWindow());
});

test.afterEach(async () => {
	await electronApp.close();
});

test.describe('correct error is shown when clicking \'Save\' with no element declaration entered', async () => {
	test.beforeEach(async () => {
		expectedErrorMsg = 'Unable to save template, element declaration is required.';
		expect(await settingsPage.getElementTemplateValue()).toBe('');
	});

	test.afterEach(async () => {
		await settingsPage.clickSaveTemplateButton();
		expect(await settingsPage.isErrorMessageDisplayed(), 'error element is incorrectly hidden').toBe(true);
		expect(await settingsPage.getErrorMessageValue(), 'error element text is blank').toBe(expectedErrorMsg);
	});

	test('PageObject Structure: blank, Element Type Table: blank, Template Name: blank', async () => {
		expect(await settingsPage.getPageObjectStructureValue()).toBe('');
		expect(await settingsPage.getElementTypeTableRowCount()).toBe(0);
		expect(await settingsPage.getTemplateNameValue()).toBe('');
	});
	
	test('PageObject Structure: whitespace, Element Type Table: blank, Template Name: blank', async () => {
		await settingsPage.enterPageObjectStructure(' ');
		expect(await settingsPage.getPageObjectStructureValue()).toBe(' ');
		expect(await settingsPage.getElementTypeTableRowCount()).toBe(0);
		expect(await settingsPage.getTemplateNameValue()).toBe('');
	});

	test('PageObject Structure: blank, Element Type Table: populated, Template Name: blank', async () => {
		expect(await settingsPage.getPageObjectStructureValue()).toBe('');
		await settingsPage.enterElementType('TestElement');
		expect(await settingsPage.getElementTypeValue()).toBe('TestElement');
		await settingsPage.enterGeneralMethodTemplate('TestGeneralMethod');
		expect(await settingsPage.getGeneralMethodTemplateValue()).toBe('TestGeneralMethod');
		await settingsPage.clickAddElementTypeToTableButton();
		expect(await settingsPage.getElementTypeTableRowCount()).toBe(1);
		expect(await settingsPage.getTemplateNameValue()).toBe('');
	});
	
	test('PageObject Structure: whitespace, Element Type Table: populated, Template Name: blank', async () => {
		await settingsPage.enterPageObjectStructure(' ');
		expect(await settingsPage.getPageObjectStructureValue()).toBe(' ');
		await settingsPage.enterElementType('TestElement');
		expect(await settingsPage.getElementTypeValue()).toBe('TestElement');
		await settingsPage.enterGeneralMethodTemplate('TestGeneralMethod');
		expect(await settingsPage.getGeneralMethodTemplateValue()).toBe('TestGeneralMethod');
		await settingsPage.clickAddElementTypeToTableButton();
		expect(await settingsPage.getElementTypeTableRowCount()).toBe(1);
		expect(await settingsPage.getTemplateNameValue()).toBe('');
	});

	test('PageObject Structure: blank, Element Type Table: blank, Template Name: whitespace', async () => {
		expect(await settingsPage.getPageObjectStructureValue()).toBe('');
		expect(await settingsPage.getElementTypeTableRowCount()).toBe(0);
		await settingsPage.enterTemplateName(' ');
		expect(await settingsPage.getTemplateNameValue()).toBe(' ');
	});
	
	test('PageObject Structure: whitespace, Element Type Table: populated, Template Name: whitespace', async () => {
		await settingsPage.enterPageObjectStructure(' ');
		expect(await settingsPage.getPageObjectStructureValue()).toBe(' ');
		await settingsPage.enterElementType('TestElement');
		expect(await settingsPage.getElementTypeValue()).toBe('TestElement');
		await settingsPage.enterGeneralMethodTemplate('TestGeneralMethod');
		expect(await settingsPage.getGeneralMethodTemplateValue()).toBe('TestGeneralMethod');
		await settingsPage.clickAddElementTypeToTableButton();
		expect(await settingsPage.getElementTypeTableRowCount()).toBe(1);
		await settingsPage.enterTemplateName(' ');
		expect(await settingsPage.getTemplateNameValue()).toBe(' ');
	});
});

test.describe('correct error is shown when clicking \'Save\' with no PageObject Structure entered', async () => {
	test.beforeEach(async () => {
		expectedErrorMsg = 'Unable to save template, PageObject structure is required.';
		await settingsPage.enterElementTemplate('TestElementTemplate');
		expect(await settingsPage.getElementTemplateValue()).toBe('TestElementTemplate');
		expect(await settingsPage.getPageObjectStructureValue()).toBe('');
	});

	test.afterEach(async () => {
		await settingsPage.clickSaveTemplateButton();
		expect(await settingsPage.isErrorMessageDisplayed(), 'error element is incorrectly hidden').toBe(true);
		expect(await settingsPage.getErrorMessageValue(), 'error element text is blank').toBe(expectedErrorMsg);
	});

	test('Element Type Table: blank, Template Name: blank', async () => {
		expect(await settingsPage.getElementTypeTableRowCount()).toBe(0);
		expect(await settingsPage.getTemplateNameValue()).toBe('');
	});
	
	test('Element Type Table: populated, Template Name: blank', async () => {
		await settingsPage.enterElementType('TestElement');
		expect(await settingsPage.getElementTypeValue()).toBe('TestElement');
		await settingsPage.enterGeneralMethodTemplate('TestGeneralMethod');
		expect(await settingsPage.getGeneralMethodTemplateValue()).toBe('TestGeneralMethod');
		await settingsPage.clickAddElementTypeToTableButton();
		expect(await settingsPage.getElementTypeTableRowCount()).toBe(1);
		expect(await settingsPage.getTemplateNameValue()).toBe('');
	});

	test('Element Type Table: blank, Template Name: whitespace', async () => {
		expect(await settingsPage.getElementTypeTableRowCount()).toBe(0);
		await settingsPage.enterTemplateName(' ');
		expect(await settingsPage.getTemplateNameValue()).toBe(' ');
	});
	
	test('Element Type Table: populated, Template Name: whitespace', async () => {
		await settingsPage.enterElementType('TestElement');
		expect(await settingsPage.getElementTypeValue()).toBe('TestElement');
		await settingsPage.enterGeneralMethodTemplate('TestGeneralMethod');
		expect(await settingsPage.getGeneralMethodTemplateValue()).toBe('TestGeneralMethod');
		await settingsPage.clickAddElementTypeToTableButton();
		expect(await settingsPage.getElementTypeTableRowCount()).toBe(1);
		expect(await settingsPage.getTemplateNameValue()).toBe('');
	});

	test('Element Type Table: blank, Template Name: populated', async () => {
		expect(await settingsPage.getElementTypeTableRowCount()).toBe(0);
		await settingsPage.enterTemplateName('TestTemplateName');
		expect(await settingsPage.getTemplateNameValue()).toBe('TestTemplateName');
	});

	test('Element Type Table: populated, Template Name: populated', async () => {
		await settingsPage.enterElementType('TestElement');
		expect(await settingsPage.getElementTypeValue()).toBe('TestElement');
		await settingsPage.enterGeneralMethodTemplate('TestGeneralMethod');
		expect(await settingsPage.getGeneralMethodTemplateValue()).toBe('TestGeneralMethod');
		await settingsPage.clickAddElementTypeToTableButton();
		expect(await settingsPage.getElementTypeTableRowCount()).toBe(1);
		await settingsPage.enterTemplateName('TestTemplateName');
		expect(await settingsPage.getTemplateNameValue()).toBe('TestTemplateName');
	});
});

test.describe('correct error is shown when clicking \'Save\' with the element type table blank', async () => {
	test.beforeEach(async () => {
		expectedErrorMsg = 'Unable to save template, element table cannot be empty.';
		await settingsPage.enterElementTemplate('TestElementTemplate');
		expect(await settingsPage.getElementTemplateValue()).toBe('TestElementTemplate');
		await settingsPage.enterPageObjectStructure('TestPageObjectStructure');
		expect(await settingsPage.getPageObjectStructureValue()).toBe('TestPageObjectStructure');
		expect(await settingsPage.getElementTypeTableRowCount()).toBe(0);
	});

	test.afterEach(async () => {
		await settingsPage.clickSaveTemplateButton();
		expect(await settingsPage.isErrorMessageDisplayed(), 'error element is incorrectly hidden').toBe(true);
		expect(await settingsPage.getErrorMessageValue(), 'error element text is blank').toBe(expectedErrorMsg);
	});

	test('Template Name: blank', async () => {
		expect(await settingsPage.getTemplateNameValue()).toBe('');
	});
	
	test('Template Name: whitespace', async () => {
		await settingsPage.enterTemplateName(' ');
		expect(await settingsPage.getTemplateNameValue()).toBe(' ');
	});

	test('Template Name: populated', async () => {
		await settingsPage.enterTemplateName('TestTemplateName');
		expect(await settingsPage.getTemplateNameValue()).toBe('TestTemplateName');
	});
});

test.describe('correct error is shown when clicking \'Save\' with no Template Name entered', async () => {
	test.beforeEach(async () => {
		expectedErrorMsg = 'Unable to save template, template name is required.';
		await settingsPage.enterElementTemplate('TestElementTemplate');
		expect(await settingsPage.getElementTemplateValue()).toBe('TestElementTemplate');
		await settingsPage.enterPageObjectStructure('TestPageObjectStructure');
		expect(await settingsPage.getPageObjectStructureValue()).toBe('TestPageObjectStructure');
		await settingsPage.enterElementType('TestElement');
		expect(await settingsPage.getElementTypeValue()).toBe('TestElement');
		await settingsPage.enterGeneralMethodTemplate('TestGeneralMethod');
		expect(await settingsPage.getGeneralMethodTemplateValue()).toBe('TestGeneralMethod');
		await settingsPage.clickAddElementTypeToTableButton();
		expect(await settingsPage.getElementTypeTableRowCount()).toBe(1);
	});

	test.afterEach(async () => {
		await settingsPage.clickSaveTemplateButton();
		expect(await settingsPage.isErrorMessageDisplayed(), 'error element is incorrectly hidden').toBe(true);
		expect(await settingsPage.getErrorMessageValue(), 'error element text is blank').toBe(expectedErrorMsg);
	});

	test('Template Name: blank', async () => {
		expect(await settingsPage.getTemplateNameValue()).toBe('');
	});
	
	test('Template Name: whitespace', async () => {
		await settingsPage.enterTemplateName(' ');
		expect(await settingsPage.getTemplateNameValue()).toBe(' ');
	});
});

test.describe('no error is shown when clicking \'Save\' with element declaration, PageObject Structure, element type table and Template Name populated', async () => {
	test('Template Name: blank', async () => {
		await settingsPage.enterElementTemplate('TestElementTemplate');
		expect(await settingsPage.getElementTemplateValue()).toBe('TestElementTemplate');
		await settingsPage.enterPageObjectStructure('TestPageObjectStructure');
		expect(await settingsPage.getPageObjectStructureValue()).toBe('TestPageObjectStructure');
		await settingsPage.enterElementType('TestElement');
		expect(await settingsPage.getElementTypeValue()).toBe('TestElement');
		await settingsPage.enterGeneralMethodTemplate('TestGeneralMethod');
		expect(await settingsPage.getGeneralMethodTemplateValue()).toBe('TestGeneralMethod');
		await settingsPage.clickAddElementTypeToTableButton();
		expect(await settingsPage.getElementTypeTableRowCount()).toBe(1);
		await settingsPage.enterTemplateName('TestTemplateName');
		expect(await settingsPage.getTemplateNameValue()).toBe('TestTemplateName');
		await settingsPage.clickSaveTemplateButton();
		expect(await settingsPage.isErrorMessageDisplayed(), 'error element is incorrectly visible').toBe(false);
		expect(await settingsPage.getErrorMessageValue(), 'error element text is not blank').toBe('');
	});
});
