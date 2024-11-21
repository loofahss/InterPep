import { message } from 'antd'
import Axios from 'axios'
import { store } from 'store'
import { setUserInfo } from 'store/slicers/userSlice'
import history from './history'

interface AxiosConfig {
	timeout: number
	headers: {
		'Content-Type': string
	}
	baseURL: string
}

const config: AxiosConfig = {
	// eslint-disable-next-line @typescript-eslint/no-magic-numbers
	timeout: 6_000_000,
	headers: {
		'Content-Type': 'application/json'
	},
	baseURL: ''
}

const axios = Axios.create(config)

// token失效，清除用户信息并返回登录界面
const clearAll = (): void => {
	store.dispatch({
		type: 'SET_USERINFO',
		payload: {}
	})
	history.push('/login')
}

// 请求前拦截
axios.interceptors.request.use(
	request => {
		const { token = '' } = store.getState().user.UserInfo
		request.headers.Authorization = token
		return request
	},
	async error => {
		throw error
	}
)

// 返回后拦截
axios.interceptors.response.use(
	async (response: { data: any }): Promise<any> => {
		// todo 应考虑在全局统一化响应数据格式.如果没有,则应移除这个拦截器
		const { data } = response
		if (data.code === 0) return data.data
		else if (data.code === 403) {
			store.dispatch(
				setUserInfo({
					username: '',
					token: '',
					role: ''
				})
			)
			history.push('/login')
		}
		await message.error(data.msg)
		throw data
	},
	async error => {
		try {
			if (JSON.stringify(error).includes('403')) {
				clearAll()
			}
		} catch {
			clearAll()
		}
		message.destroy()
		await message.error('请求失败')
		throw error
	}
)

// post请求
axios.post = async (url: string, parameters?: any): Promise<any> =>
	axios({
		method: 'post',
		url,
		data: parameters
	})

// get请求
axios.get = async (url: string, parameters?: object): Promise<any> =>
	axios({
		method: 'get',
		url,
		params: parameters
	})

export default axios
