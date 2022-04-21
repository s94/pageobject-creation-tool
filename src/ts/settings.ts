// Elements
const templateNameElement: HTMLInputElement = document.getElementById('template-name') as HTMLInputElement;
const elementTemplateElement: HTMLTextAreaElement = document.getElementById('element-declaration-template') as HTMLTextAreaElement;
const pageObjectStructureElement: HTMLTextAreaElement = document.getElementById('pageobject-structure') as HTMLTextAreaElement;
const generalMethodTemplateElement: HTMLTextAreaElement = document.getElementById('general-method-template') as HTMLTextAreaElement;
const getMethodTemplateElement: HTMLTextAreaElement = document.getElementById('get-method-template') as HTMLTextAreaElement;
const elementTypeTableElement: HTMLTableElement = document.getElementById('element-type-table') as HTMLTableElement;

function loadTemplate(): void {
	const templateName: string = templateListElement?.selectedOptions[0].textContent ?? "";

	if(templateName && templateName.length <= 0) {
		showError('Unable to load template, no template is selected.');
		return;
	}

	while(elementTypeTableElement?.hasChildNodes() && elementTypeTableElement.lastChild) {
		elementTypeTableElement.removeChild(elementTypeTableElement.lastChild);
	}

	const settingFromArray: PageObjectTemplate = settingsFileContent.filter((x: { TemplateName: string; }) => x.TemplateName === templateName)[0];
	const elementDeclarationTemplate: string = settingFromArray.ElementDeclaration;
	const pageObjectStructure: string = settingFromArray.PageObjectStructure;
	const elementTypeArray: string[][] = settingFromArray.ElementType;

	templateNameElement.value = templateName;
	elementTemplateElement.value = elementDeclarationTemplate;
	pageObjectStructureElement.value = pageObjectStructure;

	for(let i: number = 0; i < elementTypeArray.length; i++) {
		addToTable(elementTypeArray[i][0], elementTypeArray[i][1], elementTypeArray[i][2]);
	}
}

function addElementTypeToTable(): void {
	const elementTypeElement: HTMLInputElement = document.getElementById('element-type') as HTMLInputElement;
	let isValid = true;
	if(elementTypeElement.value === null || elementTypeElement.value.trim().length <= 0) {
		isValid = false;
	}
	if(generalMethodTemplateElement.value === null || generalMethodTemplateElement.value.trim().length <= 0) {
		isValid = false;
	}

	if(elementTypeTableElement && isValid) {
		addToTable(elementTypeElement.value, generalMethodTemplateElement.value, getMethodTemplateElement.value);
		elementTypeElement.value = '';
		generalMethodTemplateElement.value = '';
		getMethodTemplateElement.value = '';
	}
	else {
		showError('Element cannot be added to the table, submission is not valid.');
	}
}

function addToTable(elementType: string, generalMethodTemplate: string, getMethodTemplate: string): void {
	const row: HTMLTableRowElement = elementTypeTableElement.insertRow(-1);
	const elementTypeCell: HTMLTableCellElement = row.insertCell(0);
	const generalMethodTemplateCell: HTMLTableCellElement = row.insertCell(1);
	const getMethodTemplateCell: HTMLTableCellElement = row.insertCell(2);
	const removeCell: HTMLTableCellElement = row.insertCell(3);

	elementTypeCell.textContent = elementType;
	generalMethodTemplateCell.textContent = generalMethodTemplate;
	getMethodTemplateCell.textContent = getMethodTemplate;
	removeCell.innerHTML = removeButtonHTML;
}

function saveTemplate(): void {
	const templateName: string = templateNameElement?.value.trim() ?? '';
	const elementTemplate: string = elementTemplateElement?.value ?? '';
	const pageObjectStructure: string = pageObjectStructureElement?.value ?? '';
	const checkArrayForExisting: boolean = settingsFileContent.filter((x: { TemplateName: string; }) => x.TemplateName === templateName)[0] ? true : false;

	if(elementTemplate.length <= 0) {
		showError('Unable to save template, element declaration is required.');
		return;
	}
	else if(pageObjectStructure.length <= 0) {
		showError('Unable to save template, PageObject structure is required.');
		return;
	}

	let templateObject: PageObjectTemplate = new PageObjectTemplate(templateName, elementTemplate.trim(), [ ], pageObjectStructure.trim());

	const templateTableRows: HTMLCollectionOf<HTMLTableRowElement> = elementTypeTableElement?.rows;

	if(templateTableRows.length <= 0) {
		showError('Unable to save template, element table cannot be empty.');
		return;
	}

	for(let i: number = 0; i < templateTableRows.length; i++) {
		const templateTableRow: HTMLTableRowElement = templateTableRows[i];
		const elementTypeTableRowCell: HTMLTableCellElement = templateTableRow.children[0] as HTMLTableCellElement;
		const generalMethodTemplateTableRowCell: HTMLTableCellElement = templateTableRow.children[1] as HTMLTableCellElement;
		const getMethodTemplateTableRowCell: HTMLTableCellElement = templateTableRow.children[2] as HTMLTableCellElement;
		const elementType: string = elementTypeTableRowCell?.textContent?.trim() ?? '';
		const generalMethodTemplate: string = generalMethodTemplateTableRowCell?.textContent?.trim() ?? '';
		const getMethodTemplate: string = getMethodTemplateTableRowCell?.textContent?.trim() ?? '';

		templateObject.ElementType = [...templateObject.ElementType, [elementType, generalMethodTemplate, getMethodTemplate]];
	}

	if(templateName.length > 0 && checkArrayForExisting !== undefined) {
		for(let i: number = 0; i < settingsFileContent.length; i++) {
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

function deleteTemplate(): void {
	const templateName: string | null = templateListElement?.selectedOptions[0].textContent;

	if(templateName && templateName.length <= 0) {
		showError('Unable to delete template, no template is selected.');
		return;
	}

	let index: number = 0;

	for(let i: number = 0; i < settingsFileContent.length; i++) {
		if(settingsFileContent[i].TemplateName === templateName) {
			index = i;
			break;
		}
	}

	settingsFileContent.splice(index, 1);
	writeToTemplateFile(JSON.stringify(settingsFileContent));
}

function writeToTemplateFile(jsonData: string): void {
	fs.writeFileSync(path.resolve(__dirname, templateFile), jsonData);
	populateTemplateList();
}
