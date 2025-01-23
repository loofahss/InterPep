import {
	BulbOutlined,
	HomeOutlined,
	QuestionCircleOutlined,
	SearchOutlined
} from '@ant-design/icons'
import { hasIntersection } from 'assets/js/publicFunc'
import Help from 'pages/help'
import Home from 'pages/home'
import PeptideList from 'pages/list'
import ErrorPage from 'pages/public/errorPage'
import Query from 'pages/query'
import Result from 'pages/result'
import type { MenuRoute } from 'routes/types'
// import React from 'react'
// import { Icon } from '@iconify/react'

/**
 * path 跳转的路径
 * component 对应路径显示的组件
 * exact 匹配规则，true的时候则精确匹配。
 */
const preDefinedRoutes: MenuRoute[] = [
	{
		path: '/',
		key: 'home',
		locale: 'server',
		component: Home,
		icon: HomeOutlined
	},
	{
		path: '/search',
		key: 'search',
		locale: 'search',
		icon: SearchOutlined,
		component: Query
	},
	{
		path: '/result?id=T10000001',
		key: 'example',
		locale: 'example',
		hideInMenu: true,
		component: Result,
		icon: BulbOutlined
	},
	{
		path: '/help',
		key: 'help',
		locale: 'help',
		component: Help,
		icon: QuestionCircleOutlined
	},
	{
		path: '/403',
		label: '暂无权限',
		key: '/403',
		hideInMenu: true,
		component: ErrorPage
	}
]

export default preDefinedRoutes

export function filterRoutes(
	routes: MenuRoute[],
	permission: string[] | string
) {
	return routes.filter(route => {
		if (route.routes) {
			route.routes = filterRoutes(route.routes, permission)
		}
		if (route.authority) {
			if (typeof route.authority === 'string') {
				if (typeof permission === 'string')
					return permission === route.authority
				else return permission.includes(route.authority)
			} else if (Array.isArray(route.authority)) {
				if (typeof permission === 'string')
					return route.authority.includes(permission)
				else return hasIntersection(permission, route.authority)
			}
		}
		return true
	})
}
