import { FloatButton, Layout } from 'antd'
import { getKeyName, getRole } from 'assets/js/publicFunc'
import classNames from 'classnames'
import MenuView from 'components/common/menu'
import type { FunctionComponent } from 'react'
import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from 'store/redux-hooks'
import { selectUserInfo } from 'store/slicers/userSlice'
import styles from './container.module.less'

const loginAuth = new Set(['/record'])
const adminAuth = new Set(['/user'])
// 检查权限
const checkAuth = (newPathname: string): boolean => {
	if (loginAuth.has(newPathname)) {
		return !!getRole()
	}
	if (adminAuth.has(newPathname)) {
		return getRole() === 'admin'
	}
	return true
}

interface PanesItemProps {
	title: string
	content: FunctionComponent | null
	key: string
	closable: boolean
	path: string
}

function Home() {
	const userInfo = useAppSelector(selectUserInfo)
	const dispatch = useAppDispatch()
	const [panesItem, setPanesItem] = useState<PanesItemProps>({
		title: '',
		content: null,
		key: '',
		closable: false,
		path: ''
	})
	const pathRef: RefType = useRef<string>('')

	const navigate = useNavigate()
	const { pathname, search } = useLocation()

	const { token } = userInfo

	useEffect(() => {
		// 未登录
		if (!token && !checkAuth(pathname)) {
			navigate('/login', { replace: true })
			return
		}

		const { tabKey, title, component: Content } = getKeyName(pathname)

		// 检查权限，比如直接从地址栏输入的，提示无权限
		const isHasAuth = checkAuth(pathname)
		if (!isHasAuth) {
			const errorUrl = '/403'
			const {
				tabKey: errorKey,
				title: errorTitle,
				component: errorContent
			} = getKeyName(errorUrl)
			setPanesItem({
				title: errorTitle,
				content: errorContent,
				key: errorKey,
				closable: true,
				path: errorUrl
			})
			pathRef.current = errorUrl
			navigate(errorUrl, { replace: true })
			return
		}

		// 记录新的路径，用于下次更新比较
		const newPath = search ? pathname + search : pathname
		pathRef.current = newPath
		setPanesItem({
			title,
			content: Content,
			key: tabKey,
			closable: tabKey !== 'home',
			path: newPath
		})
	}, [history, pathname, search, token, dispatch])

	return (
		<Layout
			className={classNames(styles.container, '!min-h-screen')}
			onContextMenu={e => e.preventDefault()}
			style={{
				display: pathname.includes('/login') ? 'none' : 'flex'
			}}
		>
			<Layout.Header className={classNames('bg-blue-600')}>
				<div className='mx-auto flex max-w-screen-xl justify-between'>
					<MenuView />
				</div>
			</Layout.Header>
			<Layout.Content className='flex-1'>
				<div className='h-full px-[50px]'>
					<div className='mx-auto max-w-screen-xl'>
						{panesItem.content && <panesItem.content />}
					</div>
				</div>
			</Layout.Content>
			<FloatButton.BackTop visibilityHeight={1080} />
		</Layout>
	)
}

export default Home
