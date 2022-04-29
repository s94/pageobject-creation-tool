import { Locator, Page } from '@playwright/test';
import { SelectListAttribute } from '../enum/select-list-attribute';

export abstract class PageBase {
	protected readonly page: Page;

	private get headerTitle_Div(): Locator { return this.page.locator('.header__title'); }
	private get errorMessage_Div(): Locator { return this.page.locator('.error'); };

	constructor(page: Page) {
		this.page = page;
	}

	public async getPageTitle(): Promise<string> {
		return await this.page.title();
	}

	public async getHeaderTitleValue(): Promise<string> {
		return await this.headerTitle_Div.textContent();
	}

	public async isErrorMessageDisplayed(): Promise<boolean> {
		return await this.errorMessage_Div.isVisible();
	}

	public async getErrorMessageValue(): Promise<string> {
		return await this.errorMessage_Div.textContent();
	}

	protected async selectListBase(selectElement : Locator, elementTypeToSelect: string, selectListAttribute: SelectListAttribute): Promise<void> {
		switch (selectListAttribute) {
			case SelectListAttribute.Label:
				await selectElement.selectOption({ label: elementTypeToSelect });
				break;
			case SelectListAttribute.Value:
				await selectElement.selectOption({ value: elementTypeToSelect });
				break;
		}
	}

	protected async getSelectListValueBase(selectElement: Locator, selectListAttribute: SelectListAttribute) {
		switch (selectListAttribute) {
			case SelectListAttribute.Label:
				return await selectElement.textContent();
			case SelectListAttribute.Value:
				return await selectElement.inputValue();
		}
	}
}
