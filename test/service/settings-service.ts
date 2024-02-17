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
		await this.addElementTypesToTable(pageObjectTemplate.elementTypes);
		await this.settingsPage.clickSaveTemplateButton();
	}

	public async editTemplate(pageObjectTemplate: PageObjectTemplate, existingElementsCount: number): Promise<void> {
		await this.settingsPage.selectTemplate(pageObjectTemplate.templateName, SelectListAttribute.Label);
		expect(await this.settingsPage.getTemplateListValue(SelectListAttribute.Label)).toContain(pageObjectTemplate.templateName);
		await this.settingsPage.clickEditTemplateButton();
		expect(await this.settingsPage.getTemplateNameValue()).toBe(pageObjectTemplate.templateName);
		await this.settingsPage.enterElementTemplate(pageObjectTemplate.elementTemplate);
		expect(await this.settingsPage.getElementTemplateValue()).toBe(pageObjectTemplate.elementTemplate);
		await this.settingsPage.enterPageObjectStructure(pageObjectTemplate.pageObjectStructure);
		expect(await this.settingsPage.getPageObjectStructureValue()).toBe(pageObjectTemplate.pageObjectStructure);
		await this.addElementTypesToTable(pageObjectTemplate.elementTypes, existingElementsCount);
		await this.settingsPage.clickSaveTemplateButton();
	}

	public async deleteTemplate(pageObjectTemplateName: string): Promise<void> {
		await this.settingsPage.selectTemplate(pageObjectTemplateName, SelectListAttribute.Label);
		expect(await this.settingsPage.getTemplateListValue(SelectListAttribute.Label)).toContain(pageObjectTemplateName);
		await this.settingsPage.clickDeleteTemplateButton();
	}

	public async addElementTypesToTable(elementTypeArray: ElementType[], existingElementsCount: number = 0): Promise<void> {
		let tableRowNumber: number = existingElementsCount;
		for (let i: number = 0; i < elementTypeArray.length; i++) {
			const elementType: ElementType = elementTypeArray[i];
			await this.settingsPage.enterElementType(elementType.elementTypeName);
			expect(await this.settingsPage.getElementTypeValue()).toBe(elementType.elementTypeName);
			if ((elementType.generalMethodTemplate !== null && elementType.generalMethodTemplate !== undefined) || elementType.generalMethodTemplate?.trim().length > 0) {
				await this.settingsPage.enterGeneralMethodTemplate(elementType.generalMethodTemplate);
				expect(await this.settingsPage.getGeneralMethodTemplateValue()).toBe(elementType.generalMethodTemplate);
			}
			if ((elementType.getMethodTemplate !== null && elementType.getMethodTemplate !== undefined) || elementType.getMethodTemplate?.trim().length > 0) {
				await this.settingsPage.enterGetMethodTemplate(elementType.getMethodTemplate);
				expect(await this.settingsPage.getGetMethodTemplateValue()).toBe(elementType.getMethodTemplate);
			}
			await this.settingsPage.clickAddElementTypeToTableButton();

			if (elementType.elementTypeName.trim().length > 0) {
				tableRowNumber++;
				await this.settingsPage.waitForElementTypeTableToPopulate(tableRowNumber);
			}

			expect(await this.settingsPage.getElementTypeTableRowCount()).toBe(tableRowNumber);
		}
	}

	public async editElementTypeFromTable(rowId: number, elementTypeToEdit: ElementType, editedElementType: ElementType): Promise<void> {
		await this.settingsPage.clickEditElementTypeFromTableButton(rowId);
		expect(await this.settingsPage.getAddElementTypeToTableButtonValue()).toBe('Update');
		await this.verifyElementTypeWithinForm(elementTypeToEdit);

		await this.settingsPage.enterElementType(editedElementType.elementTypeName);
		await this.settingsPage.enterGeneralMethodTemplate(editedElementType.generalMethodTemplate);
		await this.settingsPage.enterGetMethodTemplate(editedElementType.getMethodTemplate);
		await this.settingsPage.clickAddElementTypeToTableButton();

		expect(await this.settingsPage.getAddElementTypeToTableButtonValue()).toBe('Add');
	}

	public async verifyElementTypeWithinForm(expectedElementType: ElementType) {
		expect(await this.settingsPage.getElementTypeValue()).toBe(expectedElementType.elementTypeName);
		expect(await this.settingsPage.getGeneralMethodTemplateValue()).toBe(expectedElementType.generalMethodTemplate);
		expect(await this.settingsPage.getGeneralMethodTemplateValue()).toBe(expectedElementType.generalMethodTemplate ?? '');
	}

	public async verifyElementTypesWithinTable(elementTypeArray: ElementType[]) {
		for (let i: number = 0; i < elementTypeArray.length; i++) {
			const rowId: number = (i + 1);
			await this.verifyElementTypeWithinTable(rowId, elementTypeArray[i]);
		}
	}

	public async verifyElementTypeWithinTable(rowId: number, expectedElementType: ElementType) {
		expect(await this.settingsPage.getElementTypeFromTableValue(rowId)).toBe(expectedElementType.elementTypeName);
		expect(await this.settingsPage.getGeneralMethodTemplateFromTableValue(rowId)).toBe(expectedElementType.generalMethodTemplate);
		expect(await this.settingsPage.getGetMethodTemplateFromTableValue(rowId)).toBe(expectedElementType.getMethodTemplate ?? '');
	}

	public async checkForErrors(expectedError: SettingsPageError): Promise<void> {
		const isError: boolean = expectedError !== SettingsPageError.Blank;
		expect(await this.settingsPage.isErrorMessageDisplayed(), `error element is incorrectly ${ isError ? 'hidden' : 'visible' }`).toBe(isError);
		expect(await this.settingsPage.getErrorMessageValue(), `error element text is ${ isError ? '' : 'not' } blank`).toBe(expectedError);
	}
}
