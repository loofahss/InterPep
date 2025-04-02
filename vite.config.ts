/// <reference types="vitest" />
import eslintPlugin from '@nabla/vite-plugin-eslint'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { viteMockServe } from 'vite-plugin-mock'
import { VitePWA } from 'vite-plugin-pwa'
import svgr from 'vite-plugin-svgr'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd())
	return {
		base: env.VITE_APP_BASENAME || '/',
		plugins: [
			tsconfigPaths(),
			react(),
			viteMockServe({
				mockPath: 'src/mocks'
			}),
			svgr({ svgrOptions: { icon: true } }),
			...(mode === 'test'
				? []
				: [
						eslintPlugin(),
						VitePWA({
							registerType: 'autoUpdate',
							includeAssets: [
								'favicon.png',
								'robots.txt',
								'apple-touch-icon.png',
								'icons/*.svg',
								'fonts/*.woff2'
							],
							manifest: {
								theme_color: '#BD34FE',
								icons: [
									{
										src: '/android-chrome-192x192.png',
										sizes: '192x192',
										type: 'image/png',
										purpose: 'any maskable'
									},
									{
										src: '/android-chrome-512x512.png',
										sizes: '512x512',
										type: 'image/png'
									}
								]
							}
						})
					])
		],
		css: {
			preprocessorOptions: {
				less: {
					math: 'always',
					relativeUrls: true,
					javascriptEnabled: true
				}
			}
		},
		build: {
			minify: 'terser',
			terserOptions: {
				compress: {
					drop_console: true,
					drop_debugger: true
				}
			}
		},
		server: {
			proxy: {
				// 代理配置
				'/query': {
					target: 'http://127.0.0.1:5000', // 后端服务实际地址
					changeOrigin: true // 必须设置为true
				}
			}
		}
	}
})
