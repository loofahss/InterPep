import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		globals: true, // 允许使用 `describe`, `test`, `expect`
		environment: 'node', // 或 'jsdom' (适用于前端测试)
		coverage: {
			// 开启代码覆盖率
			provider: 'v8',
			reporter: ['text', 'json', 'html']
		}
	}
})
