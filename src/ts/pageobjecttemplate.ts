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
