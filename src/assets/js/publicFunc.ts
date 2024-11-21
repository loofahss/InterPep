/* eslint-disable no-param-reassign */
import { Modal } from 'antd'
import ErrorPage from 'pages/public/errorPage'
import { FunctionComponent } from 'react'
import routes from 'routes'
import { store } from 'store'

// 通用confirm方法
export const commonConfirm = (title: string, cb: () => void) => {
	const { confirm } = Modal
	confirm({
		okText: '确定',
		cancelText: '取消',
		title,
		onOk() {
			cb()
		},
		onCancel() {}
	})
}

/**
 * 隐藏手机号码
 * @param {string} phone 手机号
 */
export const hidePhone = (phone: string) =>
	phone && phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')

/**
 * 以递归的方式展平react router数组
 * @param {object[]} arr 路由数组
 * @param {string} child 需要递归的字段名
 */
export const flattenRoutes = (
	arr: CommonObjectType<unknown>[]
): CommonObjectType<unknown>[] =>
	arr.reduce(
		(prev: CommonObjectType<unknown>[], item: CommonObjectType<unknown>) => {
			if (Array.isArray(item.routes)) {
				prev.push(item)
			}
			return prev.concat(
				Array.isArray(item.routes) ? flattenRoutes(item.routes) : [item]
			)
		},
		[]
	)

/**
 * 根据路径获取路由的name和key
 * @param {string} path 路由
 */
export const getKeyName = (
	path = '/403'
): { title: string; tabKey: string; component: FunctionComponent } => {
	const truePath = path.split('?')[0]
	const curRoute = flattenRoutes(routes).find((item: any) => {
		if (item.path.indexOf('?') > -1) return item.path.includes(path)
		return item.path.includes(truePath)
	})
	if (!curRoute)
		return { title: '暂无权限', tabKey: '403', component: ErrorPage }
	const { name, key, component } = curRoute
	return {
		title: name as string,
		tabKey: key as string,
		component: component as FunctionComponent
	}
}

/**
 * 同步执行操作，Currying
 * @param {*} action 要执行的操作
 * @param {function} cb 下一步操作回调
 */
export const asyncAction = (action: unknown | void) => {
	const wait = new Promise(resolve => {
		resolve(action)
	})
	return (cb: () => void) => {
		wait.then(() => setTimeout(() => cb()))
	}
}

/**
 * 获取地址栏 ?参数，返回键值对对象
 */
export const getQuery = (): CommonObjectType<string> => {
	const { href } = window.location
	const query = href.split('?')
	if (!query[1]) return {}

	const queryArr = decodeURI(query[1]).split('&')
	const queryObj = queryArr.reduce((prev, next) => {
		const item = next.split('=')
		return { ...prev, [item[0]]: item[1] }
	}, {})
	return queryObj
}

/**
 * 深拷贝操作，简单类型的对象的可以直接用 JSON.parse(JSON.stringify())或 [...]/{...}
 * @param {object} obj 需要拷贝的对象
 */
export const deepClone = (obj: CommonObjectType) => {
	if (
		obj === null ||
		typeof obj !== 'object' ||
		obj instanceof Date ||
		obj instanceof Function
	) {
		return obj
	}
	const cloneObj: any = Array.isArray(obj) ? [] : {}
	Object.keys(obj).map(key => {
		cloneObj[key] = deepClone(obj[key])
		return cloneObj
	})
	return cloneObj
}

/**
 * 获取本地存储中的权限
 */
export const getRole = () => store.getState().user.UserInfo.role || ''

/**
 * 用requestAnimationFrame替代setTimeout、setInterval，解决内存溢出
 * @export
 * @param {*} cb 定时回调
 * @param {*} interval 定时时间
 */
export const customizeTimer = {
	intervalTimer: -1,
	timeoutTimer: -1,
	setTimeout(cb: () => void, interval: number) {
		// 实现setTimeout功能
		const { now } = Date
		const stime = now()
		let etime = stime
		const loop = () => {
			this.timeoutTimer = requestAnimationFrame(loop)
			etime = now()
			if (etime - stime >= interval) {
				cb()
				cancelAnimationFrame(this.timeoutTimer)
			}
		}
		this.timeoutTimer = -1
		this.timeoutTimer = requestAnimationFrame(loop)
		return this.timeoutTimer
	},
	clearTimeout() {
		cancelAnimationFrame(this.timeoutTimer)
	},
	setInterval(cb: () => void, interval: number) {
		// 实现setInterval功能
		const { now } = Date
		let stime = now()
		let etime = stime
		const loop = () => {
			this.intervalTimer = requestAnimationFrame(loop)
			etime = now()
			if (etime - stime >= interval) {
				stime = now()
				etime = stime
				cb()
			}
		}
		this.intervalTimer = requestAnimationFrame(loop)
		return this.intervalTimer
	},
	clearInterval() {
		cancelAnimationFrame(this.intervalTimer)
	}
}

/**
 * 预览图片
 */
export const previewImg = (children: React.ReactNode | string) => {
	Modal.info({
		title: '预览',
		icon: false,
		okText: '关闭',
		maskClosable: true,
		content: children
	})
}

/**
 * 限制两位小数，可 ±
 * @param {string} val 要格式化的数字
 */
export const limitDecimal = (val: string) =>
	val.replace(/^(-)*(\d+)\.(\d\d).*$/, '$1$2.$3')

export function hasIntersection(arr1: any[], arr2: any[]): boolean {
	return arr1.some(item => arr2.includes(item))
}
