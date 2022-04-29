import { ElectronApplication, expect, test } from '@playwright/test';
import { getTestElectronApp } from './electron-test-setup';
import { SelectListAttribute } from './enum/select-list-attribute';
import { IndexPage } from './page/index-page';
import { TestData } from './test-data';

let electronApp: ElectronApplication;
let indexPage: IndexPage;

test.beforeEach(async () => {
	electronApp = await getTestElectronApp();

	indexPage = new IndexPage(await electronApp.firstWindow());
});

test.afterEach(async () => {
	await electronApp.close();
});

test('application title is \'pageobject-creation-tool\'', async() => {
	expect(await indexPage.getPageTitle()).toBe('pageobject-creation-tool');
});

test('window count equals one', async () => {
	expect(electronApp.windows().length).toBe(1);
});

test('template list contains \'Example Template\'', async () => {
	await indexPage.selectTemplate(TestData.ExampleTemplate.Name, SelectListAttribute.Label);
	expect(await indexPage.getTemplateListValue(SelectListAttribute.Value)).toBe('1');
});

test('include get checkbox is unchecked by default', async () => {
	expect(await indexPage.isIncludeGetChecked()).toBe(false);
});

test('has the correct title', async () => {
	expect(await indexPage.getHeaderTitleValue()).toBe('pageobject-creation-tool');
});

test('link to settings page is displayed', async () => {
	expect(await indexPage.isSettingsLinkDisplayed()).toBe(true);
});
