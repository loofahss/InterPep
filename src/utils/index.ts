import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import { useLayoutEffect, useState } from 'react'

export function useMediaQuery(query: string): boolean {
	const [matches, setMatches] = useState(() => matchMedia(query).matches)

	useLayoutEffect(() => {
		const mediaQuery = matchMedia(query)

		function onMediaQueryChange(): void {
			setMatches(mediaQuery.matches)
		}

		mediaQuery.addEventListener('change', onMediaQueryChange)

		return (): void => {
			mediaQuery.removeEventListener('change', onMediaQueryChange)
		}
	}, [query])

	return matches
}

export const getBrowserLang = (): 'en' | 'zh' => {
	const browserLang = navigator.language
	let defaultBrowserLang: 'en' | 'zh' = 'en'
	defaultBrowserLang =
		browserLang.toLowerCase() === 'cn' ||
		browserLang.toLowerCase() === 'zh' ||
		browserLang.toLowerCase() === 'zh-cn'
			? 'zh'
			: 'en'
	return defaultBrowserLang
}

export function hexToRGBA(hex: string, alpha: number) {
	const r = parseInt(hex.slice(1, 3), 16),
		g = parseInt(hex.slice(3, 5), 16),
		b = parseInt(hex.slice(5, 7), 16)

	if (alpha) {
		return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')'
	} else {
		return 'rgb(' + r + ', ' + g + ', ' + b + ')'
	}
}

export const isSame = (origin: string, compared: string | undefined) => {
	if (!compared) return true
	return origin.indexOf(compared) !== -1
}

export const isInRange = (range: Dayjs[], time: number) => {
	if (!range || !range.length) return true
	dayjs.extend(isBetween)
	return dayjs(time).isBetween(range[0], range[1])
}
