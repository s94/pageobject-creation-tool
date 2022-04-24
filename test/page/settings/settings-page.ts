import { Locator, Page } from '@playwright/test';
import { PageBase } from '../page-base';
import { SelectListAttribute } from '../../enum/select-list-attribute';

export class SettingsPage extends PageBase {
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
	private get addElementTypeToTable_Button(): Locator { return this.page.locator('#add-button'); }
	private get elementType_Table(): Locator { return this.page.locator('#element-type-table'); }
	private get saveTemplate_Button(): Locator { return this.page.locator('#save-template'); }

	constructor(page: Page) {
		super(page);
	}

	async clickHomeLink(): Promise<void> {
		await this.home_Link.click();
	}

	async selectTemplate(templateListToSelect: string, selectListAttribute: SelectListAttribute): Promise<void> {
		switch(selectListAttribute) {
			case SelectListAttribute.label:
				await this.templateList_SelectList.selectOption({ label: templateListToSelect });
				break;
			case SelectListAttribute.value:
				await this.templateList_SelectList.selectOption({ value: templateListToSelect });
				break;
		}
	}

	async clickEditTemplateButton(): Promise<void> {
		await this.editTemplate_Button.click();
	}

	async clickDeleteTemplateButton(): Promise<void> {
		await this.deleteTemplate_Button.click();
	}

	async enterTemplateName(templateName: string): Promise<void> {
		await this.templateName_Textbox.fill(templateName);
	}

	async enterElementTemplate(elementTemplate: string): Promise<void> {
		await this.elementTemplate_Textbox.fill(elementTemplate);
	}

	async enterPageObjectStructure(pageObjectStructure: string): Promise<void> {
		await this.pageObjectStructure_Textbox.fill(pageObjectStructure);
	}

	async enterElementType(elementType: string): Promise<void> {
		await this.elementType_Textbox.fill(elementType);
	}

	async enterGeneralMethodTemplate(generalMethodTemplate: string): Promise<void> {
		await this.generalMethodTemplate_Textbox.fill(generalMethodTemplate);
	}

	async enterGetMethodTemplate(getMethodTemplate: string): Promise<void> {
		await this.getMethodTemplate_Textbox.fill(getMethodTemplate);
	}

	async clickAddElementTypeToTableButton(): Promise<void> {
		await this.addElementTypeToTable_Button.click();
	}

	async clickSaveTemplateButton(): Promise<void> {
		await this.saveTemplate_Button.click();
	}

	async isHomeLinkDisplayed(): Promise<boolean> {
		return await this.home_Link.isVisible();
	}

	async getTemplateListValue(selectListAttribute: SelectListAttribute): Promise<string> {
		switch(selectListAttribute) {
			case SelectListAttribute.label:
				return await this.templateList_SelectList.textContent();
			case SelectListAttribute.value:
				return await this.templateList_SelectList.inputValue();
		}
	}

	async getTemplateNameValue(): Promise<string> {
		return await this.templateName_Textbox.inputValue();
	}

	async getElementTemplateValue(): Promise<string> {
		return await this.elementTemplate_Textbox.inputValue();
	}

	async getPageObjectStructureValue(): Promise<string> {
		return await this.pageObjectStructure_Textbox.inputValue();
	}

	async getElementTypeValue(): Promise<string> {
		return await this.elementType_Textbox.inputValue();
	}

	async getGeneralMethodTemplateValue(): Promise<string> {
		return await this.generalMethodTemplate_Textbox.inputValue();
	}

	async getGetMethodTemplateValue(): Promise<string> {
		return await this.getMethodTemplate_Textbox.inputValue();
	}

	async getElementTypeTableRowCount(): Promise<number> {
		return await this.elementType_Table.locator('tr').count();
	}
}