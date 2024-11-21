import { LoadingOutlined } from '@ant-design/icons'
import { Icon } from '@iconify/react'
import { Button, Dropdown, Form, Input, MenuProps, Modal, Tooltip } from 'antd'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from 'store/redux-hooks'
import {
	selectLanguage,
	selectTheme,
	selectThemeType,
	setLanguage,
	setThemeType
} from 'store/slicers/appSlice'
import { selectUserInfo, setUserInfo } from 'store/slicers/userSlice'

import session from 'api/sys/session'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import style from './Header.module.less'

type FieldType = {
	oldPassword?: string
	newPassword?: string
}

export default function Header() {
	const dispatch = useAppDispatch()
	const theme = useAppSelector(selectTheme)
	const themeType = useAppSelector(selectThemeType)
	const language = useAppSelector(selectLanguage)
	const userInfo = useAppSelector(selectUserInfo)
	const navigate = useNavigate()
	const { username } = userInfo
	const firstWord = username.length === 0 ? 'G ' : username.slice(0, 1)
	const [t] = useTranslation()
	const [loading, setLoading] = useState(false)
	const onLogout = async (noRequest = false) => {
		setLoading(true)
		if (username) {
			if (!noRequest) await session.logout()
			dispatch(
				setUserInfo({
					username: '',
					token: '',
					role: ''
				})
			)
		}
		navigate('/login', { replace: true })
	}

	const changeTheme = (themes: string) => {
		dispatch(setThemeType(themes))
	}
	const changeThemeType = () => {
		dispatch(setThemeType(themeType === 'auto' ? theme : 'auto'))
	}
	const changeLanguage = () => {
		dispatch(setLanguage(language === 'zh' ? 'en' : 'zh'))
	}

	const items: MenuProps['items'] = [
		{
			key: 'logout',
			label: (
				<div onClick={() => onLogout()}>
					<span className='ant-btn-link'>
						{username.length > 0 ? t('header.logout') : t('header.login')}
					</span>
					{loading ? <LoadingOutlined /> : null}
				</div>
			)
		}
	]
	if (username) {
		items.unshift({
			key: 'profile',
			label: (
				<div onClick={() => setOpen(true)}>
					<span className='ant-btn-link'>{t('header.changePwd')}</span>
				</div>
			)
		})
	}
	const [open, setOpen] = useState(false)
	const [confirmLoading, setConfirmLoading] = useState(false)
	const [form] = Form.useForm<FieldType>()
	const onSubmit = async () => {
		try {
			const values = await form.validateFields()
			setConfirmLoading(true)
			await session.changePwd(values)
			onLogout(true)
			setConfirmLoading(false)
		} catch (error) {
			setConfirmLoading(false)
		} finally {
			setConfirmLoading(false)
		}
	}

	return (
		<>
			<div className={classNames(style.header, style.horizontal)}>
				{/* 右上角 */}
				<Dropdown className={`fr ${style.content}`} menu={{ items }}>
					<span className={style.user}>
						<span className='avart'>{firstWord}</span>
						<span>{username.length === 0 ? 'Guest' : username}</span>
					</span>
				</Dropdown>
				<div className='fr h-[64px]'>
					<Tooltip placement='bottom' title={t('header.lang')}>
						<Button
							type='text'
							onClick={changeLanguage}
							className='ml-[10px] mt-[15px] h-[32px] w-[32px] p-0'
						>
							<div
								style={{
									width: '16px',
									height: '16px',
									position: 'relative',
									margin: 'auto',
									fontSize: '16px'
								}}
							>
								<span
									className={classNames('absolute left-[-5%] top-0 z-[1] ', {
										'bg-white text-black': theme === 'dark',
										'bg-black text-white': theme === 'light'
									})}
									style={{
										transformOrigin: '0 0',
										transform: 'scale(0.7)',
										lineHeight: '1'
									}}
								>
									{language === 'zh' ? '中' : 'En'}
								</span>
								<span
									className={classNames(
										'absolute bottom-0 right-[-5%] z-0 border-black',
										{
											'border-white': theme === 'dark'
										}
									)}
									style={{
										transformOrigin: '100% 100%',
										transform: 'scale(0.5)',
										border: '1px solid',
										lineHeight: '1'
									}}
								>
									{language === 'zh' ? 'En' : '中'}
								</span>
							</div>
						</Button>
					</Tooltip>
				</div>

				<div className='fr'>
					<Tooltip placement='bottom' title={t('header.auto')}>
						<Button
							shape='circle'
							size='small'
							className='ml-[5px] mt-[15px] p-0'
							type={themeType === 'auto' ? 'primary' : 'default'}
							onClick={changeThemeType}
						>
							A
						</Button>
					</Tooltip>
				</div>

				<div className={`fr ${style.themeSwitchWrapper}`}>
					<Tooltip placement='bottom' title={t('header.theme')}>
						<div
							className={`${style.themeSwitch} ${
								theme === 'light' ? '' : style.themeSwitchDark
							}`}
							onClick={() => changeTheme(theme === 'light' ? 'dark' : 'light')}
						>
							<div className={style.themeSwitchInner} />
							<Icon icon='emojione:sun' />
							<Icon icon='majesticons:moon' color='#ffe62e' />
						</div>
					</Tooltip>
				</div>
			</div>
			<Modal
				title={t('header.changePwd')}
				open={open}
				confirmLoading={confirmLoading}
				onCancel={() => {
					setOpen(false)
					form.resetFields()
				}}
				onOk={() => {
					onSubmit()
				}}
			>
				<Form form={form} layout='vertical'>
					<Form.Item<FieldType>
						label={t('header.form.oldPwd')}
						name='oldPassword'
						validateTrigger='onBlur'
						rules={[
							{
								required: true,
								message: t('page.login.input', {
									name: t('header.form.oldPwd')
								})
							}
						]}
					>
						<Input.Password
							placeholder={t('page.login.input', {
								name: t('header.form.oldPwd')
							})}
						/>
					</Form.Item>
					<Form.Item<FieldType>
						label={t('header.form.newPwd')}
						name='newPassword'
						validateTrigger='onBlur'
						rules={[
							{
								required: true,
								message: t('page.login.input', {
									name: t('header.form.newPwd')
								})
							},
							() => ({
								validator(_, value) {
									if (
										!value ||
										/^(?![0-9]+$)(?![^0-9]+$)(?![a-zA-Z]+$)(?![^a-zA-Z]+$)(?![a-zA-Z0-9]+$)[a-zA-Z0-9\S]{8,32}$/.test(
											value
										)
									) {
										return Promise.resolve()
									}
									return Promise.reject(t('page.login.pwdTip'))
								}
							})
						]}
					>
						<Input.Password
							placeholder={t('page.login.input', {
								name: t('header.form.newPwd')
							})}
						/>
					</Form.Item>
				</Form>
			</Modal>
		</>
	)
}
