import { Query } from '@tanstack/react-query'
import { ConfigProvider, theme } from 'antd'
import en_US from 'antd/lib/locale/en_US'
import zh_CN from 'antd/lib/locale/zh_CN'
import LoadingOrError from 'components/LoadingOrError'
import BrowserRouter from 'components/common/BrowserRouter'
import 'dayjs/locale/zh-cn'
import i18n from 'i18next'
import moment from 'moment'
import Home from 'pages/home'
import Search from 'pages/query'
import type { ReactElement } from 'react'
import { Suspense, lazy, useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { useAppSelector } from 'store/redux-hooks'
import { selectLanguage, selectTheme } from 'store/slicers/appSlice'

const Container = lazy(async () => import('pages/container'))

export default function App(): ReactElement {
	const themeName = useAppSelector(selectTheme)
	const language = useAppSelector(selectLanguage)

	useEffect(() => {
		const html = document.querySelector('html')
		if (!html) return
		html.className =
			themeName === 'dark'
				? 'antialiased bg-black text-white'
				: 'antialiased bg-white text-black'
	}, [themeName])

	useEffect(() => {
		i18n.changeLanguage(language)
		moment.locale(language)
	}, [language])

	const config = {
		theme: {
			algorithm: theme.defaultAlgorithm
		},
		locale: en_US
	}
	if (themeName === 'dark') {
		config.theme.algorithm = theme.darkAlgorithm
	}
	if (language === 'zh') {
		config.locale = zh_CN
	}

	return (
		// eslint-disable-next-line react/jsx-props-no-spreading
		<ConfigProvider {...config}>
			<BrowserRouter basename={import.meta.env.VITE_APP_BASENAME}>
				<Suspense fallback={<LoadingOrError />}>
					<Routes>
						{/* <Route index key='container' element={<Container />}></Route> */}
						<Route path='/*' key='container' element={<Container />} />
						{/* <Route path='/' element={<Home />} /> */}
						{/* <Route path='/query' element={<Search />} /> */}
					</Routes>
				</Suspense>
			</BrowserRouter>
		</ConfigProvider>
	)
}
