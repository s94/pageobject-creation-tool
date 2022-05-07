import { ElectronApplication, expect, test } from '@playwright/test';
import { getTestElectronApp } from './electron-test-setup';
import { SelectListAttribute } from './enum/select-list-attribute';
import { SettingsPageError } from './enum/settings-page-error';
import { IndexPage } from './page/index-page';
import { SettingsPage } from './page/settings-page';
import { SettingsService } from './service/settings-service';
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

test('correct error is shown when clicking \'Edit\' with no Template selected', async () => {
	expect(await settingsPage.getTemplateListValue(SelectListAttribute.Value)).toBe('0');
	await settingsPage.clickEditTemplateButton();
	await settingsService.checkForErrors(SettingsPageError.UnableToEdit);
});

test('no error is shown when clicking \'Edit\' with a Template selected', async () => {
	await settingsPage.selectTemplate(TestData.ExampleTemplate.Name, SelectListAttribute.Label);
	expect(await settingsPage.getTemplateListValue(SelectListAttribute.Value)).toBe('1');
	await settingsPage.clickEditTemplateButton();
	await settingsService.checkForErrors(SettingsPageError.Blank);
});
