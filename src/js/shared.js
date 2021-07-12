const fs = require('fs');
const path = require('path');
const templateFile = 'template.json';
const rawData = fs.readFileSync(path.resolve(__dirname, templateFile));

const removeButtonHTML = '<button class=\'table__button--remove\' onclick=\'deleteRowFromTable(this);\'>Remove</button>';

const headerElement = document.getElementsByClassName('header')[0];
const errorElement = document.getElementsByClassName('error')[0];
const templateListElement = document.getElementById('template-list');

let settingsFileContent = JSON.parse(rawData);
let errorMessageTimeout = null;

function populateTemplateList() {
	while(templateListElement.hasChildNodes()) {
		templateListElement.removeChild(templateListElement.lastChild);
	}

	const optionElement = document.createElement('option');
	optionElement.value = 0;
	templateListElement.appendChild(optionElement);

	for(i = 0; i < settingsFileContent.length; i++) {
		const optionElement = document.createElement('option');
		optionElement.value = i + 1;
		optionElement.innerHTML = settingsFileContent[i].TemplateName;
		templateListElement.appendChild(optionElement);
	}
}

function deleteRowFromTable(element) {
	const index = element.parentNode.parentNode.rowIndex - 1;
	elementTableElement.deleteRow(index);
}

function showError(errorMessage) {
	if(errorElement.textContent === errorMessage) {
		return;
	}
	else if(errorMessageTimeout !== null) {
		clearTimeout(errorMessageTimeout);
		errorMessageTimeout = null;
	}

	errorElement.textContent = errorMessage;
	headerElement.classList.add('header--error');
	errorElement.classList.remove('error--hidden');

	errorMessageTimeout = setTimeout(() => {
		errorElement.textContent = '';
		errorElement.classList.add('error--hidden');
		headerElement.classList.remove('header--error');
	}, 3000);
}
