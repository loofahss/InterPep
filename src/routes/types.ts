import { FunctionComponent } from 'react'

export interface NestedRoute {
	path: string
	routes?: NestedRoute[]
}

type MenuType = 'menu' | 'subMenu'

export interface MenuRoute extends NestedRoute {
	// path: string
	label?: string
	routes?: MenuRoute[] | undefined
	authority?: string[] | string
	hideChildrenInMenu?: boolean
	hideInMenu?: boolean
	icon?: string | FunctionComponent
	locale?: string
	type?: MenuType

	[key: string]: any
}
