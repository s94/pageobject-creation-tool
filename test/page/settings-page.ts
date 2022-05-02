import { Locator, Page } from '@playwright/test';
import { PageBase } from './page-base';
import { SelectListAttribute } from '../enum/select-list-attribute';

export class SettingsPage extends PageBase {
	private static elementTypeTableCellId: number = 1;
	private static generalMethodTemplateCellId: number = 2;
	private static getMethodTemplateCellId: number = 3;
	private static editTableCellId: number = 4;
	private static removeTableCellId: number = 5;

	private get home_Link(): Locator { return this.page.locator('.header__link'); }
	private get templateList_SelectList(): Locator { return this.page.locator('#template-list'); }
	private get editTemplate_Button(): Locator { return this.page.locator('#edit-template'); }
	private get deleteTemplate_Button(): Locator { return this.page.locator('#delete-template'); }
	private get templateName_Textbox(): Locator { return this.page.locator('#template-name'); }
	private get elementTemplate_Textbox(): Locator { return this.page.locator('#element-declaration-template'); }
	private get pageObjectStructure_Textbox(): Locator { return this.page.locator('#pageobject-structure'); }
	private get elementType_Textbox(): Locator { return this.page.locator('#element-type'); }
	private get generalMethodTemplate_Textbox(): Locator { return this.page.locator('#general-method-template'); }
	private get getMethodTemplate_Textbox(): Locator { return this.page.locator('#get-method-template'); }
	private get addElementTypeToTable_Button(): Locator { return this.page.locator('#add-element-type-button'); }
	private get elementType_Table(): Locator { return this.page.locator('#element-type-table'); }
	private get saveTemplate_Button(): Locator { return this.page.locator('#save-template'); }

	constructor(page: Page) {
		super(page);
	}

	public async clickHomeLink(): Promise<void> {
		await this.home_Link.click();
	}

	public async selectTemplate(templateListToSelect: string, selectListAttribute: SelectListAttribute): Promise<void> {
		await this.selectListBase(this.templateList_SelectList, templateListToSelect, selectListAttribute);
	}

	public async clickEditTemplateButton(): Promise<void> {
		await this.editTemplate_Button.click();
	}

	public async clickDeleteTemplateButton(): Promise<void> {
		await this.deleteTemplate_Button.click();
	}

	public async enterTemplateName(templateName: string): Promise<void> {
		await this.templateName_Textbox.fill(templateName);
	}

	public async enterElementTemplate(elementTemplate: string): Promise<void> {
		await this.elementTemplate_Textbox.fill(elementTemplate);
	}

	public async enterPageObjectStructure(pageObjectStructure: string): Promise<void> {
		await this.pageObjectStructure_Textbox.fill(pageObjectStructure);
	}

	public async enterElementType(elementType: string): Promise<void> {
		await this.elementType_Textbox.fill(elementType);
	}

	public async enterGeneralMethodTemplate(generalMethodTemplate: string): Promise<void> {
		await this.generalMethodTemplate_Textbox.fill(generalMethodTemplate);
	}

	public async enterGetMethodTemplate(getMethodTemplate: string): Promise<void> {
		await this.getMethodTemplate_Textbox.fill(getMethodTemplate);
	}

	public async clickAddElementTypeToTableButton(): Promise<void> {
		await this.addElementTypeToTable_Button.click();
	}

	public async clickSaveTemplateButton(): Promise<void> {
		await this.saveTemplate_Button.click();
	}

	public async clickEditElementTypeFromTableButton(rowId: number): Promise<void> {
		await this.clickElementTypeTableButton(rowId, SettingsPage.editTableCellId);
	}

	public async clickRemoveElementTypeFromTableButton(rowId: number): Promise<void> {
		await this.clickElementTypeTableButton(rowId, SettingsPage.removeTableCellId);
	}

	public async isHomeLinkDisplayed(): Promise<boolean> {
		return await this.home_Link.isVisible();
	}

	public async getTemplateListValue(selectListAttribute: SelectListAttribute): Promise<string> {
		return await this.getSelectListValueBase(this.templateList_SelectList, selectListAttribute);
	}

	public async getTemplateNameValue(): Promise<string> {
		return await this.templateName_Textbox.inputValue();
	}

	public async getElementTemplateValue(): Promise<string> {
		return await this.elementTemplate_Textbox.inputValue();
	}

	public async getPageObjectStructureValue(): Promise<string> {
		return await this.pageObjectStructure_Textbox.inputValue();
	}

	public async getElementTypeValue(): Promise<string> {
		return await this.elementType_Textbox.inputValue();
	}

	public async getGeneralMethodTemplateValue(): Promise<string> {
		return await this.generalMethodTemplate_Textbox.inputValue();
	}

	public async getGetMethodTemplateValue(): Promise<string> {
		return await this.getMethodTemplate_Textbox.inputValue();
	}

	public async getAddElementTypeToTableButtonValue(): Promise<string> {
		return await this.addElementTypeToTable_Button.textContent();
	}

	public async getElementTypeTableRowCount(): Promise<number> {
		return await this.elementType_Table.locator('tr').count();
	}

	public async waitForElementTypeTableToPopulate(expectedRowNumber: number): Promise<void> {
		await this.elementType_Table.locator(`tr:nth-of-type(${expectedRowNumber})`).waitFor();
	}

	public async getElementTypeFromTableValue(rowId: number): Promise<string> {
		return await this.getElementTypeTableValue(rowId, SettingsPage.elementTypeTableCellId);
	}

	public async getGeneralMethodTemplateFromTableValue(rowId: number): Promise<string> {
		return await this.getElementTypeTableValue(rowId, SettingsPage.generalMethodTemplateCellId);
	}

	public async getGetMethodTemplateFromTableValue(rowId: number): Promise<string> {
		return await this.getElementTypeTableValue(rowId, SettingsPage.getMethodTemplateCellId);
	}

	private async clickElementTypeTableButton(rowId: number, cellId: number): Promise<void> {
		await this.page.locator(`((//tbody[@id='element-type-table']/tr)[${rowId}]/td)[${cellId}]/button`).click();
	}

	private async getElementTypeTableValue(rowId: number, cellId: number): Promise<string> {
		return await this.page.locator(`((//tbody[@id='element-type-table']/tr)[${rowId}]/td)[${cellId}]`).textContent();
	}
}
