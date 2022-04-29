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
	await indexService.checkForErrors(IndexPageError.Blank)
	await indexPage.selectTemplate(TestData.ExampleTemplate.Name, SelectListAttribute.Label);
	expect(await indexPage.getTemplateListValue(SelectListAttribute.Value)).toBe('1');
});

test.afterEach(async () => {
	await electronApp.close();
});

test.describe('correct error is shown when clicking \'Add\' with Element Name and/or Element Type not populated', async () => {
	test.afterEach(async () => {
		await indexService.checkForErrors(IndexPageError.UnableToAdd);
	});

	test('Element Name: blank, Element Type: blank', async () => {
		const pageObjectElement: PageObjectElement = {
			elementName: TestData.Blank,
			elementType: TestData.Blank
		}

		await indexService.addElementsToTable([pageObjectElement]);
	});

	test('Element Name: whitespace, Element Type: blank', async () => {
		const pageObjectElement: PageObjectElement = {
			elementName: TestData.Whitespace,
			elementType: TestData.Blank
		}

		await indexService.addElementsToTable([pageObjectElement]);
	});

	test('Element Name: populated, Element Type: blank', async () => {
		const pageObjectElement: PageObjectElement = {
			elementName: TestData.Populated,
			elementType: TestData.Blank
		}

		await indexService.addElementsToTable([pageObjectElement]);
	});

	test('Element Name: blank, Element Type: populated', async () => {
		const pageObjectElement: PageObjectElement = {
			elementName: TestData.Blank,
			elementType: TestData.ExampleTemplate.ElementType
		}

		await indexService.addElementsToTable([pageObjectElement]);
	});

	test('Element Name: whitespace, Element Type: populated', async () => {
		const pageObjectElement: PageObjectElement = {
			elementName: TestData.Whitespace,
			elementType: TestData.ExampleTemplate.ElementType
		}

		await indexService.addElementsToTable([pageObjectElement]);
	});
});

test.describe('no error is shown when clicking \'Add\' when Element Name and Element Type are populated', async () => {
	test('Element Name: populated, Element Type: populated', async () => {
		const pageObjectElement: PageObjectElement = {
			elementName: TestData.Populated,
			elementType: TestData.ExampleTemplate.ElementType
		}

		await indexService.addElementsToTable([pageObjectElement]);
	});
});
