import { ElectronApplication, expect, test } from '@playwright/test';
import { getTestElectronApp } from './electron-test-setup';
import { GeneratedPageObjectModal } from './page/generated-pageobject-modal';
import { IndexPage } from './page/index-page';
import { SettingsPage } from './page/settings-page';
import { IndexService } from './service/index-service';
import { SettingsService } from './service/settings-service';
import { ElementType, PageObject, PageObjectElement, PageObjectTemplate } from './test-types';
import { TestData } from './test-data';
import { SettingsPageError } from './enum/settings-page-error';
import { IndexPageError } from './enum/index-page-error';

test('create template > use template > validate generated pageobject', async () => {
	const electronApp: ElectronApplication = await getTestElectronApp();

	const testTemplateName: string = TestData.uniqueTestTemplateName();
	const testElementTemplate: string = '\\tprivate get ${ElementName}_${ElementType}(): Locator { return this.page.locator(\'${ElementId}\'); }\\n';
	const testPageObjectStructure: string = `import { Locator, Page } from \'@playwright/test\';\\nimport { PageBase } from \'../page-base\';\\n\\nexport class \${PageObjectName} extends PageBase {\\n\${Elements}\\n\\tconstructor(page: Page) {\\n\\t\\tsuper(page);\\n\\t}\\n\\n\${GeneralMethods}\\n\\n\${GetMethods}\\n}`;
	const testElementType: string = 'Textbox';
	const testGeneralMethodTemplate: string = '\\tasync enter\${ElementName}(textToEnter: string): Promise<void> {\\n\\t\\tawait this.\${ElementName}_\${ElementType}.fill(textToEnter);\\n\\t}';
	const testGetMethodTemplate: string = '\\tasync get\${ElementName}Value(): Promise<string> {\\n\\t\\treturn await this.\${ElementName}_\${ElementType}.inputValue();\\n\\t}';

	const testPageObjectName: string = 'TestPageObject';
	const testElementName: string = 'testElement';
	const testElementId: string = '#test-id';

	const generatedPageObjectOutput: string = `import { Locator, Page } from \'@playwright/test\';\nimport { PageBase } from \'../page-base\';\n\nexport class ${testPageObjectName} extends PageBase {\n\tprivate get ${testElementName}_${testElementType}(): Locator { return this.page.locator(\'${testElementId}\'); }\n\n\tconstructor(page: Page) {\n\t\tsuper(page);\n\t}\n\n\tasync enter${testElementName}(textToEnter: string): Promise<void> {\n\t\tawait this.${testElementName}_${testElementType}.fill(textToEnter);\n\t}\n\n\tasync get${testElementName}Value(): Promise<string> {\n\t\treturn await this.${testElementName}_${testElementType}.inputValue();\n\t}\n}`;

	const indexPage: IndexPage = new IndexPage(await electronApp.firstWindow());
	const indexService: IndexService = new IndexService(indexPage);
	await indexPage.clickSettingsLink();
	const settingsPage: SettingsPage = new SettingsPage(await electronApp.firstWindow());
	const settingsService: SettingsService = new SettingsService(settingsPage);
	
	// create template
	const elementTypeModel: ElementType = { elementTypeName: testElementType, generalMethodTemplate: testGeneralMethodTemplate, getMethodTemplate: testGetMethodTemplate };
	const pageObjectTemplate: PageObjectTemplate = { templateName: testTemplateName, elementTemplate: testElementTemplate, elementTypes: [elementTypeModel], pageObjectStructure: testPageObjectStructure };
	await settingsService.createTemplate(pageObjectTemplate);
	await settingsService.checkForErrors(SettingsPageError.Blank);

	// use template
	const pageObjectElement: PageObjectElement = { elementType: testElementType, elementName: testElementName, elementId: testElementId, includeGet: true };
	const pageObject: PageObject = { templateName: testTemplateName, pageObjectName: testPageObjectName, pageObjectElements: [pageObjectElement] };
	await settingsPage.clickHomeLink();
	await indexService.generatePageObject(pageObject);
	await indexService.checkForErrors(IndexPageError.Blank);

	// validate generated pageobject
	const generatedPageObjectModal: GeneratedPageObjectModal = new GeneratedPageObjectModal(await electronApp.firstWindow());
	expect(await generatedPageObjectModal.getOutputValue()).toBe(generatedPageObjectOutput);

	await electronApp.close();
});
