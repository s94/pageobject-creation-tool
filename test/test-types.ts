export interface ElementType {
	elementTypeName: string;
	generalMethodTemplate: string;
	getMethodTemplate?: string;
}

export interface PageObjectTemplate {
	templateName: string;
	elementTemplate: string;
	pageObjectStructure: string;
	elementTypes: ElementType[];
}

export interface PageObject {
	templateName: string,
	pageObjectName: string,
	pageObjectElements: PageObjectElement[]
}

export interface PageObjectElement {
	elementType: string,
	elementName: string,
	elementId?: string,
	includeGet?: boolean,
}
