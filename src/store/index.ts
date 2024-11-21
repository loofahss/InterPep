import type { Action, ThunkAction } from '@reduxjs/toolkit'
import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import {
	FLUSH,
	PAUSE,
	PERSIST,
	PURGE,
	REGISTER,
	REHYDRATE,
	persistReducer,
	persistStore
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import promiseMiddleware from 'redux-promise'
import appReducer from 'store/slicers/appSlice'
import tabReducer from 'store/slicers/tabSlice'
import userReducer from 'store/slicers/userSlice'

const reducers = combineReducers({
	tab: tabReducer,
	user: userReducer,
	app: appReducer
})

const persistConfig = {
	key: 'root',
	storage
	// 以下是性能优化
	// whitelist = ['navigation']
	// blacklist = ['navigation']
}

const persistedReducer = persistReducer(persistConfig, reducers)

export const store = configureStore({
	reducer: persistedReducer,
	devTools: process.env.NODE_ENV !== 'production',
	middleware: getDefaultMiddleware => [
		...getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
			}
		}),
		promiseMiddleware
	]
})

export const persistor = persistStore(store)

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
	ReturnType,
	RootState,
	unknown,
	Action
>
