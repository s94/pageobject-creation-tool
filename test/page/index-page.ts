import { Locator, Page } from '@playwright/test';
import { PageBase } from './page-base';
import { SelectListAttribute } from '../enum/select-list-attribute';

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

	public async clickSettingsLink(): Promise<void> {
		await this.settings_Link.click();
	}

	public async selectTemplate(templateToSelect: string, selectListAttribute: SelectListAttribute): Promise<void> {
		await this.selectListBase(this.templateList_SelectList, templateToSelect, selectListAttribute);
	}

	public async enterPageObjectName(pageObjectName: string): Promise<void> {
		await this.pageObjectName_Textbox.fill(pageObjectName);
	}

	public async enterElementName(elementName: string): Promise<void> {
		await this.elementName_Textbox.fill(elementName);
	}

	public async selectElementType(elementTypeToSelect: string, selectListAttribute: SelectListAttribute): Promise<void> {
		await this.selectListBase(this.elementType_SelectList, elementTypeToSelect, selectListAttribute);
	}

	public async enterElementId(elementId: string): Promise<void> {
		await this.elementId_Textbox.fill(elementId);
	}

	public async toggleIncludeGetCheckbox(toggleCheckbox: boolean): Promise<void> {
		await this.includeGet_Checkbox.setChecked(toggleCheckbox);
	}

	public async clickAddElementToTableButton(): Promise<void> {
		await this.addElementToTable_Button.click();
	}

	public async clickGeneratePageObjectButton(): Promise<void> {
		await this.generatePageObject_Button.click();
	}

	public async isSettingsLinkDisplayed(): Promise<boolean> {
		return await this.settings_Link.isVisible();
	}

	public async getTemplateListValue(selectListAttribute: SelectListAttribute): Promise<string> {
		return await this.getSelectListValueBase(this.templateList_SelectList, selectListAttribute);
	}

	public async getPageObjectNameValue(): Promise<string> {
		return await this.pageObjectName_Textbox.inputValue();
	}

	public async getElementNameValue(): Promise<string> {
		return await this.elementName_Textbox.inputValue();
	}

	public async getElementTypeValue(selectListAttribute: SelectListAttribute): Promise<string> {
		return await this.getSelectListValueBase(this.elementType_SelectList, selectListAttribute);
	}

	public async getElementIdValue(): Promise<string> {
		return await this.elementId_Textbox.inputValue();
	}

	public async isIncludeGetChecked(): Promise<boolean> {
		return await this.includeGet_Checkbox.isChecked();
	}

	public async getElementTableRowCount(): Promise<number> {
		return await this.element_Table.locator('tr').count();
	}

	public async waitForElementTableToPopulate(expectedRowNumber: number): Promise<void> {
		await this.element_Table.locator(`tr:nth-of-type(${expectedRowNumber})`).waitFor();
	}
}
