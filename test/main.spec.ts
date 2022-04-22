import { test, expect } from '@playwright/test';
import { ElectronApplication, Page, Locator, _electron as electron } from 'playwright'
import { ElectronAppInfo, findLatestBuild, parseElectronApp } from 'electron-playwright-helpers'

let electronApp: ElectronApplication;
let currentWindow: Page;

test.beforeEach(async () => {
	const latestBuild: string = findLatestBuild();
	const appInfo: ElectronAppInfo = parseElectronApp(latestBuild);
	electronApp = await electron.launch({
		args: [appInfo.main],
		executablePath: appInfo.executable
	});

	electronApp.on('window', async (page) => {
		const filename: string = page.url()?.split('/').pop()
		console.log(`Window opened: ${filename}`)

		page.on('pageerror', (error) => {
			console.error(error)
		});
		page.on('console', (msg) => {
			console.log(msg.text())
		});
	});

	currentWindow = await electronApp.firstWindow();
});

test.afterEach(async () => {
	await electronApp.close()
});

test('application title is \'pageobject-creation-tool\'', async() => {
	const appTitle: string = await currentWindow.title();
	return expect(appTitle).toBe('pageobject-creation-tool');
});

test('window count equals one', async () => {
	const count: number = electronApp.windows().length;
	return expect(count).toBe(1);
});

test('template list contains \'Example Template\'', async () => {
	await currentWindow.waitForSelector('#template-list');
	const templateListElement: Locator = currentWindow.locator('#template-list');
	await templateListElement.selectOption({ label: 'Example Template' });
	const selectedValue: string = await templateListElement.textContent();
	return expect(selectedValue).toBe('Example Template');
});

test('include get checkbox is unchecked by default', async () => {
	const includeGetCheckboxElement: Locator = currentWindow.locator('#include-get');
	const isIncludeGetCheckboxSelected: boolean = await includeGetCheckboxElement.isChecked();
	return expect(isIncludeGetCheckboxSelected).toBe(false);
});

test('has the correct title', async () => {
	const headerTitleElement: Locator = currentWindow.locator('.header__title');
	const headerTitleText: string = await headerTitleElement.textContent();
	return expect(headerTitleText).toBe('pageobject-creation-tool');
});

test.describe('correct error is shown when clicking \'Generate\' with no template selected', async () => {
	test('PageObject Name and Element Table is also blank', async () => {
		const errorElement: Locator =  currentWindow.locator('.error');
		const generateButtonElement: Locator = currentWindow.locator('#generate-pageobject');

		expect(await errorElement.isVisible(), 'error element is incorrectly displayed').toBe(false);
		expect(await errorElement.textContent(), 'error element text is not blank').toBe('');
		
		await generateButtonElement.click();
		expect(await errorElement.isVisible(), 'error element is incorrectly hidden').toBe(true);
		expect(await errorElement.textContent(), 'error element text is blank').toBe('Unable to generate PageObject, a template is required.');
	});
});