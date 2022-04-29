import { ElectronApplication, expect, test } from '@playwright/test';
import { getTestElectronApp } from './electron-test-setup';
import { SelectListAttribute } from './enum/select-list-attribute';
import { IndexPage } from './page/index-page';
import { SettingsPage } from './page/settings-page';
import { TestData } from './test-data';

let electronApp: ElectronApplication;
let indexPage: IndexPage;
let settingsPage: SettingsPage;

test.beforeEach(async () => {
	electronApp = await getTestElectronApp();

	indexPage = new IndexPage(await electronApp.firstWindow());
	await indexPage.clickSettingsLink();
	settingsPage = new SettingsPage(await electronApp.firstWindow());
});

test.afterEach(async () => {
	await electronApp.close();
});

test('application title is \'pageobject-creation-tool settings\'', async() => {
	expect(await settingsPage.getPageTitle()).toBe('pageobject-creation-tool settings');
});

test('window count equals one', async () => {
	expect(electronApp.windows().length).toBe(1);
});

test('template list contains \'Example Template\'', async () => {
	await settingsPage.selectTemplate(TestData.ExampleTemplate.Name, SelectListAttribute.Label);
	expect(await settingsPage.getTemplateListValue(SelectListAttribute.Value)).toBe('1');
});

test('has the correct title', async () => {
	expect(await settingsPage.getHeaderTitleValue()).toBe('pageobject-creation-tool');
});

test('link to home page is displayed', async () => {
	expect(await settingsPage.isHomeLinkDisplayed()).toBe(true);
});
