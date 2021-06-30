const elementTableId = "element-type-table";

function loadTemplate() {
	const templateName = document.getElementById("template-list").selectedOptions[0].textContent;

	if (templateName.length <= 0) {
		return;
	}

	const elementTable = document.getElementById(elementTableId);
	while (elementTable.hasChildNodes()) {
		elementTable.removeChild(elementTable.lastChild);
	}

	const settingFromArray = settingsFileContent.filter(x => x.TemplateName == templateName)[0];
	const elementDeclarationTemplate = settingFromArray.ElementDeclaration;
	const pageObjectStructure = settingFromArray.PageObjectStructure;
	const elementTypeArray = settingFromArray.ElementType;

	document.getElementById("template-name").value = templateName;
	document.getElementById("element-declaration-template").value = elementDeclarationTemplate;
	document.getElementById("pageobject-structure").value = pageObjectStructure;

	for	(i = 0; i < elementTypeArray.length; i++) {
		addElementTypeToTableFromTemplate(elementTypeArray[i][0], elementTypeArray[i][1], elementTypeArray[i][2]);
	}
}

function addElementTypeToTable() {
	const elementTable = document.getElementById(elementTableId);
	const elementType = document.getElementById("element-type");
	const generalMethodTemplate = document.getElementById("general-method-template");
	const getMethodTemplate = document.getElementById("get-method-template");

	var isValid = addElementTypeToTableValidation(elementType, generalMethodTemplate);

	if (elementTable && isValid) {
		const row = elementTable.insertRow(-1);
		const elementTypeCell = row.insertCell(0);
		const generalMethodTemplateCell = row.insertCell(1);
		const getMethodTemplateCell = row.insertCell(2);
		const removeCell = row.insertCell(3);

		elementTypeCell.innerHTML = elementType.value;
		generalMethodTemplateCell.innerHTML = generalMethodTemplate.value;
		getMethodTemplateCell.innerHTML = getMethodTemplate.value;
		removeCell.innerHTML = removeButtonHtml;

		elementType.value = null;
		generalMethodTemplateCell.value = null;
		getMethodTemplateCell.value = null;
	}
}

function addElementTypeToTableFromTemplate(elementType, generalMethodTemplate, getMethodTemplate) {
	const elementTable = document.getElementById(elementTableId);

	if (elementTable) {
		const row = elementTable.insertRow(-1);
		const elementTypeCell = row.insertCell(0);
		const generalMethodTemplateCell = row.insertCell(1);
		const getMethodTemplateCell = row.insertCell(2);
		const removeCell = row.insertCell(3);

		elementTypeCell.innerHTML = elementType;
		generalMethodTemplateCell.innerHTML = generalMethodTemplate;
		getMethodTemplateCell.innerHTML = getMethodTemplate;
		removeCell.innerHTML = removeButtonHtml;
	}
}

function addElementTypeToTableValidation(elementType, generalMethodTemplate) {
	let retVal = true;

	if (elementType.value == null || elementType.value.length <= 0) {
		retVal = false;
	}
	if (generalMethodTemplate.value == null || generalMethodTemplate.value.length <= 0) {
		retVal = false;
	}

	return retVal;
}

function saveTemplate() {
	const templateName = document.getElementById("template-name").value;
	const checkArrayForExisting = settingsFileContent.filter(x => x.TemplateName == templateName)[0];

	let templateObject = {
		TemplateName: templateName,
		ElementDeclaration: document.getElementById("element-declaration-template").value,
		ElementType: [],
		PageObjectStructure: document.getElementById("pageobject-structure").value
	}

	const templateTableRows = document.getElementById(elementTableId).rows;

	for (i = 0; i < templateTableRows.length; i++) {
		const elementType = templateTableRows[i].children[0].textContent;
		const generalMethodTemplate = templateTableRows[i].children[1].textContent;
		const getMethodTemplate = templateTableRows[i].children[2].textContent;

		templateObject.ElementType.push([elementType, generalMethodTemplate, getMethodTemplate]);
	}

	if (templateName.length > 0 && checkArrayForExisting !== undefined) {
		for (i = 0; i < settingsFileContent.length; i++) {
			if (settingsFileContent[i].TemplateName == templateName) {
				settingsFileContent[i] = templateObject;
				let jsonData = JSON.stringify(settingsFileContent);
				fs.writeFileSync(path.resolve(__dirname, templateFile), jsonData);
				populateTemplateList();
				break;
			}
		}
	}
	else if (templateName.length > 0 && checkArrayForExisting === undefined) {
		settingsFileContent.push(templateObject);
		let jsonData = JSON.stringify(settingsFileContent);
		fs.writeFileSync(path.resolve(__dirname, templateFile), jsonData);
		populateTemplateList();
	}
}

function deleteTemplate() {
	const templateName = document.getElementById("template-list").selectedOptions[0].textContent;

	if (templateName.length <= 0) {
		return;
	}

	let index = 0;

	for (i = 0; i < settingsFileContent.length; i++) {
		if (settingsFileContent[i].TemplateName == templateName) {
			index = i;
		}
	}

	settingsFileContent.splice(index, 1);
	let jsonData = JSON.stringify(settingsFileContent);
	fs.writeFileSync(path.resolve(__dirname, templateFile), jsonData);
	populateTemplateList();
}
