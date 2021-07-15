const Application = require('spectron').Application;
const assert = require('assert');
const electronPath = require('electron');
const path = require('path');

const app = new Application({
	path: electronPath,
	args: [path.join(__dirname, '..')]
});

describe('Application launch', function() {
	this.timeout(30000);

	beforeEach(() => {
		return app.start();
	});

	afterEach(() => {
		if(app && app.isRunning()) {
			return app.stop();
		}
	});

	it('window count equals one', async () => {
		const count = await app.client.getWindowCount();
		return assert.strictEqual(count, 1);
	});

	it('template list contains \'Example Template\'', async () => {
		await app.client.waitUntilWindowLoaded();
		const templateListElement = await app.client.$('#template-list');
		await templateListElement.selectByVisibleText('Example Template');
		const selectedValue = await templateListElement.getText();
		return assert.strictEqual(selectedValue, 'Example Template');
	});

	it('include get checkbox is unchecked by default', async () => {
		await app.client.waitUntilWindowLoaded();
		const includeGetCheckboxElement = await app.client.$('#include-get');
		const isIncludeGetCheckboxSelected = await includeGetCheckboxElement.isSelected();
		return assert.strictEqual(isIncludeGetCheckboxSelected, false);
	});

	it('has the correct title', async () => {
		await app.client.waitUntilWindowLoaded();
		const headerTitleElement = await app.client.$('.header__title');
		const headerTitleText = await headerTitleElement.getText();
		return assert.strictEqual(headerTitleText, 'pageobject-creation-tool');
	});

	// PageObject form error checking
	it('correct error is shown when clicking \'Generate\' with blank form and empty table', async () => {
		await app.client.waitUntilWindowLoaded();
		const errorElement = await app.client.$('.error');
		const generateButtonElement = await app.client.$('#generate-pageobject');

		assert.strictEqual(await errorElement.isDisplayed(), false, 'error element is incorrectly displayed');
		assert.strictEqual(await errorElement.getText(), '', 'error element text is not blank');
		
		await generateButtonElement.click();
		assert.strictEqual(await errorElement.isDisplayed(), true, 'error element is incorrectly hidden');
		assert.strictEqual(await errorElement.getText(), 'Unable to generate PageObject, a template is required.', 'error element text is blank');
	});
});