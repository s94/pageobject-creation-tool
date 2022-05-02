import { ElectronApplication, expect, test } from '@playwright/test';
import { getTestElectronApp } from './electron-test-setup';
import { SettingsPageError } from './enum/settings-page-error';
import { IndexPage } from './page/index-page';
import { SettingsPage } from './page/settings-page';
import { SettingsService } from './service/settings-service';
import { TestData } from './test-data';
import { ElementType } from './test-types';

let electronApp: ElectronApplication;
let settingsPage: SettingsPage;
let settingsService: SettingsService;

test.beforeEach(async () => {
	electronApp = await getTestElectronApp();

	const indexPage = new IndexPage(await electronApp.firstWindow());
	await indexPage.clickSettingsLink();
	settingsPage = new SettingsPage(await electronApp.firstWindow());
	settingsService = new SettingsService(settingsPage);
	await settingsService.checkForErrors(SettingsPageError.Blank);
});

test.afterEach(async () => {
	expect(await settingsService.checkForErrors(SettingsPageError.Blank));
	await electronApp.close();
});

test('edit element type from table', async () => {
	let elementTypesArray: ElementType[] = [
		{
			elementTypeName: TestData.ExampleTemplate.ElementType_Button,
			generalMethodTemplate: TestData.Populated
		},
		{
			elementTypeName: TestData.ExampleTemplate.ElementType_Textbox,
			generalMethodTemplate: TestData.Populated,
			getMethodTemplate: TestData.Populated
		},
		{
			elementTypeName: TestData.ExampleTemplate.ElementType_Button,
			generalMethodTemplate: TestData.Populated
		}
	]
	const editedElementType: ElementType = {
		elementTypeName: 'EditedElementType',
		generalMethodTemplate: 'EditedGeneralMethodTemplate',
		getMethodTemplate: 'EditedGetMethodTemplate'
	}

	await settingsService.addElementTypesToTable(elementTypesArray);
	await settingsService.editElementTypeFromTable(2, elementTypesArray[1], editedElementType);

	elementTypesArray[1] = editedElementType;
	await settingsService.verifyElementTypesWithinTable(elementTypesArray);
});

test('remove element type from table', async () => {
	const elementTypesArray: ElementType[] = [
		{
			elementTypeName: TestData.ExampleTemplate.ElementType_Button,
			generalMethodTemplate: TestData.Populated
		},
		{
			elementTypeName: TestData.ExampleTemplate.ElementType_Textbox,
			generalMethodTemplate: TestData.Populated,
			getMethodTemplate: TestData.Populated
		},
		{
			elementTypeName: TestData.ExampleTemplate.ElementType_Button,
			generalMethodTemplate: TestData.Populated
		}
	]

	await settingsService.addElementTypesToTable(elementTypesArray);
	await settingsService.verifyElementTypesWithinTable(elementTypesArray);
	await settingsPage.clickRemoveElementTypeFromTableButton(2);
	expect(await settingsPage.getElementTypeTableRowCount()).toBe(2);

	const updatedElementTypeArray: ElementType[] = [elementTypesArray[0], elementTypesArray[2]];
	await settingsService.verifyElementTypesWithinTable(updatedElementTypeArray);
});

test('removing element type whilst editing resets the add element type form', async () => {
	const elementType: ElementType = {
		elementTypeName: TestData.ExampleTemplate.ElementType_Textbox,
		generalMethodTemplate: TestData.Populated,
		getMethodTemplate: TestData.Populated
	}

	await settingsService.addElementTypesToTable([elementType]);
	await settingsPage.clickEditElementTypeFromTableButton(1);
	expect(await settingsPage.getAddElementTypeToTableButtonValue()).toBe('Update');
	await settingsService.verifyElementTypeWithinForm(elementType);

	await settingsPage.clickRemoveElementTypeFromTableButton(1);
	expect(await settingsPage.getAddElementTypeToTableButtonValue()).toBe('Add');
	expect(await settingsPage.getElementTypeValue()).toBe('');
	expect(await settingsPage.getGeneralMethodTemplateValue()).toBe('');
	expect(await settingsPage.getGetMethodTemplateValue()).toBe('');
});

test('removing element type when not editing doesn\'t reset the add element type form', async () => {
	const elementType: ElementType = {
		elementTypeName: TestData.ExampleTemplate.ElementType_Textbox,
		generalMethodTemplate: TestData.Populated,
		getMethodTemplate: TestData.Populated
	}
	const newElementType: ElementType = {
		elementTypeName: TestData.ExampleTemplate.ElementType_Button,
		generalMethodTemplate: 'NewGeneralMethodTemplate',
		getMethodTemplate: 'NewGetMethodTemplate'
	}

	await settingsService.addElementTypesToTable([elementType]);

	await settingsPage.enterElementType(newElementType.elementTypeName);
	await settingsPage.enterGeneralMethodTemplate(newElementType.generalMethodTemplate);
	await settingsPage.enterGetMethodTemplate(newElementType.getMethodTemplate);
	
	await settingsPage.clickRemoveElementTypeFromTableButton(1);
	expect(await settingsPage.getAddElementTypeToTableButtonValue()).toBe('Add');
	await settingsService.verifyElementTypeWithinForm(newElementType);
});
