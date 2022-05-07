// Elements
const pageObjectNameElement: HTMLInputElement = document.getElementById('pageobject-name') as HTMLInputElement;
const elementNameElement: HTMLInputElement = document.getElementById('element-name') as HTMLInputElement;
const elementTypeElement: HTMLSelectElement = document.getElementById('element-type') as HTMLSelectElement;
const elementLocatorElement: HTMLInputElement = document.getElementById('element-locator') as HTMLInputElement;
const includeGetElement: HTMLInputElement = document.getElementById('include-get') as HTMLInputElement;
const addElementButton: HTMLButtonElement = document.getElementById('add-element-button') as HTMLButtonElement;
const elementTableElement: HTMLTableElement = document.getElementById('element-table') as HTMLTableElement;
const outputElement: HTMLElement = document.getElementById('output') as HTMLElement;
const modalElement: HTMLDivElement = document.getElementById('output-modal') as HTMLDivElement;
const syntaxHighlightingElement: HTMLSelectElement = document.getElementById('syntax-list') as HTMLSelectElement;

let editElementTableRowIndex: number | undefined = undefined;

function populateElementTypeList(): void {
	const templateName: string | null = templateListElement.selectedOptions[0].textContent;

	let optionElement: HTMLOptionElement = document.createElement('option');

	if (templateName && templateName.length > 0) {
		const settingFromArray: PageObjectTemplate = settingsFileContent.filter((x: { TemplateName: string; }) => x.TemplateName === templateName)[0];

		removeChildFromElementType();
	
		let elementTypeArray: string[][] = [ ];
		for (let i: number = 0; i < settingFromArray.ElementType.length; i++) {
			elementTypeArray = [...elementTypeArray, settingFromArray.ElementType[i]];
		}

		optionElement.value = '';
		optionElement.selected = true;
		optionElement.disabled = true;
		optionElement.hidden = true;
		optionElement.textContent = 'Please select...';
		elementTypeElement.appendChild(optionElement);

		optionElement = document.createElement('option');
		optionElement.value = '0';
		elementTypeElement.appendChild(optionElement);
	
		for (let i: number = 0; i < elementTypeArray.length; i++) {
			const optionElement = document.createElement('option');
			optionElement.value = (i + 1).toString();
			optionElement.textContent = elementTypeArray[i][0];
			elementTypeElement.appendChild(optionElement);
		}
	}
	else {
		removeChildFromElementType();
		optionElement.value = '0';
		elementTypeElement.appendChild(optionElement);
	}

	function removeChildFromElementType(): void {
		while (elementTypeElement.hasChildNodes() && elementTypeElement.lastChild) {
			elementTypeElement.removeChild(elementTypeElement.lastChild);
		}
	}
}

function addElementToTable(): void {
	const elementTypeSelectedOption: HTMLOptionElement | null = elementTypeElement.selectedOptions[0];
	const elementTypeSelectedText: string = elementTypeSelectedOption.textContent ?? '';

	let isValid: boolean = true;
	if (elementNameElement.value === null || elementNameElement.value.trim().length <= 0) {
		isValid = false;
	}
	if (elementTypeSelectedText.length <= 0 || elementTypeSelectedOption.hidden) {
		isValid = false;
	}

	if (elementTableElement && isValid && editElementTableRowIndex === undefined) {
		const editButtonHTML: string = '<button class=\'table__button--edit\' onclick=\'editElementFromTable(this);\'>Edit</button>';
		const removeButtonHTML: string = '<button class=\'table__button--remove\' onclick=\'deleteElementFromTable(this);\'>Remove</button>';

		const row: HTMLTableRowElement = elementTableElement.insertRow(-1);
		const elementNameCell: HTMLTableCellElement = row.insertCell(0);
		const elementTypeCell: HTMLTableCellElement = row.insertCell(1);
		const elementLocatorCell: HTMLTableCellElement = row.insertCell(2);
		const getCell: HTMLTableCellElement = row.insertCell(3);
		const editCell: HTMLTableCellElement = row.insertCell(4);
		const removeCell: HTMLTableCellElement = row.insertCell(5);

		elementNameCell.classList.add('overflow-wrap-anywhere');
		elementLocatorCell.classList.add('overflow-wrap-anywhere');

		elementNameCell.textContent = elementNameElement.value;
		elementTypeCell.textContent = elementTypeElement.selectedOptions[0].textContent;
		elementLocatorCell.textContent = elementLocatorElement.value;
		getCell.textContent = includeGetElement.checked ? "true" : "false";
		editCell.innerHTML = editButtonHTML;
		removeCell.innerHTML = removeButtonHTML;

		resetAddElementForm();
	}
	else if (elementTableElement && isValid && editElementTableRowIndex !== undefined) {
		const row: HTMLTableRowElement = elementTableElement.rows[editElementTableRowIndex];
		const elementNameCell: HTMLTableCellElement = row.cells[0];
		const elementTypeCell: HTMLTableCellElement = row.cells[1];
		const elementLocatorCell: HTMLTableCellElement = row.cells[2];
		const getCell: HTMLTableCellElement = row.cells[3];

		elementNameCell.textContent = elementNameElement.value;
		elementTypeCell.textContent = elementTypeElement.selectedOptions[0].textContent;
		elementLocatorCell.textContent = elementLocatorElement.value;
		getCell.textContent = includeGetElement.checked ? "true" : "false";

		resetAddElementForm();
	}
	else {
		showError('Element cannot be added to the table, submission is not valid.');
	}
}

function resetAddElementForm(): void {
	elementNameElement.value = '';
	elementTypeElement.selectedIndex = 0;
	elementLocatorElement.value = '';
	includeGetElement.checked = false;
	addElementButton.textContent = 'Add';
	editElementTableRowIndex = undefined;
}

function editElementFromTable(buttonElement: HTMLButtonElement): void {
	const tableCellElement: HTMLTableCellElement = buttonElement.parentNode as HTMLTableCellElement;
	const tableRowElement: HTMLTableRowElement = tableCellElement.parentNode as HTMLTableRowElement;

	const elementNameCellContent: string = tableRowElement.cells[0].textContent ?? '';
	const elementTypeCellContent: string = tableRowElement.cells[1].textContent ?? '';
	const elementLocatorCellContent: string = tableRowElement.cells[2].textContent ?? '';
	const includeGetCellContent: boolean = tableRowElement.cells[3].textContent == 'true';

	for (let i: number = 0; i < elementTypeElement.options.length; i++) {
		if (elementTypeElement.options[i].textContent == elementTypeCellContent) {
			elementTypeElement.value = (i - 1).toString();
			break;
		}
	}
	elementNameElement.value = elementNameCellContent;
	elementLocatorElement.value = elementLocatorCellContent;
	includeGetElement.checked = includeGetCellContent;

	editElementTableRowIndex = tableRowElement.rowIndex - 1;
	addElementButton.textContent = 'Update';
}

function deleteElementFromTable(buttonElement: HTMLButtonElement): void {
	const tableCellElement: HTMLTableCellElement = buttonElement.parentNode as HTMLTableCellElement;
	const tableRowElement: HTMLTableRowElement = tableCellElement.parentNode as HTMLTableRowElement;
	const tableElement: HTMLTableElement = tableRowElement.parentNode as HTMLTableElement;
	const index: number = tableRowElement.rowIndex - 1;
	tableElement.deleteRow(index);

	if (editElementTableRowIndex !== undefined) {
		resetAddElementForm();
	}
}

function generatePageObject(): void {
	const templateListSelectedOption: HTMLOptionElement = templateListElement.selectedOptions[0];
	const templateName: string = templateListSelectedOption.textContent?.trim() ?? '';
	const pageObjectName: string = pageObjectNameElement.value.trim();

	if (templateName.length <= 0) {
		showError('Unable to generate PageObject, a template is required.');
		return;
	}
	else if (pageObjectName.length <= 0) {
		showError('Unable to generate PageObject, a PageObject name is required.');
		return;
	}

	let elementTableContent: string[][] = [ ];
	const elementTableRows: HTMLCollectionOf<HTMLTableRowElement> = elementTableElement.rows;

	if (elementTableRows.length <= 0) {
		showError('Unable to generate PageObject, element table cannot be empty.');
		return;
	}

	for (let i: number = 0; i < elementTableRows.length; i++) {
		const elementName: string = elementTableRows[i].children[0].textContent ?? '';
		const elementType: string = elementTableRows[i].children[1].textContent ?? '';
		const elementLocator: string = elementTableRows[i].children[2].textContent ?? '';
		const includeGet: string = elementTableRows[i].children[3].textContent ?? '';

		elementTableContent = [...elementTableContent, [elementName, elementType, elementLocator, includeGet]];
	}

	const settingFromArray: PageObjectTemplate = settingsFileContent.filter((x: { TemplateName: string; }) => x.TemplateName === templateName)[0];
	const pageObjectStructure: string = settingFromArray.PageObjectStructure;
	const elementDeclaration: string = settingFromArray.ElementDeclaration;

	let elementsStringBuilder: string = '';
	let generalMethodsStringBuilder: string = '';
	let getMethodsStringBuilder: string = '';

	for (let i: number = 0; i < elementTableContent.length; i++) {
		const variableCheckModel: VariableCheckModel[] = [
			{
				searchValue: '${ElementName}',
				camelCaseSearchValue: '${elementName}',
				replaceValue: elementTableContent[i][0]
			},
			{
				searchValue: '${ElementType}',
				camelCaseSearchValue: '${elementType}',
				replaceValue: elementTableContent[i][1]
			},
			{
				searchValue: '${ElementLocator}',
				camelCaseSearchValue: undefined,
				replaceValue: elementTableContent[i][2]
			}
		]

		elementsStringBuilder += getValueForStringBuilder(elementDeclaration, variableCheckModel);

		const generalMethodTemplate: string = settingFromArray.ElementType.filter(x => x[0] === elementTableContent[i][1])[0][1];
		generalMethodsStringBuilder += getValueForStringBuilder(generalMethodTemplate, variableCheckModel);

		const getMethodTemplate: string = settingFromArray.ElementType.filter(x => x[0] === elementTableContent[i][1])[0][2];

		if (elementTableContent[i][3] === 'true') {
			getMethodsStringBuilder += getValueForStringBuilder(getMethodTemplate, variableCheckModel);
		}
	}

	const output: string = pageObjectStructure.replaceAll('${PageObjectName}', pageObjectName)
											  .replace('${Elements}', elementsStringBuilder)
											  .replace('${GeneralMethods}', generalMethodsStringBuilder)
											  .replace('${GetMethods}', getMethodsStringBuilder);

	outputElement.textContent = output.replaceAll('\\n', '\n').replaceAll('\\t', '\t');

	modalElement.classList.remove('modal--hidden');

	function getValueForStringBuilder(stringToCheck: string, variableCheckModel: VariableCheckModel[]): string {
		let temp: string = stringToCheck;
		for (let i: number = 0; i < variableCheckModel.length; i++) {
			const variableToCheck: VariableCheckModel = variableCheckModel[i];
			temp = checkForCamelCaseAndReplace(temp, variableToCheck.searchValue, variableToCheck.camelCaseSearchValue, variableToCheck.replaceValue);
		}
		return temp;
	}

	function checkForCamelCaseAndReplace(stringToCheck: string, searchValue: string, camelCaseSearchValue: string | undefined, replaceValue: string): string {
		let retVal: string = stringToCheck.replaceAll(searchValue, replaceValue);

		if (camelCaseSearchValue !== undefined && stringToCheck.includes(camelCaseSearchValue)) {
			retVal = retVal.replaceAll(camelCaseSearchValue, `${replaceValue[0].toLocaleLowerCase()}${replaceValue.slice(1)}`);
		}

		return retVal;
	}
}

let previouslySelectedSyntax: string | undefined = undefined;

function updateSyntaxHighlighting(): void {
	const getSelectedSyntax: string = syntaxHighlightingElement.selectedOptions[0].value;

	if (previouslySelectedSyntax !== undefined) {
		outputElement.parentElement?.classList.remove(`language-${previouslySelectedSyntax}`);
		outputElement.classList.remove(`language-${previouslySelectedSyntax}`);
	}
	outputElement.parentElement?.classList.add(`language-${getSelectedSyntax}`);
	outputElement.classList.add(`language-${getSelectedSyntax}`);

	// @ts-ignore
	Prism.highlightAll();
	previouslySelectedSyntax = getSelectedSyntax;
}

function closeModal(): void {
	modalElement.classList.add('modal--hidden');
}

function copyToClipboard(): void {
	const textToCopy: string = outputElement.textContent ?? '';

	navigator.clipboard.writeText(textToCopy).then(function() {
		return true;
	}, function() {
		return false;
	});
}

interface VariableCheckModel {
	searchValue: string,
	camelCaseSearchValue: string | undefined,
	replaceValue: string
}
