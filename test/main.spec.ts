import { test, expect } from '@playwright/test';
import { ElectronApplication, Page, Locator, _electron as electron } from 'playwright'
import { ElectronAppInfo, findLatestBuild, parseElectronApp } from 'electron-playwright-helpers'

let electronApp: ElectronApplication;
let currentWindow: Page;

let error_Div: Locator;
let template_SelectList: Locator;
let pageObjectName_Textbox: Locator;
let elementType_SelectList: Locator;
let elementName_Textbox: Locator;
let elementId_Textbox: Locator;
let includeGet_Checkbox: Locator;
let addElementToTable_Button: Locator;
let element_Table: Locator;
let generatePageObject_Button: Locator;

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
	expect(await currentWindow.title()).toBe('pageobject-creation-tool');
});

test('window count equals one', async () => {
	expect(electronApp.windows().length).toBe(1);
});

test('template list contains \'Example Template\'', async () => {
	const template_SelectList: Locator = currentWindow.locator('#template-list');
	await template_SelectList.selectOption({ label: 'Example Template' });
	expect(await template_SelectList.textContent()).toBe('Example Template');
});

test('include get checkbox is unchecked by default', async () => {
	const includeGet_Checkbox: Locator = currentWindow.locator('#include-get');
	expect(await includeGet_Checkbox.isChecked()).toBe(false);
});

test('has the correct title', async () => {
	const headerTitle_Div: Locator = currentWindow.locator('.header__title');
	expect(await headerTitle_Div.textContent()).toBe('pageobject-creation-tool');
});

test.describe('correct error is shown when clicking \'Generate\' with no template selected', async () => {
	const expectedError: string = 'Unable to generate PageObject, a template is required.';

	test.beforeEach(async () => {
		error_Div =  currentWindow.locator('.error');
		template_SelectList = currentWindow.locator('#template-list');
		pageObjectName_Textbox = currentWindow.locator('#pageobject-name');
		elementType_SelectList = currentWindow.locator('#element-type');
		elementName_Textbox = currentWindow.locator('#element-name');
		elementId_Textbox = currentWindow.locator('#element-id');
		includeGet_Checkbox = currentWindow.locator('#include-get');
		addElementToTable_Button = currentWindow.locator('#add-button');
		element_Table = currentWindow.locator('#element-table');
		generatePageObject_Button = currentWindow.locator('#generate-pageobject');

		expect(await error_Div.isVisible(), 'error element is incorrectly displayed').toBe(false);
		expect(await error_Div.textContent(), 'error element text is not blank').toBe('');
	});

	test.afterEach(async () => {
		await generatePageObject_Button.click();
		expect(await error_Div.isVisible(), 'error element is incorrectly hidden').toBe(true);
		expect(await error_Div.textContent(), 'error element text is blank').toBe(expectedError);
	});

	test('PageObject Name: blank, Element Table: blank', async () => {
		expect(await pageObjectName_Textbox.textContent()).toBe('');
		expect(await element_Table.locator('tr').count()).toBe(0);
	});

	test('PageObject Name: populated, Element Table: blank', async () => {
		await pageObjectName_Textbox.type('Testing');
		expect(await pageObjectName_Textbox.inputValue()).toBe('Testing');
		expect(await element_Table.locator('tr').count()).toBe(0);
	});

	test('PageObject Name: blank, Element Table: populated', async () => {
		// first select an option from the template list, required in order to add an element to the table.
		await template_SelectList.selectOption({ label: 'Example Template' });
		expect(await template_SelectList.textContent()).toBe('Example Template');

		// ensure pageObjectName_Textbox is blank
		expect(await pageObjectName_Textbox.inputValue()).toBe('');

		await elementType_SelectList.selectOption({ value: '1' });
		expect(await elementType_SelectList.inputValue()).toBe('1');

		await elementName_Textbox.type('TestElement');
		expect(await elementName_Textbox.inputValue()).toBe('TestElement');

		await addElementToTable_Button.click();

		expect(await element_Table.locator('tr').count()).toBe(1);

		// revert the template list selection after the element has been added to the table
		await template_SelectList.selectOption({ value: '0' });
		expect(await template_SelectList.inputValue()).toBe('0');
	});

	test('PageObject Name: populated, Element Table: populated', async () => {
		// first select an option from the template list, required in order to add an element to the table.
		await template_SelectList.selectOption({ label: 'Example Template' });
		expect(await template_SelectList.textContent()).toBe('Example Template');

		await pageObjectName_Textbox.type('Testing');
		expect(await pageObjectName_Textbox.inputValue()).toBe('Testing');

		await elementType_SelectList.selectOption({ value: '1' });
		expect(await elementType_SelectList.inputValue()).toBe('1');

		await elementName_Textbox.type('TestElement');
		expect(await elementName_Textbox.inputValue()).toBe('TestElement');

		await addElementToTable_Button.click();

		expect(await element_Table.locator('tr').count()).toBe(1);

		// revert the template list selection after the element has been added to the table
		await template_SelectList.selectOption({ value: '0' });
		expect(await template_SelectList.inputValue()).toBe('0');
	});
});
