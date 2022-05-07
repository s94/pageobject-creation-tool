import { ElectronApplication, expect, test } from '@playwright/test';
import { getTestElectronApp } from './electron-test-setup';
import { SelectListAttribute } from './enum/select-list-attribute';
import { SettingsPageError } from './enum/settings-page-error';
import { IndexPage } from './page/index-page';
import { SettingsPage } from './page/settings-page';
import { SettingsService } from './service/settings-service';
import { TestData } from './test-data';
import { ElementType, PageObjectTemplate } from './test-types';

let electronApp: ElectronApplication;
let indexPage: IndexPage;
let settingsPage: SettingsPage;
let settingsService: SettingsService;

test.beforeEach(async () => {
	electronApp = await getTestElectronApp();

	indexPage = new IndexPage(await electronApp.firstWindow());
	await indexPage.clickSettingsLink();
	settingsPage = new SettingsPage(await electronApp.firstWindow());
	settingsService = new SettingsService(settingsPage);
	await settingsService.checkForErrors(SettingsPageError.Blank);
});

test.afterEach(async () => {
	await electronApp.close();
});

test('created template is retained when reopening the app', async () => {
	const elementType: ElementType = {
		elementTypeName: TestData.Populated,
		generalMethodTemplate: TestData.Populated
	};
	const pageObjectTemplate: PageObjectTemplate = {
		templateName: TestData.uniqueTestTemplateName(),
		elementTemplate: TestData.Populated,
		pageObjectStructure: TestData.Populated,
		elementTypes: [elementType]
	};
	
	await settingsService.createTemplate(pageObjectTemplate);
	await settingsService.checkForErrors(SettingsPageError.Blank);
	await electronApp.close();
	electronApp = await getTestElectronApp();
	indexPage = new IndexPage(await electronApp.firstWindow());
	await indexPage.selectTemplate(pageObjectTemplate.templateName, SelectListAttribute.Label);
	expect(await indexPage.getTemplateListValue(SelectListAttribute.Label)).toContain(pageObjectTemplate.templateName);
});

test('create template > edit template > verify edit', async () => {
	const testTemplateName: string = TestData.uniqueTestTemplateName();
	const elementType: ElementType = {
		elementTypeName: TestData.Populated,
		generalMethodTemplate: TestData.Populated
	};
	const pageObjectTemplate: PageObjectTemplate = {
		templateName: testTemplateName,
		elementTemplate: TestData.Populated,
		pageObjectStructure: TestData.Populated,
		elementTypes: [elementType]
	};
	
	await settingsService.createTemplate(pageObjectTemplate);
	await settingsService.checkForErrors(SettingsPageError.Blank);

	await settingsPage.clickHomeLink();
	await indexPage.clickSettingsLink();
	await settingsService.checkForErrors(SettingsPageError.Blank);

	const editedElementType: ElementType = {
		elementTypeName: 'NewElementTypeName',
		generalMethodTemplate: 'NewGeneralMethodTemplate'
	};
	const editedPageObjectTemplate: PageObjectTemplate = {
		templateName: testTemplateName,
		elementTemplate: 'EditedElementTemplate',
		pageObjectStructure: 'EditedPageObjectStructure',
		elementTypes: [editedElementType]
	};

	await settingsService.editTemplate(editedPageObjectTemplate, pageObjectTemplate.elementTypes.length);
	await settingsService.checkForErrors(SettingsPageError.Blank);

	await settingsPage.clickHomeLink();
	await indexPage.clickSettingsLink();

	await settingsPage.selectTemplate(testTemplateName, SelectListAttribute.Label);
	expect(await settingsPage.getTemplateListValue(SelectListAttribute.Label)).toContain(testTemplateName);
	await settingsPage.clickEditTemplateButton();
	await settingsService.checkForErrors(SettingsPageError.Blank);
	expect(await settingsPage.getTemplateNameValue()).toBe(editedPageObjectTemplate.templateName);
	expect(await settingsPage.getElementTemplateValue()).toBe(editedPageObjectTemplate.elementTemplate);
	expect(await settingsPage.getPageObjectStructureValue()).toBe(editedPageObjectTemplate.pageObjectStructure);
	const expectedRowCount: number = (pageObjectTemplate.elementTypes.length + editedPageObjectTemplate.elementTypes.length);
	expect(await settingsPage.getElementTypeTableRowCount()).toBe(expectedRowCount);
});
