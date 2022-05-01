# pageobject-creation-tool

pageobject-creation-tool is an application for code generation of Page Object Models to be used for end-to-end testing.

Written in TypeScript and built with Electron.

![pageobject-creation-tool screenshot](https://user-images.githubusercontent.com/11080821/166154345-a54519b0-6646-4e16-9f23-3598d1f38ae2.png)

## Build the application

1. Clone the repo:

```bash
git clone https://github.com/s94/pageobject-creation-tool.git
```

2. Change directory to the project:

```bash
cd pageobject-creation-tool
```

3. Install the project dependencies using npm:

* The application tests use https://playwright.dev
* Firstly install Playwright using the skip browser download environment variable, this is because we do not need to install web browsers to test this Electron application

```bash
PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npm i -D playwright
npm ci
```

4. Build the project:

```bash
npm run package
```

The application can now be found within the following directory:

```bash
cd pageobject-creation-tool/out/pageobject-creation-tool-{os specific here}
# directory name differs for macos, windows and linux.
```

## Run the application tests

First clone the repo and build the application

```bash
npm test
```
