const fs: any = require('fs');
const path: any = require('path');
const templateFile: string = 'template.json';
const rawData: any = fs.readFileSync(path.resolve(__dirname, templateFile));

const removeButtonHTML: string = '<button class=\'table__button--remove\' onclick=\'deleteRowFromTable(this);\'>Remove</button>';

const headerElement: Element = document.getElementsByClassName('header')[0];
const errorElement: Element = document.getElementsByClassName('error')[0];
const templateListElement: HTMLSelectElement = document.getElementById('template-list') as HTMLSelectElement;

let settingsFileContent: PageObjectTemplate[] = JSON.parse(rawData);
let errorMessageTimeout: NodeJS.Timeout | null = null;

function populateTemplateList(): void {
	while(templateListElement?.hasChildNodes() && templateListElement.lastChild) {
		templateListElement.removeChild(templateListElement.lastChild);
	}

	const optionElement: HTMLOptionElement = document.createElement('option');
	optionElement.value = '0';
	templateListElement?.appendChild(optionElement);

	for(let i: number = 0; i < settingsFileContent.length; i++) {
		const optionElement: HTMLOptionElement = document.createElement('option');
		optionElement.value = (i + 1).toString();
		optionElement.innerHTML = settingsFileContent[i].TemplateName;
		templateListElement?.appendChild(optionElement);
	}
}

function deleteRowFromTable(buttonElement: HTMLButtonElement): void {
	const tableCellElement: HTMLTableCellElement = buttonElement.parentNode as HTMLTableCellElement;
	const tableRowElement: HTMLTableRowElement = tableCellElement.parentNode as HTMLTableRowElement;
	const tableElement: HTMLTableElement = tableRowElement.parentNode as HTMLTableElement;
	const index: number = tableRowElement.rowIndex - 1;
	tableElement.deleteRow(index);
}

function showError(errorMessage: string): void {
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

class PageObjectTemplate {

	public readonly TemplateName: string;
	public readonly ElementDeclaration: string;
	public ElementType: string[][];
	public readonly PageObjectStructure: string;

	constructor(templateName: string, elementDeclaration: string, elementType: string[][], pageObjectStructure: string) {
		this.TemplateName = templateName;
		this.ElementDeclaration = elementDeclaration;
		this.ElementType = elementType;
		this.PageObjectStructure = pageObjectStructure;
	}
}
