import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
// 检测当前浏览器的语言或者从服务器获取配置资源
import Backend from 'i18next-http-backend'
// 嗅探当前浏览器语言
import LanguageDetector from 'i18next-browser-languagedetector'
import enUSLocale from './modules/en.json'

import enUS from 'antd/lib/locale/en_US'
import zhCN from 'antd/lib/locale/zh_CN'

i18n
	.use(Backend)
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		resources: {
			zh: {
				translation: {
					...zhCN
				}
			},
			en: {
				translation: {
					...enUSLocale,
					...enUS
				}
			}
		},
		interpolation: {
			escapeValue: false
		}
	})

export default i18n
