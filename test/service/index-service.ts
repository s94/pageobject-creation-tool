import { expect } from '@playwright/test';
import { IndexPageError } from '../enum/index-page-error';
import { SelectListAttribute } from '../enum/select-list-attribute';
import { IndexPage } from '../page/index-page';
import { PageObject, PageObjectElement } from '../test-types';

export class IndexService {
	private readonly indexPage: IndexPage;
	
	constructor(indexPage: IndexPage) {
		this.indexPage = indexPage;
	}

	public async generatePageObject(pageObject: PageObject, clickGenerate: boolean = true): Promise<void> {
		await this.indexPage.selectTemplate(pageObject.templateName, SelectListAttribute.Label);
		expect(await this.indexPage.getTemplateListValue(SelectListAttribute.Label)).toContain(pageObject.templateName);
		await this.indexPage.enterPageObjectName(pageObject.pageObjectName);
		expect(await this.indexPage.getPageObjectNameValue()).toBe(pageObject.pageObjectName);
		await this.addElementsToTable(pageObject.pageObjectElements);

		if (!clickGenerate) return;
		
		await this.indexPage.clickGeneratePageObjectButton();
	}

	public async addElementsToTable(pageObjectElementsArray: PageObjectElement[]): Promise<void> {
		let tableRowNumber: number = 0;
		for (let i: number = 0; i < pageObjectElementsArray.length; i++) {
			const pageObjectElement: PageObjectElement = pageObjectElementsArray[i];
			await this.indexPage.selectElementType(pageObjectElement.elementType, SelectListAttribute.Label);
			await this.indexPage.enterElementName(pageObjectElement.elementName);
			if ((pageObjectElement.elementId !== null && pageObjectElement.elementId !== undefined) || pageObjectElement.elementId?.trim().length > 0) {
				await this.indexPage.enterElementId(pageObjectElement.elementId);
			}
			if ((pageObjectElement.includeGet !== null && pageObjectElement.includeGet !== undefined)) {
					await this.indexPage.toggleIncludeGetCheckbox(pageObjectElement.includeGet);
			}
			await this.verifyElementWithinForm(pageObjectElement);
			await this.indexPage.clickAddElementToTableButton();

			if (pageObjectElement.elementType.trim().length > 0 && pageObjectElement.elementName.trim().length > 0) {
				tableRowNumber++;
				await this.indexPage.waitForElementTableToPopulate(tableRowNumber);
			}
			
			expect(await this.indexPage.getElementTableRowCount()).toBe(tableRowNumber);
		}
	}

	public async editElementFromTable(rowId: number, pageObjectElementToEdit: PageObjectElement, editedPageObjectElement: PageObjectElement) {
		await this.indexPage.clickEditElementFromTableButton(rowId);
		expect(await this.indexPage.getAddElementToTableButtonValue()).toBe('Update');
		await this.verifyElementWithinForm(pageObjectElementToEdit);

		await this.indexPage.enterElementName(editedPageObjectElement.elementName);
		await this.indexPage.selectElementType(editedPageObjectElement.elementType, SelectListAttribute.Label);
		await this.indexPage.enterElementId(editedPageObjectElement.elementId);
		await this.indexPage.toggleIncludeGetCheckbox(editedPageObjectElement.includeGet);
		await this.indexPage.clickAddElementToTableButton();

		expect(await this.indexPage.getAddElementToTableButtonValue()).toBe('Add');
	}

	public async verifyElementWithinForm(expectedPageObjectElement: PageObjectElement) {
		expect(await this.indexPage.getElementNameValue()).toBe(expectedPageObjectElement.elementName);
		expect(await this.indexPage.getElementTypeValue(SelectListAttribute.Label)).toContain(expectedPageObjectElement.elementType);
		expect(await this.indexPage.getElementIdValue()).toBe(expectedPageObjectElement.elementId ?? '');
		expect(await this.indexPage.isIncludeGetChecked()).toBe(expectedPageObjectElement.includeGet ?? false);
	}

	public async verifyElementsWithinTable(pageObjectElementArray: PageObjectElement[]) {
		for (let i: number = 0; i < pageObjectElementArray.length; i++) {
			const rowId: number = (i + 1);
			await this.verifyElementWithinTable(rowId, pageObjectElementArray[i]);
		}
	}

	public async verifyElementWithinTable(rowId: number, expectedPageObjectElement: PageObjectElement) {
		expect(await this.indexPage.getElementNameFromTableValue(rowId)).toBe(expectedPageObjectElement.elementName);
		expect(await this.indexPage.getElementTypeFromTableValue(rowId)).toBe(expectedPageObjectElement.elementType);
		expect(await this.indexPage.getElementIdFromTableValue(rowId)).toBe(expectedPageObjectElement.elementId ?? '');
		expect(await this.indexPage.getIncludeGetFromTableValue(rowId)).toBe(expectedPageObjectElement.includeGet ?? false);
	}

	public async checkForErrors(expectedError: IndexPageError): Promise<void> {
		const isError: boolean = expectedError !== IndexPageError.Blank;
		expect(await this.indexPage.isErrorMessageDisplayed(), `error element is incorrectly ${ isError ? 'hidden' : 'visible' }`).toBe(isError);
		expect(await this.indexPage.getErrorMessageValue(), `error element text is ${ isError ? '' : 'not' } blank`).toBe(expectedError);
	}
}
