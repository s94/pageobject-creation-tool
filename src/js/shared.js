const fs = require('fs');
const path = require('path');
const templateFile = "template.json";
const removeButtonHtml = "<button class='remove-button' onclick='deleteRowFromTable(this);'>Remove</button>";

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
