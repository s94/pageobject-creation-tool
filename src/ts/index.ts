// Elements
const pageObjectNameElement: HTMLInputElement = document.getElementById('pageobject-name') as HTMLInputElement;
const elementNameElement: HTMLInputElement = document.getElementById('element-name') as HTMLInputElement;
const elementTypeElement: HTMLSelectElement = document.getElementById('element-type') as HTMLSelectElement;
const elementIdElement: HTMLInputElement = document.getElementById('element-id') as HTMLInputElement;
const includeGetElement: HTMLInputElement = document.getElementById('include-get') as HTMLInputElement;
const elementTableElement: HTMLTableElement = document.getElementById('element-table') as HTMLTableElement;
const outputElement: HTMLTextAreaElement = document.getElementById('output') as HTMLTextAreaElement;
const modalElement: HTMLDivElement = document.getElementById('output-modal') as HTMLDivElement;

function populateElementTypeList(): void {
	const templateName: string | null = templateListElement.selectedOptions[0].textContent;

	let optionElement: HTMLOptionElement = document.createElement('option');

	if(templateName && templateName.length > 0) {
		const settingFromArray: PageObjectTemplate = settingsFileContent.filter((x: { TemplateName: string; }) => x.TemplateName === templateName)[0];

		removeChildFromElementType();
	
		let elementTypeArray: string[][] = [ ];
		for(let i: number = 0; i < settingFromArray.ElementType.length; i++) {
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
	
		for(let i: number = 0; i < elementTypeArray.length; i++) {
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
		while(elementTypeElement.hasChildNodes() && elementTypeElement.lastChild) {
			elementTypeElement.removeChild(elementTypeElement.lastChild);
		}
	}
}

function addElementToTable(): void {
	const elementTypeSelectedOption: HTMLOptionElement | null = elementTypeElement.selectedOptions[0];
	const elementTypeSelectedText: string = elementTypeSelectedOption.textContent ?? '';

	let isValid: boolean = true;
	if(elementNameElement.value === null || elementNameElement.value.trim().length <= 0) {
		isValid = false;
	}
	if(elementTypeSelectedText.length <= 0 || elementTypeSelectedOption.hidden) {
		isValid = false;
	}

	if(elementTableElement && isValid) {
		const row: HTMLTableRowElement = elementTableElement.insertRow(-1);
		const elementNameCell: HTMLTableCellElement = row.insertCell(0);
		const elementTypeCell: HTMLTableCellElement = row.insertCell(1);
		const elementIdCell: HTMLTableCellElement = row.insertCell(2);
		const getCell: HTMLTableCellElement = row.insertCell(3);
		const removeCell: HTMLTableCellElement = row.insertCell(4);

		elementNameCell.textContent = elementNameElement.value;
		elementTypeCell.textContent = elementTypeElement.selectedOptions[0].textContent;
		elementIdCell.textContent = elementIdElement.value;
		getCell.textContent = includeGetElement.checked ? "true" : "false";
		removeCell.innerHTML = removeButtonHTML;

		elementNameElement.value = '';
		elementTypeElement.selectedIndex = 0;
		elementIdElement.value = '';
		includeGetElement.checked = false;
	}
	else {
		showError('Element cannot be added to the table, submission is not valid.');
	}
}

function generatePageObject(): void {
	const templateListSelectedOption: HTMLOptionElement = templateListElement.selectedOptions[0];
	const templateName: string | null = templateListSelectedOption.textContent?.trim() ?? null;
	const pageObjectName: string = pageObjectNameElement.value.trim();

	if(templateName && templateName.length <= 0) {
		showError('Unable to generate PageObject, a template is required.');
		return;
	}
	else if(pageObjectName.length <= 0) {
		showError('Unable to generate PageObject, a PageObject name is required.');
		return;
	}

	let elementTableContent: string[][] = [ ];
	const elementTableRows: HTMLCollectionOf<HTMLTableRowElement> = elementTableElement.rows;

	if(elementTableRows.length <= 0) {
		showError('Unable to generate PageObject, element table cannot be empty.');
		return;
	}

	for(let i: number = 0; i < elementTableRows.length; i++) {
		const elementName: string = elementTableRows[i].children[0].textContent ?? '';
		const elementType: string = elementTableRows[i].children[1].textContent ?? '';
		const elementId: string = elementTableRows[i].children[2].textContent ?? '';
		const includeGet: string = elementTableRows[i].children[3].textContent ?? '';

		elementTableContent = [...elementTableContent, [elementName, elementType, elementId, includeGet]];
	}

	const settingFromArray: PageObjectTemplate = settingsFileContent.filter((x: { TemplateName: string; }) => x.TemplateName === templateName)[0];
	const pageObjectStructure: string = settingFromArray.PageObjectStructure;
	const elementDeclaration: string = settingFromArray.ElementDeclaration;

	let elementsStringBuilder: string = '';
	let generalMethodsStringBuilder: string = '';
	let getMethodsStringBuilder: string = '';

	for(let i: number = 0; i < elementTableContent.length; i++) {
		elementsStringBuilder += elementDeclaration.replace('${ElementName}', elementTableContent[i][0]).replace('${ElementType}', elementTableContent[i][1]).replace('${ElementId}', elementTableContent[i][2]);

		const generalMethodTemplate: string = settingFromArray.ElementType.filter(x => x[0] === elementTableContent[i][1])[0][1];
		generalMethodsStringBuilder += generalMethodTemplate.replaceAll('${ElementName}', elementTableContent[i][0]).replaceAll('${ElementType}', elementTableContent[i][1]);

		const getMethodTemplate: string = settingFromArray.ElementType.filter(x => x[0] === elementTableContent[i][1])[0][2];

		if(elementTableContent[i][3] === 'true') {
			getMethodsStringBuilder += getMethodTemplate.replaceAll('${ElementName}', elementTableContent[i][0]).replaceAll('${ElementType}', elementTableContent[i][1]);
		}
	}

	const output: string = pageObjectStructure.replaceAll('${PageObjectName}', pageObjectName).replace('${Elements}', elementsStringBuilder).replace('${GeneralMethods}', generalMethodsStringBuilder).replace('${GetMethods}', getMethodsStringBuilder);
	outputElement.textContent = output.replaceAll('\\n', '\n').replaceAll('\\t', '\t');

	modalElement.classList.remove('modal--hidden');
}

function closeModal(): void {
	modalElement.classList.add('modal--hidden');
}

function copyToClipboard(): void {
	const textToCopy: string = outputElement.value;

	navigator.clipboard.writeText(textToCopy).then(function() {
		return true;
	}, function() {
		return false;
	});
}
