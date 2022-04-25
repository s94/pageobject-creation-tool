import { Locator, Page } from '@playwright/test';

export class GeneratedPageObjectModal {
	private readonly page: Page;

	private get outputModal_Div(): Locator { return this.page.locator('#output-modal')}
	private get closeModal_Button(): Locator { return this.page.locator('.modal-header__close'); }
	private get output_Textbox(): Locator { return this.page.locator('#output'); }
	private get copyToClipboard_Button(): Locator { return this.page.locator('#copy-to-clipboard-button'); }

	constructor(page: Page) {
		this.page = page;
	}

	async clickCloseModalButton(): Promise<void> {
		await this.closeModal_Button.click();
	}

	async clickCopyToClipboardButton(): Promise<void> {
		await this.copyToClipboard_Button.click();
	}

	async isOutputModalDisplayed(): Promise<boolean> {
		return await this.outputModal_Div.isVisible();
	}

	async getOutputValue(): Promise<string> {
		return await this.output_Textbox.inputValue();
	}
}
