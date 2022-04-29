import { ElectronApplication, test } from '@playwright/test';
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
});

test.afterEach(async () => {
	await electronApp.close();
});

test.describe('correct error is shown when clicking \'Add\' with Element Type and/or General Method Template not populated', async () => {
	test.afterEach(async () => {
		await settingsService.checkForErrors(SettingsPageError.UnableToAdd);
	});

	test('Element Type: blank, General Method Template: blank', async () => {
		const elementTypeModel: ElementType = {
			elementTypeName: TestData.Blank,
			generalMethodTemplate: TestData.Blank
		};

		await settingsService.addElementsToTable([elementTypeModel]);
	});

	test('Element Type: whitespace, General Method Template: blank', async () => {
		const elementTypeModel: ElementType = {
			elementTypeName: TestData.Whitespace,
			generalMethodTemplate: TestData.Blank
		};

		await settingsService.addElementsToTable([elementTypeModel]);
	});

	test('Element Type: whitespace, General Method Template: whitespace', async () => {
		const elementTypeModel: ElementType = {
			elementTypeName: TestData.Whitespace,
			generalMethodTemplate: TestData.Whitespace
		};

		await settingsService.addElementsToTable([elementTypeModel]);
	});

	test('Element Type: populated, General Method Template: blank', async () => {
		const elementTypeModel: ElementType = {
			elementTypeName: TestData.Populated,
			generalMethodTemplate: TestData.Blank
		};

		await settingsService.addElementsToTable([elementTypeModel]);
	});

	test('Element Type: populated, General Method Template: whitespace', async () => {
		const elementTypeModel: ElementType = {
			elementTypeName: TestData.Populated,
			generalMethodTemplate: TestData.Whitespace
		};

		await settingsService.addElementsToTable([elementTypeModel]);
	});

	test('Element Type: blank, General Method Template: populated', async () => {
		const elementTypeModel: ElementType = {
			elementTypeName: TestData.Blank,
			generalMethodTemplate: TestData.Populated
		};

		await settingsService.addElementsToTable([elementTypeModel]);
	});

	test('Element Type: whitespace, General Method Template: populated', async () => {
		const elementTypeModel: ElementType = {
			elementTypeName: TestData.Whitespace,
			generalMethodTemplate: TestData.Populated
		};

		await settingsService.addElementsToTable([elementTypeModel]);
	});
});

test.describe('no error is shown when clicking \'Add\' with Element Type and General Method Template populated', async () => {
	test.afterEach(async () => {
		await settingsService.checkForErrors(SettingsPageError.Blank);
	});

	test('Element Type: populated, General Method Template: populated', async () => {
		const elementTypeModel: ElementType = {
			elementTypeName: TestData.Populated,
			generalMethodTemplate: TestData.Populated
		};

		await settingsService.addElementsToTable([elementTypeModel]);
	});

	test('Element Type: populated, General Method Template: populated, Get Method Template: blank', async () => {
		const elementTypeModel: ElementType = {
			elementTypeName: TestData.Populated,
			generalMethodTemplate: TestData.Populated,
			getMethodTemplate: TestData.Blank
		};

		await settingsService.addElementsToTable([elementTypeModel]);
	});

	test('Element Type: populated, General Method Template: populated, Get Method Template: whitespace', async () => {
		const elementTypeModel: ElementType = {
			elementTypeName: TestData.Populated,
			generalMethodTemplate: TestData.Populated,
			getMethodTemplate: TestData.Whitespace 
		};

		await settingsService.addElementsToTable([elementTypeModel]);
	});

	test('Element Type: populated, General Method Template: populated, Get Method Template: populated', async () => {
		const elementTypeModel: ElementType = {
			elementTypeName: TestData.Populated,
			generalMethodTemplate: TestData.Populated,
			getMethodTemplate: TestData.Populated
		};

		await settingsService.addElementsToTable([elementTypeModel]);
	});

	test('Element Type: populated, General Method Template: populated, Get Method Template: null', async () => {
		const elementTypeModel: ElementType = {
			elementTypeName: TestData.Populated,
			generalMethodTemplate: TestData.Populated,
			getMethodTemplate: null
		};

		await settingsService.addElementsToTable([elementTypeModel]);
	});

	test('Element Type: populated, General Method Template: populated, Get Method Template: undefined', async () => {
		const elementTypeModel: ElementType = {
			elementTypeName: TestData.Populated,
			generalMethodTemplate: TestData.Populated,
			getMethodTemplate: undefined
		};

		await settingsService.addElementsToTable([elementTypeModel]);
	});
});
