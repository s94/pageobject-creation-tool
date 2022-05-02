import { ElectronApplication, expect, test } from '@playwright/test';
import { getTestElectronApp } from './electron-test-setup';
import { IndexPageError } from './enum/index-page-error';
import { SelectListAttribute } from './enum/select-list-attribute';
import { IndexPage } from './page/index-page';
import { IndexService } from './service/index-service';
import { TestData } from './test-data';
import { PageObjectElement } from './test-types';

let electronApp: ElectronApplication;
let indexPage: IndexPage;
let indexService: IndexService;

test.beforeEach(async () => {
	electronApp = await getTestElectronApp();

	indexPage = new IndexPage(await electronApp.firstWindow());
	indexService = new IndexService(indexPage);
	await indexService.checkForErrors(IndexPageError.Blank);
	await indexPage.selectTemplate(TestData.ExampleTemplate.Name, SelectListAttribute.Label);
	expect(await indexPage.getTemplateListValue(SelectListAttribute.Value)).toBe('1');
});

test.afterEach(async () => {
	expect(await indexService.checkForErrors(IndexPageError.Blank));
	await electronApp.close();
});

test('edit element from table', async () => {
	let pageObjectElementArray: PageObjectElement[] = [
		{
			elementName: 'elementOne',
			elementType: TestData.ExampleTemplate.ElementType_Button
		},
		{
			elementName: 'elementTwo',
			elementType: TestData.ExampleTemplate.ElementType_Textbox,
			elementId: TestData.Populated,
			includeGet: true
		},
		{
			elementName: 'elementThree',
			elementType: TestData.ExampleTemplate.ElementType_Textbox,
			elementId: TestData.Populated,
			includeGet: true
		}
	]
	const editedPageObjectElement: PageObjectElement = {
		elementName: 'elementTwoEdited',
		elementType: TestData.ExampleTemplate.ElementType_Button,
		elementId: 'elementIdEdited',
		includeGet: false
	}

	await indexService.addElementsToTable(pageObjectElementArray);
	await indexService.editElementFromTable(2, pageObjectElementArray[1], editedPageObjectElement);

	pageObjectElementArray[1] = editedPageObjectElement;
	await indexService.verifyElementsWithinTable(pageObjectElementArray);
});

test('remove element from table', async () => {
	const pageObjectElementArray: PageObjectElement[] = [
		{
			elementName: 'elementOne',
			elementType: TestData.ExampleTemplate.ElementType_Button
		},
		{
			elementName: 'elementTwo',
			elementType: TestData.ExampleTemplate.ElementType_Textbox,
			elementId: TestData.Populated,
			includeGet: true
		},
		{
			elementName: 'elementThree',
			elementType: TestData.ExampleTemplate.ElementType_Textbox,
			elementId: TestData.Populated,
			includeGet: true
		}
	]

	await indexService.addElementsToTable(pageObjectElementArray);
	await indexService.verifyElementsWithinTable(pageObjectElementArray);
	await indexPage.clickRemoveElementFromTableButton(2);
	expect(await indexPage.getElementTableRowCount()).toBe(2);

	const updatedPageObjectElementArray: PageObjectElement[] = [pageObjectElementArray[0], pageObjectElementArray[2]];
	await indexService.verifyElementsWithinTable(updatedPageObjectElementArray);
});

test('removing element whilst editing resets the add element form', async () => {
	const pageObjectElement: PageObjectElement = {
		elementName: TestData.Populated,
		elementType: TestData.ExampleTemplate.ElementType_Textbox,
		elementId: TestData.Populated,
		includeGet: true
	}

	await indexService.addElementsToTable([pageObjectElement]);
	await indexPage.clickEditElementFromTableButton(1);
	expect(await indexPage.getAddElementToTableButtonValue()).toBe('Update');
	await indexService.verifyElementWithinForm(pageObjectElement);

	await indexPage.clickRemoveElementFromTableButton(1);
	expect(await indexPage.getAddElementToTableButtonValue()).toBe('Add');
	expect(await indexPage.getElementNameValue()).toBe('');
	expect(await indexPage.getElementTypeValue(SelectListAttribute.Value)).toBe('');
	expect(await indexPage.getElementIdValue()).toBe('');
	expect(await indexPage.isIncludeGetChecked()).toBe(false);
});

test('removing element when not editing doesn\'t reset the add element form', async () => {
	const pageObjectElement: PageObjectElement = {
		elementName: TestData.Populated,
		elementType: TestData.ExampleTemplate.ElementType_Textbox,
		elementId: TestData.Populated,
		includeGet: true
	}
	const newPageObjectElement: PageObjectElement = {
		elementName: 'NewElementName',
		elementType: TestData.ExampleTemplate.ElementType_Button,
		elementId: 'NewElementId',
		includeGet: false
	}

	await indexService.addElementsToTable([pageObjectElement]);

	await indexPage.selectElementType(newPageObjectElement.elementType, SelectListAttribute.Label);
	await indexPage.enterElementName(newPageObjectElement.elementName);
	await indexPage.enterElementId(newPageObjectElement.elementId);
	await indexPage.toggleIncludeGetCheckbox(newPageObjectElement.includeGet);
	
	await indexPage.clickRemoveElementFromTableButton(1);
	expect(await indexPage.getAddElementToTableButtonValue()).toBe('Add');
	await indexService.verifyElementWithinForm(newPageObjectElement);
});
