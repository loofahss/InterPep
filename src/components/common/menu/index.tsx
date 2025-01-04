import { Menu } from 'antd'
import { useCallback, useLayoutEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import type { MenuProps } from 'antd'
import logo from 'assets/img/logo.png'
import { flattenRoutes, getKeyName } from 'assets/js/publicFunc'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import menus, { filterRoutes } from 'routes'
import { MenuRoute } from 'routes/types'
import { useAppSelector } from 'store/redux-hooks'
import { selectUserInfo } from 'store/slicers/userSlice'

const flatMenu = flattenRoutes(menus)

type MenuType = CommonObjectType<string>

const formatMenu = (
	menus: MenuRoute[],
	t: (k: string) => string
): MenuProps['items'] => {
	return menus
		.filter(item => !item.hideInMenu)
		.map(item => {
			const obj: any = {
				key: item.key,
				path: item.path,
				label: t(item.locale as string)
			}
			if (item.icon) {
				obj.icon = <item.icon />
			}
			if (item.routes) {
				obj.children = formatMenu(item.routes, t)
			}
			return obj
		})
}

export default function MenuView() {
	const navigate = useNavigate()
	const userInfo = useAppSelector(selectUserInfo)
	const { pathname, search } = useLocation()
	const { tabKey: curKey = 'home' } = getKeyName(pathname)
	const [current, setCurrent] = useState(curKey)
	const [t] = useTranslation()
	const formatMenus = useMemo(() => {
		const filteredMenus = filterRoutes(menus, userInfo.role)
		return formatMenu(filteredMenus, t)
	}, [menus, t, userInfo])

	// 递归逐级向上获取最近一级的菜单，并高亮
	const higherMenuKey = useCallback(
		(checkKey = 'home', path = pathname) => {
			if (
				checkKey === '403' ||
				(flatMenu as MenuType[]).some((item: MenuType) => item.key === checkKey)
			) {
				return checkKey
			}
			const higherPath =
				path.match(/(.*)\//g)?.[0]?.replace(/(.*)\//, '$1') || ''
			const { tabKey } = getKeyName(higherPath)
			return higherMenuKey(tabKey, higherPath)
		},
		[pathname]
	)

	useLayoutEffect(() => {
		const { tabKey } = getKeyName(pathname + search)
		const higherKey = higherMenuKey(tabKey)
		setCurrent(higherKey)
	}, [higherMenuKey, pathname, search])

	// 菜单点击事件
	const handleClick = ({ key, item }: { key: string; item: any }): void => {
		setCurrent(key)
		navigate(item.props.path, { replace: true })
	}

	function LogLink() {
		return (
			<Link to={{ pathname: '/' }}>
				<div className='logo flex items-center'>
					<img alt='logo' src={logo} width='32' />
					<h1 className={classNames('text-gray-50')}>ISYLab</h1>
				</div>
			</Link>
		)
	}
	return (
		<div className={classNames('header flex flex-1')}>
			<LogLink />
			<Menu
				theme={'dark'}
				mode='horizontal'
				onClick={handleClick}
				selectedKeys={[current]}
				items={formatMenus}
				className={classNames('flex-1 bg-blue-600')}
			></Menu>
		</div>
	)
}
