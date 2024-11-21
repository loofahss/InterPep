import React from 'react'

import type { BrowserRouterProps } from 'react-router-dom'
import { Router } from 'react-router-dom'
import browserHistory from 'utils/history'

export default function CustomBrowserRouter({
	basename,
	children
}: BrowserRouterProps) {
	const historyRef = React.useRef(browserHistory)

	const history = historyRef.current
	const [state, setState] = React.useState({
		action: history.action,
		location: history.location
	})

	React.useLayoutEffect(() => history.listen(setState), [history])

	return (
		<Router
			basename={basename}
			location={state.location}
			navigationType={state.action}
			navigator={history}
		>
			{children}
		</Router>
	)
}
