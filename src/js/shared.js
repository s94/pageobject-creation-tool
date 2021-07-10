const fs = require('fs');
const path = require('path');
const templateFile = "template.json";
const removeButtonHtml = "<button class='table__button--remove' onclick='deleteRowFromTable(this);'>Remove</button>";
let errorMessageTimeout = null;

const rawData = fs.readFileSync(path.resolve(__dirname, templateFile));
let settingsFileContent = JSON.parse(rawData);

function populateTemplateList() {
	const templateList = document.getElementById("template-list");

	while (templateList.hasChildNodes()) {
		templateList.removeChild(templateList.lastChild);
	}

	let option = document.createElement("option");
	option.value = 0;
	templateList.appendChild(option);

	for (i = 0; i < settingsFileContent.length; i++) {
		let option = document.createElement("option");
		option.value = i + 1;
		option.innerHTML = settingsFileContent[i].TemplateName;
		templateList.appendChild(option);
	}
}

function deleteRowFromTable(element) {
	let index = element.parentNode.parentNode.rowIndex - 1;
	document.getElementById(elementTableId).deleteRow(index);
}

function showError(errorMessage) {
	const error = document.getElementsByClassName("error")[0];
	const header = document.getElementsByClassName("header")[0];

	if (error.textContent == errorMessage) {
		return;
	}
	else if (errorMessageTimeout !== null) {
		clearTimeout(errorMessageTimeout);
		errorMessageTimeout = null;
	}

	error.textContent = errorMessage;
	header.classList.add("header--error");
	error.classList.remove("error--hidden");

	errorMessageTimeout = setTimeout(() => {
		error.textContent = "";
		header.classList.remove("header--error");
		error.classList.add("error--hidden");
	}, 3000);
}
