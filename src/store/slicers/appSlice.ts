import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from 'store'

type ThemeType = 'auto' | 'dark' | 'light'
type LanguageType = 'en' | 'zh'
export interface AppState {
	theme: 'dark' | 'light'
	themeType: ThemeType
	language: LanguageType
	collapsed: boolean // 菜单收纳状态, 用于垂直布局
	menuMode: 'horizontal' | 'vertical' // 菜单模式, 用于水平布局
}

const initialState: AppState = {
	collapsed: false,
	theme: 'light',
	themeType: 'light',
	menuMode: 'horizontal',
	language: 'en'
}

export const appSlice = createSlice({
	name: 'app',
	initialState,
	// The `reducers` field lets us define reducers and generate associated actions
	reducers: {
		setThemeType(state: AppState, action) {
			state.themeType = action.payload
		},
		setTheme(state: AppState, action) {
			state.theme = action.payload
		},
		setCollapsed(state: AppState, action) {
			state.collapsed = action.payload
		},
		setMenuMode(state: AppState, action) {
			state.menuMode = action.payload
		},
		setLanguage(state: AppState, action) {
			state.language = action.payload
		}
	}
})

export const {
	setCollapsed,
	setTheme,
	setMenuMode,
	setThemeType,
	setLanguage
} = appSlice.actions

export const selectTheme = (state: RootState) => state.app.theme
export const selectThemeType = (state: RootState) => state.app.themeType
export const selectCollapsed = (state: RootState) => state.app.collapsed
export const selectMenuMode = (state: RootState) => state.app.menuMode
export const selectLanguage = (state: RootState) => state.app.language

export default appSlice.reducer
