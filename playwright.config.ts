import { PlaywrightTestConfig } from '@playwright/test'

const config: PlaywrightTestConfig = {
	testDir: './test',
	timeout: 5000,
	workers: 5
}

export default config
