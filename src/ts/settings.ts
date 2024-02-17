// Elements
const templateNameElement: HTMLInputElement = document.getElementById('template-name') as HTMLInputElement;
const elementTemplateElement: HTMLTextAreaElement = document.getElementById('element-declaration-template') as HTMLTextAreaElement;
const templateElementTypeElement: HTMLInputElement = document.getElementById('element-type') as HTMLInputElement;
const pageObjectStructureElement: HTMLTextAreaElement = document.getElementById('pageobject-structure') as HTMLTextAreaElement;
const generalMethodTemplateElement: HTMLTextAreaElement = document.getElementById('general-method-template') as HTMLTextAreaElement;
const getMethodTemplateElement: HTMLTextAreaElement = document.getElementById('get-method-template') as HTMLTextAreaElement;
const addElementTypeButton: HTMLButtonElement = document.getElementById('add-element-type-button') as HTMLButtonElement;
const elementTypeTableElement: HTMLTableElement = document.getElementById('element-type-table') as HTMLTableElement;

let editElementTypeTableRowIndex: number | undefined = undefined;

function loadTemplate(): void {
	const templateName: string | null = templateListElement?.selectedOptions[0].textContent;

	if (templateName === null || templateName.length <= 0) {
		showError('Unable to load template, no template is selected.');
		return;
	}

	while (elementTypeTableElement?.hasChildNodes() && elementTypeTableElement.lastChild) {
		elementTypeTableElement.removeChild(elementTypeTableElement.lastChild);
	}

	const settingFromArray: PageObjectTemplate = settingsFileContent.filter((x: { TemplateName: string; }) => x.TemplateName === templateName)[0];
	const elementDeclarationTemplate: string = settingFromArray.ElementDeclaration;
	const pageObjectStructure: string = settingFromArray.PageObjectStructure;
	const elementTypeArray: string[][] = settingFromArray.ElementType;

	templateNameElement.value = templateName;
	elementTemplateElement.value = elementDeclarationTemplate;
	pageObjectStructureElement.value = pageObjectStructure;

	for (let i: number = 0; i < elementTypeArray.length; i++) {
		addToTable(elementTypeArray[i][0], elementTypeArray[i][1], elementTypeArray[i][2]);
	}
}

function addElementTypeToTable(): void {
	let isValid = true;
	if (templateElementTypeElement.value === null || templateElementTypeElement.value.trim().length <= 0) {
		isValid = false;
	}

	if (elementTypeTableElement && isValid && editElementTypeTableRowIndex === undefined) {
		addToTable(templateElementTypeElement.value, generalMethodTemplateElement.value, getMethodTemplateElement.value);
		resetAddElementTypeForm();
	}
	else if (elementTypeTableElement && isValid && editElementTypeTableRowIndex !== undefined) {
		const row: HTMLTableRowElement = elementTypeTableElement.rows[editElementTypeTableRowIndex];
		const elementTypeCell: HTMLTableCellElement = row.cells[0];
		const generalMethodTemplateCell: HTMLTableCellElement = row.cells[1];
		const getMethodTemplateCell: HTMLTableCellElement = row.cells[2];

		elementTypeCell.textContent = templateElementTypeElement.value;
		generalMethodTemplateCell.textContent = generalMethodTemplateElement.value;
		getMethodTemplateCell.textContent = getMethodTemplateElement.value;
		resetAddElementTypeForm();
	}
	else {
		showError('Element cannot be added to the table, submission is not valid.');
	}
}

function addToTable(elementType: string, generalMethodTemplate: string, getMethodTemplate: string): void {
	const editButtonHTML: string = '<button class=\'table__button--edit\' onclick=\'editFromTable(this);\'>Edit</button>';
	const removeButtonHTML: string = '<button class=\'table__button--remove\' onclick=\'deleteFromTable(this);\'>Remove</button>';

	const row: HTMLTableRowElement = elementTypeTableElement.insertRow(-1);
	const elementTypeCell: HTMLTableCellElement = row.insertCell(0);
	const generalMethodTemplateCell: HTMLTableCellElement = row.insertCell(1);
	const getMethodTemplateCell: HTMLTableCellElement = row.insertCell(2);
	const editCell: HTMLTableCellElement = row.insertCell(3);
	const removeCell: HTMLTableCellElement = row.insertCell(4);

	generalMethodTemplateCell.classList.add('overflow-wrap-anywhere');
	getMethodTemplateCell.classList.add('overflow-wrap-anywhere');

	elementTypeCell.textContent = elementType;
	generalMethodTemplateCell.textContent = generalMethodTemplate;
	getMethodTemplateCell.textContent = getMethodTemplate;
	editCell.innerHTML = editButtonHTML;
	removeCell.innerHTML = removeButtonHTML;
}

function editFromTable(buttonElement: HTMLButtonElement): void {
	const tableCellElement: HTMLTableCellElement = buttonElement.parentNode as HTMLTableCellElement;
	const tableRowElement: HTMLTableRowElement = tableCellElement.parentNode as HTMLTableRowElement;

	const elementTypeCellContent: string = tableRowElement.cells[0].textContent ?? '';
	const generalMethodTemplateCellContent: string = tableRowElement.cells[1].textContent ?? '';
	const getMethodTemplateCellContent: string = tableRowElement.cells[2].textContent ?? '';

	templateElementTypeElement.value = elementTypeCellContent;
	generalMethodTemplateElement.value = generalMethodTemplateCellContent;
	getMethodTemplateElement.value = getMethodTemplateCellContent;

	editElementTypeTableRowIndex = tableRowElement.rowIndex - 1;
	addElementTypeButton.textContent = 'Update';
}

function deleteFromTable(buttonElement: HTMLButtonElement): void {
	const tableCellElement: HTMLTableCellElement = buttonElement.parentNode as HTMLTableCellElement;
	const tableRowElement: HTMLTableRowElement = tableCellElement.parentNode as HTMLTableRowElement;
	const tableElement: HTMLTableElement = tableRowElement.parentNode as HTMLTableElement;
	const index: number = tableRowElement.rowIndex - 1;
	tableElement.deleteRow(index);

	if (editElementTypeTableRowIndex !== undefined) {
		resetAddElementTypeForm();
	}
}

function resetAddElementTypeForm(): void {
	templateElementTypeElement.value = '';
	generalMethodTemplateElement.value = '';
	getMethodTemplateElement.value = '';
	addElementTypeButton.textContent = 'Add';
	editElementTypeTableRowIndex = undefined;
}

function saveTemplate(): void {
	const templateName: string = templateNameElement?.value.trim() ?? '';
	const elementTemplate: string = elementTemplateElement?.value ?? '';
	const pageObjectStructure: string = pageObjectStructureElement?.value ?? '';
	const checkArrayForExisting: PageObjectTemplate | undefined = settingsFileContent.filter((x: { TemplateName: string; }) => x.TemplateName === templateName)[0];

	if (pageObjectStructure.length <= 0) {
		showError('Unable to save template, PageObject structure is required.');
		return;
	}

	let templateObject: PageObjectTemplate = new PageObjectTemplate(templateName, elementTemplate.trim(), [ ], pageObjectStructure.trim());

	const templateTableRows: HTMLCollectionOf<HTMLTableRowElement> = elementTypeTableElement?.rows;

	if (templateTableRows.length <= 0) {
		showError('Unable to save template, element table cannot be empty.');
		return;
	}

	for (let i: number = 0; i < templateTableRows.length; i++) {
		const templateTableRow: HTMLTableRowElement = templateTableRows[i];
		const elementTypeTableRowCell: HTMLTableCellElement = templateTableRow.children[0] as HTMLTableCellElement;
		const generalMethodTemplateTableRowCell: HTMLTableCellElement = templateTableRow.children[1] as HTMLTableCellElement;
		const getMethodTemplateTableRowCell: HTMLTableCellElement = templateTableRow.children[2] as HTMLTableCellElement;
		const elementType: string = elementTypeTableRowCell?.textContent?.trim() ?? '';
		const generalMethodTemplate: string = generalMethodTemplateTableRowCell?.textContent?.trim() ?? '';
		const getMethodTemplate: string = getMethodTemplateTableRowCell?.textContent?.trim() ?? '';

		templateObject.ElementType = [...templateObject.ElementType, [elementType, generalMethodTemplate, getMethodTemplate]];
	}

	if (templateName.length > 0 && checkArrayForExisting !== undefined) {
		for (let i: number = 0; i < settingsFileContent.length; i++) {
			if (settingsFileContent[i].TemplateName === templateName) {
				settingsFileContent[i] = templateObject;
				writeToTemplateFile(JSON.stringify(settingsFileContent));
				break;
			}
		}
	}
	else if (templateName.length > 0 && checkArrayForExisting === undefined) {
		settingsFileContent = [...settingsFileContent, templateObject];
		writeToTemplateFile(JSON.stringify(settingsFileContent));
	}
	else {
		showError('Unable to save template, template name is required.');
	}
}

function deleteTemplate(): void {
	const templateName: string | null = templateListElement?.selectedOptions[0].textContent;

	if (templateName === null || templateName.length <= 0) {
		showError('Unable to delete template, no template is selected.');
		return;
	}

	let index: number = 0;

	for (let i: number = 0; i < settingsFileContent.length; i++) {
		if (settingsFileContent[i].TemplateName === templateName) {
			index = i;
			break;
		}
	}

	settingsFileContent.splice(index, 1);
	writeToTemplateFile(JSON.stringify(settingsFileContent));
}

function clearTemplateForm(): void {
	templateNameElement.value = '';
	elementTemplateElement.value = '';
	pageObjectStructureElement.value = '';
	resetAddElementTypeForm();
	while (elementTypeTableElement.hasChildNodes() && elementTypeTableElement.lastChild) {
		elementTypeTableElement.removeChild(elementTypeTableElement.lastChild);
	}
}

function writeToTemplateFile(jsonData: string): void {
	fs.writeFileSync(path.resolve(__dirname, templateFile), jsonData);
	populateTemplateList();
	clearTemplateForm();
}
