import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from 'App'
import 'assets/css/public.less'
import 'i18n'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider as ReduxProvider } from 'react-redux'
import { PersistGate } from 'redux-persist/lib/integration/react'
import { persistor, store } from 'store'
import { registerSW } from 'virtual:pwa-register'
import './index.css'

registerSW()

const MAX_RETRIES = 1
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: Number.POSITIVE_INFINITY,
			retry: MAX_RETRIES
		}
	}
})

const container = document.querySelector('#root')
if (container) {
	const root = createRoot(container)
	root.render(
		<StrictMode>
			<QueryClientProvider client={queryClient}>
				<ReduxProvider store={store}>
					<PersistGate loading={null} persistor={persistor}>
						<App />
					</PersistGate>
				</ReduxProvider>
			</QueryClientProvider>
		</StrictMode>
	)
}
