import { ElectronApplication, test } from '@playwright/test';
import { getTestElectronApp } from './electron-test-setup';
import { SettingsPageError } from './enum/settings-page-error';
import { IndexPage } from './page/index-page';
import { SettingsPage } from './page/settings-page';
import { SettingsService } from './service/settings-service';
import { ElementType, PageObjectTemplate } from './test-types';
import { TestData } from './test-data';

let electronApp: ElectronApplication;
let settingsService: SettingsService;

test.beforeEach(async () => {
	electronApp = await getTestElectronApp();

	const indexPage = new IndexPage(await electronApp.firstWindow());
	await indexPage.clickSettingsLink();
	const settingsPage = new SettingsPage(await electronApp.firstWindow());
	settingsService = new SettingsService(settingsPage);
});

test.afterEach(async () => {
	await electronApp.close();
});

test('correct error is shown when clicking \'Delete\' with no Template selected', async () => {
	await settingsService.deleteTemplate(TestData.Blank);
	await settingsService.checkForErrors(SettingsPageError.UnableToDelete);
});

test('no error is shown when clicking \'Delete\' with a Template selected', async () => {
	const testElementType: ElementType = {
		elementTypeName: TestData.Populated,
		generalMethodTemplate: TestData.Populated
	};
	const testPageObjectTemplate: PageObjectTemplate = {
		templateName: TestData.uniqueTestTemplateName(),
		elementTemplate: TestData.Populated, 
		elementTypes: [testElementType],
		pageObjectStructure: TestData.Populated
	};

	await settingsService.createTemplate(testPageObjectTemplate);
	await settingsService.deleteTemplate(testPageObjectTemplate.templateName);
	await settingsService.checkForErrors(SettingsPageError.Blank);
});
