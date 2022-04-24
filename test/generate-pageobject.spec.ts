import { test, expect } from '@playwright/test';
import { ElectronApplication, _electron as electron } from 'playwright';
import { ElectronAppInfo, findLatestBuild, parseElectronApp } from 'electron-playwright-helpers';
import { IndexPage } from './page/index/index-page';
import { GeneratedPageObjectModal } from './page/index/generated-pageobject-modal'
import { SettingsPage } from './page/settings/settings-page'
import { SelectListAttribute } from './enum/select-list-attribute';

test('create template > use template > generate pageobject', async () => {

	const latestBuild: string = findLatestBuild();
	const appInfo: ElectronAppInfo = parseElectronApp(latestBuild);
	const electronApp: ElectronApplication = await electron.launch({
		args: [appInfo.main],
		executablePath: appInfo.executable
	});

	electronApp.on('window', async (page) => {
		const filename: string = page.url()?.split('/').pop();
		console.log(`Window opened: ${filename}`);

		page.on('pageerror', (error) => {
			console.error(error);
		});
		page.on('console', (msg) => {
			console.log(msg.text());
		});
	});

	const templateName: string = 'generate-pageobject-test';
	const elementTemplate: string = '\tprivate get ${ElementName}_${ElementType}(): Locator { return this.page.locator(\'${ElementId}\'); }\n';
	const pageObjectStructure: string = `import { Locator, Page } from '@playwright/test'
	import { PageBase } from '../page-base'
	export class \${PageObjectName} extends PageBase {
		\${Elements}
	
		constructor(page: Page) {
			super(page);
		}
	
		\${GeneralMethods}
	
		\${GetMethods}
	}`
	const elementType: string = 'Textbox';
	const generalMethodTemplate: string = `async enter\${ElementName}(textToEnter: string): Promise<void> {
			await this.\${ElementName}_\${ElementType}.fill(testToEnter);
		}`
	const getMethodTemplate: string = `async get\${ElementName}Value(): Promise<string> {
			return await this.\${ElementName}_\${ElementType}.inputValue();
		}`

	const pageObjectName: string = 'TestPageObject';
	const elementName: string = 'testElement';
	const elementId: string = '#test-id';

	const generatedPageObjectOutput: string = `import { Locator, Page } from '@playwright/test'
	import { PageBase } from '../page-base'
	export class ${pageObjectName} extends PageBase {
		private get ${elementName}_${elementType}(): Locator { return this.page.locator(\'${elementId}\'); }
	
		constructor(page: Page) {
			super(page);
		}
	
		async enter${elementName}(textToEnter: string): Promise<void> {
			await this.${elementName}_${elementType}.fill(testToEnter);
		}
	
		async get${elementName}Value(): Promise<string> {
			return await this.${elementName}_${elementType}.inputValue();
		}
	}`

	const indexPage: IndexPage = new IndexPage(await electronApp.firstWindow());
	await indexPage.clickSettingsLink();
	const settingsPage: SettingsPage = new SettingsPage(await electronApp.firstWindow());

	// create template
	await settingsPage.enterTemplateName(templateName);
	expect(await settingsPage.getTemplateNameValue()).toBe(templateName);
	await settingsPage.enterElementTemplate(elementTemplate);
	expect(await settingsPage.getElementTemplateValue()).toBe(elementTemplate);
	await settingsPage.enterPageObjectStructure(pageObjectStructure);
	expect(await settingsPage.getPageObjectStructureValue()).toBe(pageObjectStructure);
	await settingsPage.enterElementType(elementType);
	expect(await settingsPage.getElementTypeValue()).toBe(elementType);
	await settingsPage.enterGeneralMethodTemplate(generalMethodTemplate);
	expect(await settingsPage.getGeneralMethodTemplateValue()).toBe(generalMethodTemplate);
	await settingsPage.enterGetMethodTemplate(getMethodTemplate);
	expect(await settingsPage.getGetMethodTemplateValue()).toBe(getMethodTemplate);
	await settingsPage.clickAddElementTypeToTableButton();
	expect(await settingsPage.getElementTypeTableRowCount()).toBe(1);
	await settingsPage.clickSaveTemplateButton();

	// use template
	await settingsPage.clickHomeLink();
	await indexPage.selectTemplate(templateName, SelectListAttribute.label);
	expect(await indexPage.getTemplateListValue(SelectListAttribute.label)).toContain(templateName);
	await indexPage.enterPageObjectName(pageObjectName);
	expect(await indexPage.getPageObjectNameValue()).toBe(pageObjectName);
	await indexPage.selectElementType(elementType, SelectListAttribute.label);
	expect(await indexPage.getElementTypeValue(SelectListAttribute.label)).toContain(elementType);
	await indexPage.enterElementName(elementName);
	expect(await indexPage.getElementNameValue()).toBe(elementName);
	await indexPage.enterElementId(elementId);
	expect(await indexPage.getElementIdValue()).toBe(elementId);
	await indexPage.toggleIncludeGetCheckbox(true);
	expect(await indexPage.isIncludeGetChecked()).toBe(true);
	await indexPage.clickAddElementToTableButton();
	expect(await indexPage.getElementTableRowCount()).toBe(1);

	// generate pageobject
	await indexPage.clickGeneratePageObjectButton();
	const generatedPageObjectModal: GeneratedPageObjectModal = new GeneratedPageObjectModal(await electronApp.firstWindow());
	expect(await generatedPageObjectModal.getOutputValue()).toBe(generatedPageObjectOutput);

	await electronApp.close();
});