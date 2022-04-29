import { ElectronApplication, expect, test } from '@playwright/test';
import { getTestElectronApp } from './electron-test-setup';
import { IndexPageError } from './enum/index-page-error';
import { SelectListAttribute } from './enum/select-list-attribute';
import { IndexPage } from './page/index-page';
import { IndexService } from './service/index-service';
import { TestData } from './test-data';
import { PageObject, PageObjectElement } from './test-types';

let electronApp: ElectronApplication;
let indexPage: IndexPage;
let indexService: IndexService;

test.beforeEach(async () => {
	electronApp = await getTestElectronApp();

	indexPage = new IndexPage(await electronApp.firstWindow());
	indexService = new IndexService(indexPage);
	await indexService.checkForErrors(IndexPageError.Blank);
});

test.afterEach(async () => {
	await electronApp.close();
});

test.describe('correct error is shown when clicking \'Generate\' with no template selected', async () => {
	test.afterEach(async () => {
		await indexService.checkForErrors(IndexPageError.UnableToGenerate_TemplateRequired);
	});

	test('PageObject Name: blank, Element Table: blank', async () => {
		const pageObject: PageObject = {
			templateName: TestData.Blank,
			pageObjectName: TestData.Blank,
			pageObjectElements: []
		};

		await indexService.generatePageObject(pageObject);
	});

	test('PageObject Name: whitespace, Element Table: blank', async () => {
		const pageObject: PageObject = {
			templateName: TestData.Blank,
			pageObjectName: TestData.Whitespace,
			pageObjectElements: []
		};

		await indexService.generatePageObject(pageObject);
	});
	
	test('PageObject Name: populated, Element Table: blank', async () => {
		const pageObject: PageObject = {
			templateName: TestData.Blank,
			pageObjectName: TestData.Populated,
			pageObjectElements: []
		};

		await indexService.generatePageObject(pageObject);
	});
	
	test('PageObject Name: blank, Element Table: populated', async () => {
		const pageObjectElement: PageObjectElement = {
			elementType: TestData.ExampleTemplate.ElementType,
			elementName: TestData.Populated
		};
		const pageObject: PageObject = {
			templateName: TestData.ExampleTemplate.Name,
			pageObjectName: TestData.Blank,
			pageObjectElements: [pageObjectElement]
		};

		await indexService.generatePageObject(pageObject, false);
		await indexPage.selectTemplate('0', SelectListAttribute.Value);
		expect(await indexPage.getTemplateListValue(SelectListAttribute.Value)).toBe('0');
		await indexPage.clickGeneratePageObjectButton();
	});

	test('PageObject Name: whitespace, Element Table: populated', async () => {
		const pageObjectElement: PageObjectElement = {
			elementType: TestData.ExampleTemplate.ElementType,
			elementName: TestData.Populated
		};
		const pageObject: PageObject = { templateName: TestData.ExampleTemplate.Name,
			pageObjectName: TestData.Whitespace,
			pageObjectElements: [pageObjectElement]
		};

		await indexService.generatePageObject(pageObject, false);
		await indexPage.selectTemplate('0', SelectListAttribute.Value);
		expect(await indexPage.getTemplateListValue(SelectListAttribute.Value)).toBe('0');
		await indexPage.clickGeneratePageObjectButton();
	});
	
	test('PageObject Name: populated, Element Table: populated', async () => {
		const pageObjectElement: PageObjectElement = {
			elementType: TestData.ExampleTemplate.ElementType,
			elementName: TestData.Populated
		};
		const pageObject: PageObject = {
			templateName: TestData.ExampleTemplate.Name,
			pageObjectName: TestData.Populated,
			pageObjectElements: [pageObjectElement]
		};

		await indexService.generatePageObject(pageObject, false);
		await indexPage.selectTemplate('0', SelectListAttribute.Value);
		expect(await indexPage.getTemplateListValue(SelectListAttribute.Value)).toBe('0');
		await indexPage.clickGeneratePageObjectButton();
	});
});

test.describe('correct error is shown when clicking \'Generate\' with no PageObject name entered', async () => {
	test.afterEach(async () => {
		await indexService.checkForErrors(IndexPageError.UnableToGenerate_PageObjectNameRequired);
	});

	test('Template Name: populated, Element Table: blank', async () => {
		const pageObject: PageObject = { 
			templateName: TestData.ExampleTemplate.Name,
			pageObjectName: TestData.Blank,
			pageObjectElements: []
		};

		await indexService.generatePageObject(pageObject);
	});

	test('Template Name: populated, Element Table: populated', async () => {
		const pageObjectElement: PageObjectElement = {
			elementType: TestData.ExampleTemplate.ElementType,
			elementName: TestData.Populated
		};
		const pageObject: PageObject = {
			templateName: TestData.ExampleTemplate.Name,
			pageObjectName: TestData.Blank,
			pageObjectElements: [pageObjectElement]
		};

		await indexService.generatePageObject(pageObject);
	});
});

test.describe('correct error is shown when clicking \'Generate\' with the element table blank', async () => {
	test('Template Name: populated, PageObject Name: populated', async () => {
		const pageObject: PageObject = {
			templateName: TestData.ExampleTemplate.Name,
			pageObjectName: TestData.Populated,
			pageObjectElements: []
		};

		await indexService.generatePageObject(pageObject);
		await indexService.checkForErrors(IndexPageError.UnableToGenerate_EmptyElementTable);
	});
});

test.describe('no error is shown when clicking \'Generate\' when a template selected, PageObject Name and element table is populated', async () => {
	test('Template Name: populated, PageObject Name: populated, Element Table: populated', async () => {
		const pageObjectElement: PageObjectElement = {
			elementType: TestData.ExampleTemplate.ElementType,
			elementName: TestData.Populated
		};
		const pageObject: PageObject = {
			templateName: TestData.ExampleTemplate.Name,
			pageObjectName: TestData.Populated,
			pageObjectElements: [pageObjectElement]
		};

		await indexService.generatePageObject(pageObject);
		await indexService.checkForErrors(IndexPageError.Blank);
	});
});
