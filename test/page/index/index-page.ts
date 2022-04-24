import { Locator, Page } from '@playwright/test';
import { PageBase } from '../page-base';
import { SelectListAttribute } from '../../enum/select-list-attribute';

export class IndexPage extends PageBase {
	private get settings_Link(): Locator { return this.page.locator('.header__link'); }
	private get templateList_SelectList(): Locator { return this.page.locator('#template-list'); }
	private get pageObjectName_Textbox(): Locator { return this.page.locator('#pageobject-name'); }
	private get elementType_SelectList(): Locator { return this.page.locator('#element-type'); }
	private get elementName_Textbox(): Locator { return this.page.locator('#element-name'); }
	private get elementId_Textbox(): Locator { return this.page.locator('#element-id'); }
	private get includeGet_Checkbox(): Locator { return this.page.locator('#include-get'); }
	private get addElementToTable_Button(): Locator { return this.page.locator('#add-button'); }
	private get element_Table(): Locator { return this.page.locator('#element-table'); }
	private get generatePageObject_Button(): Locator { return this.page.locator('#generate-pageobject'); }

	constructor(page: Page) {
		super(page);
	}

	async clickSettingsLink(): Promise<void> {
		await this.settings_Link.click();
	}

	async selectTemplate(templateToSelect: string, selectListAttribute: SelectListAttribute): Promise<void> {
		switch(selectListAttribute) {
			case SelectListAttribute.label:
				await this.templateList_SelectList.selectOption({ label: templateToSelect });
				break;
			case SelectListAttribute.value:
				await this.templateList_SelectList.selectOption({ value: templateToSelect });
				break;
		}
	}

	async enterPageObjectName(pageObjectName: string): Promise<void> {
		await this.pageObjectName_Textbox.fill(pageObjectName);
	}

	async enterElementName(elementName: string): Promise<void> {
		await this.elementName_Textbox.fill(elementName);
	}

	async selectElementType(elementTypeToSelect: string, selectListAttribute: SelectListAttribute): Promise<void> {
		switch(selectListAttribute) {
			case SelectListAttribute.label:
				await this.elementType_SelectList.selectOption({ label: elementTypeToSelect });
				break;
			case SelectListAttribute.value:
				await this.elementType_SelectList.selectOption({ value: elementTypeToSelect });
				break;
		}
	}

	async enterElementId(elementId: string): Promise<void> {
		await this.elementId_Textbox.fill(elementId);
	}

	async toggleIncludeGetCheckbox(toggleCheckbox: boolean): Promise<void> {
		await this.includeGet_Checkbox.setChecked(toggleCheckbox);
	}

	async clickAddElementToTableButton(): Promise<void> {
		await this.addElementToTable_Button.click();
	}

	async clickGeneratePageObjectButton(): Promise<void> {
		await this.generatePageObject_Button.click();
	}

	async getTemplateListValue(selectListAttribute: SelectListAttribute): Promise<string> {
		switch(selectListAttribute) {
			case SelectListAttribute.label:
				return await this.templateList_SelectList.textContent();
			case SelectListAttribute.value:
				return await this.templateList_SelectList.inputValue();
		}
	}

	async getPageObjectNameValue(): Promise<string> {
		return await this.pageObjectName_Textbox.inputValue();
	}

	async getElementNameValue(): Promise<string> {
		return await this.elementName_Textbox.inputValue();
	}

	async getElementTypeValue(selectListAttribute: SelectListAttribute): Promise<string> {
		switch(selectListAttribute) {
			case SelectListAttribute.label:
				return await this.elementType_SelectList.textContent();
			case SelectListAttribute.value:
				return await this.elementType_SelectList.inputValue();
		}
	}

	async getElementIdValue(): Promise<string> {
		return await this.elementId_Textbox.textContent();
	}

	async isIncludeGetChecked(): Promise<boolean> {
		return await this.includeGet_Checkbox.isChecked();
	}

	async getElementTableRowCount(): Promise<number> {
		return this.element_Table.locator('tr').count();
	}
}
