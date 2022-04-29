import { expect } from '@playwright/test';
import { SelectListAttribute } from '../enum/select-list-attribute';
import { SettingsPageError } from '../enum/settings-page-error';
import { SettingsPage } from '../page/settings-page';
import { ElementType, PageObjectTemplate } from '../test-types';

export class SettingsService {
	private readonly settingsPage: SettingsPage;
	
	constructor(settingsPage: SettingsPage) {
		this.settingsPage = settingsPage;
	}

	public async createTemplate(pageObjectTemplate: PageObjectTemplate): Promise<void> {
		await this.settingsPage.enterTemplateName(pageObjectTemplate.templateName);
		expect(await this.settingsPage.getTemplateNameValue()).toBe(pageObjectTemplate.templateName);
		await this.settingsPage.enterElementTemplate(pageObjectTemplate.elementTemplate);
		expect(await this.settingsPage.getElementTemplateValue()).toBe(pageObjectTemplate.elementTemplate);
		await this.settingsPage.enterPageObjectStructure(pageObjectTemplate.pageObjectStructure);
		expect(await this.settingsPage.getPageObjectStructureValue()).toBe(pageObjectTemplate.pageObjectStructure);
		await this.addElementsToTable(pageObjectTemplate.elementTypes);
		await this.settingsPage.clickSaveTemplateButton();
	}

	public async editTemplate(pageObjectTemplate: PageObjectTemplate): Promise<void> {
		await this.settingsPage.selectTemplate(pageObjectTemplate.templateName, SelectListAttribute.Label);
		expect(await this.settingsPage.getTemplateListValue(SelectListAttribute.Label)).toContain(pageObjectTemplate.templateName);
		this.createTemplate(pageObjectTemplate);
	}

	public async deleteTemplate(pageObjectTemplateName: string): Promise<void> {
		await this.settingsPage.selectTemplate(pageObjectTemplateName, SelectListAttribute.Label);
		expect(await this.settingsPage.getTemplateListValue(SelectListAttribute.Label)).toContain(pageObjectTemplateName);
		await this.settingsPage.clickDeleteTemplateButton();
	}

	public async addElementsToTable(elementTypeArray: ElementType[]): Promise<void> {
		let tableRowNumber: number = 0;
		for (let i: number = 0; i < elementTypeArray.length; i++) {
			const elementType: ElementType = elementTypeArray[i];
			await this.settingsPage.enterElementType(elementType.elementTypeName);
			expect(await this.settingsPage.getElementTypeValue()).toBe(elementType.elementTypeName);
			await this.settingsPage.enterGeneralMethodTemplate(elementType.generalMethodTemplate);
			expect(await this.settingsPage.getGeneralMethodTemplateValue()).toBe(elementType.generalMethodTemplate);
			if ((elementType.getMethodTemplate !== null && elementType.getMethodTemplate !== undefined) || elementType.getMethodTemplate?.trim().length > 0) {
				await this.settingsPage.enterGetMethodTemplate(elementType.getMethodTemplate);
				expect(await this.settingsPage.getGetMethodTemplateValue()).toBe(elementType.getMethodTemplate);
			}
			await this.settingsPage.clickAddElementTypeToTableButton();

			if (elementType.elementTypeName.trim().length > 0 && elementType.generalMethodTemplate.trim().length > 0) {
				tableRowNumber++;
				await this.settingsPage.waitForElementTypeTableToPopulate(tableRowNumber);
			}
			
			expect(await this.settingsPage.getElementTypeTableRowCount()).toBe(tableRowNumber);
		}
	}

	public async checkForErrors(expectedError: SettingsPageError): Promise<void> {
		const isError: boolean = expectedError !== SettingsPageError.Blank;
		expect(await this.settingsPage.isErrorMessageDisplayed(), `error element is incorrectly ${ isError ? 'hidden' : 'visible' }`).toBe(isError);
		expect(await this.settingsPage.getErrorMessageValue(), `error element text is ${ isError ? '' : 'not' } blank`).toBe(expectedError);
	}
}
