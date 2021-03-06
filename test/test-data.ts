export class TestData {
	public static Blank: string = '';
	public static Whitespace: string = ' ';
	public static Populated: string = 'Populated';

	public static ExampleTemplate = {
		Name: 'Example Template',
		ElementType_Button: 'Button',
		ElementType_Textbox: 'Textbox'
	}

	public static uniqueTestTemplateName(): string {
		return `Test Template ${ Math.floor(Math.random() * 10000) }`;
	}
}
