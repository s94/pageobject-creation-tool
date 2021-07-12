// Elements
const templateNameElement = document.getElementById('template-name');
const elementTemplateElement = document.getElementById('element-declaration-template');
const pageObjectStructureElement = document.getElementById('pageobject-structure');
const elementTypeElement = document.getElementById('element-type');
const generalMethodTemplateElement = document.getElementById('general-method-template');
const getMethodTemplateElement = document.getElementById('get-method-template');
const elementTableElement = document.getElementById('element-type-table');

function loadTemplate() {
	const templateName = templateListElement.selectedOptions[0].textContent;

	if(templateName.length <= 0) {
		showError('Unable to load template, no template is selected.');
		return;
	}

	while(elementTableElement.hasChildNodes()) {
		elementTableElement.removeChild(elementTableElement.lastChild);
	}

	const settingFromArray = settingsFileContent.filter(x => x.TemplateName === templateName)[0];
	const elementDeclarationTemplate = settingFromArray.ElementDeclaration;
	const pageObjectStructure = settingFromArray.PageObjectStructure;
	const elementTypeArray = settingFromArray.ElementType;

	templateNameElement.value = templateName;
	elementTemplateElement.value = elementDeclarationTemplate;
	pageObjectStructureElement.value = pageObjectStructure;

	for(let i = 0; i < elementTypeArray.length; i++) {
		addToTable(elementTypeArray[i][0], elementTypeArray[i][1], elementTypeArray[i][2]);
	}
}

function addElementTypeToTable() {
	let isValid = true;
	if(elementTypeElement.value === null || elementTypeElement.value.trim().length <= 0) {
		isValid = false;
	}
	if(generalMethodTemplateElement.value === null || generalMethodTemplateElement.value.trim().length <= 0) {
		isValid = false;
	}

	if(elementTableElement && isValid) {
		addToTable(elementTypeElement.value, generalMethodTemplateElement.value, getMethodTemplateElement.value);
		elementTypeElement.value = null;
		generalMethodTemplateElement.value = null;
		getMethodTemplateElement.value = null;
	}
	else {
		showError('Element cannot be added to the table, submission is not valid.');
	}
}

function addToTable(elementType, generalMethodTemplate, getMethodTemplate) {
	const row = elementTableElement.insertRow(-1);
	const elementTypeCell = row.insertCell(0);
	const generalMethodTemplateCell = row.insertCell(1);
	const getMethodTemplateCell = row.insertCell(2);
	const removeCell = row.insertCell(3);

	elementTypeCell.textContent = elementType;
	generalMethodTemplateCell.textContent = generalMethodTemplate;
	getMethodTemplateCell.textContent = getMethodTemplate;
	removeCell.innerHTML = removeButtonHTML;
}

function saveTemplate() {
	const templateName = templateNameElement.value.trim();
	const elementTemplate = elementTemplateElement.value;
	const pageObjectStructure = pageObjectStructureElement.value;
	const checkArrayForExisting = settingsFileContent.filter(x => x.TemplateName === templateName)[0];

	if(elementTemplate.length <= 0) {
		showError('Unable to save template, element declaration is required.');
		return;
	}
	else if(pageObjectStructure.length <= 0) {
		showError('Unable to save template, PageObject structure is required.');
		return;
	}

	let templateObject = {
		TemplateName: templateName,
		ElementDeclaration: elementTemplate.trim(),
		ElementType: [ ],
		PageObjectStructure: pageObjectStructure.trim()
	}

	const templateTableRows = elementTableElement.rows;

	if(templateTableRows.length <= 0) {
		showError('Unable to save template, element table cannot be empty.');
		return;
	}

	for(let i = 0; i < templateTableRows.length; i++) {
		const elementType = templateTableRows[i].children[0].textContent.trim();
		const generalMethodTemplate = templateTableRows[i].children[1].textContent.trim();
		const getMethodTemplate = templateTableRows[i].children[2].textContent.trim();

		templateObject.ElementType = [...templateObject.ElementType, [elementType, generalMethodTemplate, getMethodTemplate]];
	}

	if(templateName.length > 0 && checkArrayForExisting !== undefined) {
		for(let i = 0; i < settingsFileContent.length; i++) {
			if(settingsFileContent[i].TemplateName === templateName) {
				settingsFileContent[i] = templateObject;
				writeToTemplateFile(JSON.stringify(settingsFileContent));
				break;
			}
		}
	}
	else if(templateName.length > 0 && checkArrayForExisting === undefined) {
		settingsFileContent = [...settingsFileContent, templateObject];
		writeToTemplateFile(JSON.stringify(settingsFileContent));
	}
	else {
		showError('Unable to save template, template name is required.');
	}
}

function deleteTemplate() {
	const templateName = templateListElement.selectedOptions[0].textContent;

	if(templateName.length <= 0) {
		showError('Unable to delete template, no template is selected.');
		return;
	}

	let index = 0;

	for(let i = 0; i < settingsFileContent.length; i++) {
		if(settingsFileContent[i].TemplateName === templateName) {
			index = i;
			break;
		}
	}

	settingsFileContent.splice(index, 1);
	writeToTemplateFile(JSON.stringify(settingsFileContent));
}

function writeToTemplateFile(jsonData) {
	fs.writeFileSync(path.resolve(__dirname, templateFile), jsonData);
	populateTemplateList();
}
