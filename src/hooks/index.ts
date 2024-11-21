import { useCallback, useEffect, useRef, useState } from 'react'

export const useDebounce = (
	callback: (...args: any[]) => void,
	delay: number
) => {
	const latestCallback = useRef(callback)
	const latestTimeout = useRef<NodeJS.Timeout>()

	useEffect(() => {
		latestCallback.current = callback
	})

	return useCallback(
		(...args: any) => {
			if (latestTimeout.current) {
				clearTimeout(latestTimeout.current)
			}
			latestTimeout.current = setTimeout(() => {
				latestCallback.current(...args)
			}, delay)
		},
		[delay]
	)
}

export function useThrottle(callback: (...args: any[]) => void, delay: number) {
	const [ready, setReady] = useState(true)
	const timerRef = useRef<NodeJS.Timeout>()

	const throttledFunction = (...args: any[]) => {
		if (!ready) {
			return
		}

		setReady(false)
		callback(...args)

		timerRef.current = setTimeout(() => {
			setReady(true)
		}, delay)
	}

	useEffect(() => {
		return () => {
			if (timerRef.current) {
				clearTimeout(timerRef.current)
			}
		}
	}, [delay])

	return throttledFunction
}
