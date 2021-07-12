// Elements
const pageObjectNameElement = document.getElementById('pageobject-name');
const elementNameElement = document.getElementById('element-name');
const elementTypeElement = document.getElementById('element-type');
const elementIdElement = document.getElementById('element-id');
const includeGetElement = document.getElementById('include-get');
const elementTableElement = document.getElementById('element-table');
const outputElement = document.getElementById('output');
const modalElement = document.getElementById('output-modal');

function populateElementTypeList() {
	const templateName = templateListElement.selectedOptions[0].textContent;

	let optionElement = document.createElement('option');

	if(templateName.length > 0) {
		const settingFromArray = settingsFileContent.filter(x => x.TemplateName === templateName)[0];

		while(elementTypeElement.hasChildNodes()) {
			elementTypeElement.removeChild(elementTypeElement.lastChild);
		}
	
		let elementTypeArray = [ ];
		for(let i = 0; i < settingFromArray.ElementType.length; i++) {
			elementTypeArray = [...elementTypeArray, settingFromArray.ElementType[i]];
		}

		optionElement.value = '';
		optionElement.selected = true;
		optionElement.disabled = true;
		optionElement.hidden = true;
		optionElement.textContent = 'Please select...';
		elementTypeElement.appendChild(optionElement);

		optionElement = document.createElement('option');
		optionElement.value = 0;
		elementTypeElement.appendChild(optionElement);
	
		for(let i = 0; i < elementTypeArray.length; i++) {
			const optionElement = document.createElement('option');
			optionElement.value = i + 1;
			optionElement.textContent = elementTypeArray[i][0];
			elementTypeElement.appendChild(optionElement);
		}
	}
	else {
		while(elementTypeElement.hasChildNodes()) {
			elementTypeElement.removeChild(elementTypeElement.lastChild);
		}
		optionElement.value = 0;
		elementTypeElement.appendChild(optionElement);
	}
}

function addElementToTable() {
	let isValid = true;
	if(elementNameElement.value === null || elementNameElement.value.trim().length <= 0) {
		isValid = false;
	}
	if(elementTypeElement.selectedOptions[0].textContent.length <= 0 || elementTypeElement.selectedOptions[0].hidden) {
		isValid = false;
	}

	if(elementTableElement && isValid) {
		const row = elementTableElement.insertRow(-1);
		const elementNameCell = row.insertCell(0);
		const elementTypeCell = row.insertCell(1);
		const elementIdCell = row.insertCell(2);
		const getCell = row.insertCell(3);
		const removeCell = row.insertCell(4);

		elementNameCell.textContent = elementNameElement.value;
		elementTypeCell.textContent = elementTypeElement.selectedOptions[0].textContent;
		elementIdCell.textContent = elementIdElement.value;
		getCell.textContent = includeGetElement.checked;
		removeCell.innerHTML = removeButtonHTML;

		elementNameElement.value = null;
		elementTypeElement.selectedIndex = 0;
		elementIdElement.value = null;
		includeGetElement.checked = false;
	}
	else {
		showError('Element cannot be added to the table, submission is not valid.');
	}
}

function generatePageObject() {
	const templateName = templateListElement.selectedOptions[0].textContent.trim();
	const pageObjectName = pageObjectNameElement.value.trim();

	if(templateName.length <= 0) {
		showError('Unable to generate PageObject, a template is required.');
		return;
	}
	else if(pageObjectName.length <= 0) {
		showError('Unable to generate PageObject, a PageObject name is required.');
		return;
	}

	let elementTableContent = [ ];
	const elementTableRows = elementTableElement.rows;

	if(elementTableRows.length <= 0) {
		showError('Unable to generate PageObject, element table cannot be empty.');
		return;
	}

	for(let i = 0; i < elementTableRows.length; i++) {
		const elementName = elementTableRows[i].children[0].textContent;
		const elementType = elementTableRows[i].children[1].textContent;
		const elementId = elementTableRows[i].children[2].textContent;
		const includeGet = elementTableRows[i].children[3].textContent;

		elementTableContent = [...elementTableContent, [elementName, elementType, elementId, includeGet]];
	}

	const settingFromArray = settingsFileContent.filter(x => x.TemplateName === templateName)[0];
	const pageObjectStructure = settingFromArray.PageObjectStructure;
	const elementDeclaration = settingFromArray.ElementDeclaration;

	let elementsStringBuilder = '';
	let generalMethodsStringBuilder = '';
	let getMethodsStringBuilder = '';

	for(let i = 0; i < elementTableContent.length; i++) {
		elementsStringBuilder += elementDeclaration.replace('${ElementName}', elementTableContent[i][0]).replace('${ElementType}', elementTableContent[i][1]).replace('${ElementId}', elementTableContent[i][2]);

		const generalMethodTemplate = settingFromArray.ElementType.filter(x => x[0] === elementTableContent[i][1])[0][1];
		generalMethodsStringBuilder += generalMethodTemplate.replaceAll('${ElementName}', elementTableContent[i][0]).replaceAll('${ElementType}', elementTableContent[i][1]);

		const getMethodTemplate = settingFromArray.ElementType.filter(x => x[0] === elementTableContent[i][1])[0][2];

		if(elementTableContent[i][3] === 'true') {
			getMethodsStringBuilder += getMethodTemplate.replaceAll('${ElementName}', elementTableContent[i][0]).replaceAll('${ElementType}', elementTableContent[i][1]);
		}
	}

	const output = pageObjectStructure.replaceAll('${PageObjectName}', pageObjectName).replace('${Elements}', elementsStringBuilder).replace('${GeneralMethods}', generalMethodsStringBuilder).replace('${GetMethods}', getMethodsStringBuilder);
	outputElement.textContent = output.replaceAll('\\n', '\n').replaceAll('\\t', '\t');

	modalElement.classList.remove('modal--hidden');
}

function closeModal() {
	modalElement.classList.add('modal--hidden');
}

function copyToClipboard() {
	const textToCopy = outputElement.value;

	navigator.clipboard.writeText(textToCopy).then(function() {
		return true;
	}, function() {
		return false;
	});
}
