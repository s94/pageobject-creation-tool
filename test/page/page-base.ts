import { Locator, Page } from '@playwright/test';

export abstract class PageBase {
	protected readonly page: Page;

	private get headerTitle_Div(): Locator { return this.page.locator('.header__title'); }
	private get errorMessage_Div(): Locator { return this.page.locator('.error'); };

	constructor(page: Page) {
		this.page = page;
	}

	async getPageTitle(): Promise<string> {
		return await this.page.title();
	}

	async getHeaderTitleValue(): Promise<string> {
		return await this.headerTitle_Div.textContent();
	}

	async isErrorMessageDisplayed(): Promise<boolean> {
		return await this.errorMessage_Div.isVisible();
	}

	async getErrorMessageValue(): Promise<string> {
		return await this.errorMessage_Div.textContent();
	}
}
