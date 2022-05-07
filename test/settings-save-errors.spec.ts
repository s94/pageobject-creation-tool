import { ElectronApplication, test } from '@playwright/test';
import { getTestElectronApp } from './electron-test-setup';
import { SettingsPageError } from './enum/settings-page-error';
import { IndexPage } from './page/index-page';
import { SettingsPage } from './page/settings-page';
import { SettingsService } from './service/settings-service';
import { ElementType, PageObjectTemplate } from './test-types';
import { TestData } from './test-data';

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
	await electronApp.close();
});

test.describe('correct error is shown when clicking \'Save\' with no PageObject Structure entered', async () => {
	test.afterEach(async () => {
		await settingsService.checkForErrors(SettingsPageError.UnableToSave_PageObjectStructureRequired);
	});

	test('Template Name: blank, Element Type Table: blank', async () => {
		const pageObjectTemplate: PageObjectTemplate = {
			templateName: TestData.Blank,
			elementTemplate: TestData.Populated,
			pageObjectStructure: TestData.Blank,
			elementTypes: []
		};

		await settingsService.createTemplate(pageObjectTemplate);
	});
	
	test('Template Name: blank, Element Type Table: populated', async () => {
		const elementType: ElementType = {
			elementTypeName: TestData.Populated,
			generalMethodTemplate: TestData.Populated
		};
		const pageObjectTemplate: PageObjectTemplate = {
			templateName: TestData.Blank,
			elementTemplate: TestData.Populated,
			pageObjectStructure: TestData.Blank,
			elementTypes: [elementType]
		};

		await settingsService.createTemplate(pageObjectTemplate);
	});

	test('Template Name: whitespace, Element Type Table: blank', async () => {
		const pageObjectTemplate: PageObjectTemplate = {
			templateName: TestData.Whitespace,
			elementTemplate: TestData.Populated,
			pageObjectStructure: TestData.Blank,
			elementTypes: []
		};

		await settingsService.createTemplate(pageObjectTemplate);
	});
	
	test('Template Name: whitespace, Element Type Table: populated', async () => {
		const elementType: ElementType = {
			elementTypeName: TestData.Populated,
			generalMethodTemplate: TestData.Populated
		};
		const pageObjectTemplate: PageObjectTemplate = {
			templateName: TestData.Whitespace,
			elementTemplate: TestData.Populated,
			pageObjectStructure: TestData.Blank,
			elementTypes: [elementType]
		};

		await settingsService.createTemplate(pageObjectTemplate);
	});

	test('Template Name: populated, Element Type Table: blank', async () => {
		const pageObjectTemplate: PageObjectTemplate = {
			templateName: TestData.uniqueTestTemplateName(),
			elementTemplate: TestData.Populated,
			pageObjectStructure: TestData.Blank,
			elementTypes: []
		};

		await settingsService.createTemplate(pageObjectTemplate);
	});

	test('Template Name: populated, Element Type Table: populated', async () => {
		const elementType: ElementType = {
			elementTypeName: TestData.Populated,
			generalMethodTemplate: TestData.Populated
		};
		const pageObjectTemplate: PageObjectTemplate = {
			templateName: TestData.uniqueTestTemplateName(),
			elementTemplate: TestData.Populated,
			pageObjectStructure: TestData.Blank,
			elementTypes: [elementType]
		};

		await settingsService.createTemplate(pageObjectTemplate);
	});
});

test.describe('correct error is shown when clicking \'Save\' with the element type table blank', async () => {
	test.afterEach(async () => {
		await settingsService.checkForErrors(SettingsPageError.UnableToSave_EmptyElementTable);
	});

	test('Template Name: blank', async () => {
		const pageObjectTemplate: PageObjectTemplate = {
			templateName: TestData.Blank,
			elementTemplate: TestData.Populated,
			pageObjectStructure: TestData.Populated,
			elementTypes: []
		};

		await settingsService.createTemplate(pageObjectTemplate);
	});
	
	test('Template Name: whitespace', async () => {
		const pageObjectTemplate: PageObjectTemplate = {
			templateName: TestData.Whitespace,
			elementTemplate: TestData.Populated,
			pageObjectStructure: TestData.Populated,
			elementTypes: []
		};

		await settingsService.createTemplate(pageObjectTemplate);
	});

	test('Template Name: populated', async () => {
		const pageObjectTemplate: PageObjectTemplate = {
			templateName: TestData.uniqueTestTemplateName(),
			elementTemplate: TestData.Populated,
			pageObjectStructure: TestData.Populated,
			elementTypes: []
		};

		await settingsService.createTemplate(pageObjectTemplate);
	});
});

test.describe('correct error is shown when clicking \'Save\' with no Template Name entered', async () => {
	test.afterEach(async () => {
		await settingsService.checkForErrors(SettingsPageError.UnableToSave_TemplateNameRequired);
	});

	test('Template Name: blank', async () => {
		const elementType: ElementType = {
			elementTypeName: TestData.Populated,
			generalMethodTemplate: TestData.Populated
		};
		const pageObjectTemplate: PageObjectTemplate = {
			templateName: TestData.Blank,
			elementTemplate: TestData.Populated,
			pageObjectStructure: TestData.Populated,
			elementTypes: [elementType]
		};

		await settingsService.createTemplate(pageObjectTemplate);
	});
	
	test('Template Name: whitespace', async () => {
		const elementType: ElementType = {
			elementTypeName: TestData.Populated,
			generalMethodTemplate: TestData.Populated
		};
		const pageObjectTemplate: PageObjectTemplate = {
			templateName: TestData.Whitespace,
			elementTemplate: TestData.Populated,
			pageObjectStructure: TestData.Populated,
			elementTypes: [elementType]
		};

		await settingsService.createTemplate(pageObjectTemplate);
	});
});

test.describe('no error is shown when clicking \'Save\' with PageObject Structure, element type table and Template Name populated', async () => {
	test.afterEach(async () => {
		await settingsService.checkForErrors(SettingsPageError.Blank);
	});

	test('Element Declaration: blank', async () => {
		const elementType: ElementType = {
			elementTypeName: TestData.Populated,
			generalMethodTemplate: TestData.Populated
		};
		const pageObjectTemplate: PageObjectTemplate = {
			templateName: TestData.uniqueTestTemplateName(),
			elementTemplate: TestData.Blank,
			pageObjectStructure: TestData.Populated,
			elementTypes: [elementType]
		};
		
		await settingsService.createTemplate(pageObjectTemplate);
	});

	test('Element Declaration: whitespace', async () => {
		const elementType: ElementType = {
			elementTypeName: TestData.Populated,
			generalMethodTemplate: TestData.Populated
		};
		const pageObjectTemplate: PageObjectTemplate = {
			templateName: TestData.uniqueTestTemplateName(),
			elementTemplate: TestData.Whitespace,
			pageObjectStructure: TestData.Populated,
			elementTypes: [elementType]
		};
		
		await settingsService.createTemplate(pageObjectTemplate);
	});
});

test('no error is shown when clicking \'Save\' with element declaration, PageObject Structure, element type table and Template Name populated', async () => {
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
});
