const elementTableId = "element-table";

function loadElementTypeList() {
	const elementType = document.getElementById("element-type");
	const templateName = document.getElementById("template-list").selectedOptions[0].textContent;

	let option = document.createElement("option");

	if (templateName.length > 0) {
		const settingFromArray = settingsFileContent.filter(x => x.TemplateName == templateName)[0];

		while (elementType.hasChildNodes()) {
			elementType.removeChild(elementType.lastChild);
		}
	
		let elementTypeList = [];
		for (i = 0; i < settingFromArray.ElementType.length; i++) {
			elementTypeList.push(settingFromArray.ElementType[i]);
		}

		option.value = "";
		option.selected = true;
		option.disabled = true;
		option.hidden = true;
		option.innerHTML = "Please select...";
		elementType.appendChild(option);

		option = document.createElement("option");
		option.value = 0;
		elementType.appendChild(option);
	
		for (i = 0; i < elementTypeList.length; i++) {
			let option = document.createElement("option");
			option.value = i + 1;
			option.innerHTML = elementTypeList[i][0];
			elementType.appendChild(option);
		}
	}
	else {
		while (elementType.hasChildNodes()) {
			elementType.removeChild(elementType.lastChild);
		}
		option.value = 0;
		elementType.appendChild(option);
	}
}

function addElementToTable() {
	const elementTable = document.getElementById(elementTableId);
	const elementName = document.getElementById("element-name");
	const elementType = document.getElementById("element-type");
	const elementId = document.getElementById("element-id");
	const includeGet = document.getElementById("include-get");

	let isValid = addElementToTableValidation(elementName, elementType);

	if (elementTable && isValid) {
		const row = elementTable.insertRow(-1);
		const elementNameCell = row.insertCell(0);
		const elementTypeCell = row.insertCell(1);
		const elementIdCell = row.insertCell(2);
		const getCell = row.insertCell(3);
		const removeCell = row.insertCell(4);

		elementNameCell.innerHTML = elementName.value;
		elementTypeCell.innerHTML = elementType.selectedOptions[0].textContent;
		elementIdCell.innerHTML = elementId.value;
		getCell.innerHTML = includeGet.checked;
		removeCell.innerHTML = removeButtonHtml;

		elementName.value = null;
		elementType.selectedIndex = 0;
		elementId.value = null;
		includeGet.checked = false;
	}
	else {
		showError("Element cannot be added to the table, submission is not valid.");
	}
}

function addElementToTableValidation(elementName, elementType) {
	let retVal = true;

	if (elementName.value == null || elementName.value.trim().length <= 0) {
		retVal = false;
	}
	if (elementType.selectedOptions[0].textContent.length <= 0 || elementType.selectedOptions[0].hidden == true) {
		retVal = false;
	}

	return retVal;
}

function generatePageObject() {
	const templateName = document.getElementById("template-list").selectedOptions[0].textContent.trim();
	const pageObjectName = document.getElementById("pageobject-name").value.trim();

	if (templateName.length <= 0) {
		showError("Unable to generate PageObject, a template is required.");
		return;
	}
	else if (pageObjectName.length <= 0) {
		showError("Unable to generate PageObject, a PageObject name is required.");
		return;
	}

	let elementTableContent = [];
	const elementTableRows = document.getElementById(elementTableId).rows;

	if (elementTableRows.length <= 0) {
		showError("Unable to generate PageObject, element table cannot be empty.");
		return;
	}

	for (i = 0; i < elementTableRows.length; i++) {
		const elementName = elementTableRows[i].children[0].textContent;
		const elementType = elementTableRows[i].children[1].textContent;
		const elementId = elementTableRows[i].children[2].textContent;
		const includeGet = elementTableRows[i].children[3].textContent;

		elementTableContent.push([elementName, elementType, elementId, includeGet]);
	}

	const settingFromArray = settingsFileContent.filter(x => x.TemplateName == templateName)[0];
	const pageObjectStructure = settingFromArray.PageObjectStructure;
	const elementDeclaration = settingFromArray.ElementDeclaration;

	let elementsString = "";
	let generalMethodsString = "";
	let getMethodsString = "";

	for (i = 0; i < elementTableContent.length; i++) {
		elementsString += elementDeclaration.replace("${ElementName}", elementTableContent[i][0]).replace("${ElementType}", elementTableContent[i][1]).replace("${ElementId}", elementTableContent[i][2]);

		let generalMethodTemplate = settingFromArray.ElementType.filter(x => x[0] == elementTableContent[i][1])[0][1];
		generalMethodsString += generalMethodTemplate.replaceAll("${ElementName}", elementTableContent[i][0]);

		let getMethodTemplate = settingFromArray.ElementType.filter(x => x[0] == elementTableContent[i][1])[0][2];

		if (elementTableContent[i][3] == "true") {
			getMethodsString += getMethodTemplate.replaceAll("${ElementName}", elementTableContent[i][0]);
		}
	}

	let output = pageObjectStructure.replaceAll("${PageObjectName}", pageObjectName).replace("${Elements}", elementsString).replace("${GeneralMethods}", generalMethodsString).replace("${GetMethods}", getMethodsString);
	document.getElementById("output").value = output;

	document.getElementById("output-modal").classList.remove("modal--hidden");
}

function closeModal() {
	document.getElementById("output-modal").classList.add("modal--hidden");
}

function copyToClipboard() {
	let textToCopy = document.getElementById("output").value;

	navigator.clipboard.writeText(textToCopy).then(function() {
		return true;
	}, function() {
		return false;
	});
}
