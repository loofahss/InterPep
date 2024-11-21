import { createSlice } from '@reduxjs/toolkit'
import type { UserInfo } from 'app_models/user'
import type { RootState } from 'store'

export interface UserState {
	UserInfo: UserInfo
}

const initialState: UserState = {
	UserInfo: {
		username: '',
		displayName: '',
		role: '',
		token: ''
	}
}

export const userSlice = createSlice({
	name: 'user',
	initialState,
	// The `reducers` field lets us define reducers and generate associated actions
	reducers: {
		setUserInfo: (state, action: { payload: UserInfo }) => {
			state.UserInfo = action.payload
		}
	}
})

export const { setUserInfo } = userSlice.actions

export const selectUserInfo = (state: RootState): UserInfo =>
	state.user.UserInfo

export default userSlice.reducer
