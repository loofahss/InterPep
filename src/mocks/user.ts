import type { UserInfo } from 'app_models/user'

const userRes: UserInfo[] = [
	{
		username: 'admin',
		password: '123456',
		token: 'asdfghjkl',
		role: 'admin'
	}
]

const handlers = [
	{
		url: '/login',
		method: 'post',
		response: {
			code: 0,
			data: userRes[0]
		}
	},
	{
		url: '/logout',
		method: 'get',
		response: {
			code: 0,
			data: null,
			msg: 'success'
		}
	}
]

export default handlers
