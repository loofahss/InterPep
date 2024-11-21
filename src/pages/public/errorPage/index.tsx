import { Result } from 'antd'
import { useTranslation } from 'react-i18next'

const ErrorPage = () => {
	const [t] = useTranslation()

	return (
		<Result
			style={{ height: '100vh' }}
			status='403'
			title='403'
			subTitle={t('page.403.desc')}
		/>
	)
}

export default ErrorPage
