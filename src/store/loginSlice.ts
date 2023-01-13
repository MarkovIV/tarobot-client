import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './store'

export interface ILoginState {
  logged: boolean
  email: string
}

const initialState: ILoginState = {
  logged: false,
  email: ''
}

export const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
	toggleLoginTo: (state, action: PayloadAction<ILoginState>) => {
      state.logged = action.payload.logged
	  state.email = action.payload.email
    }
  }
})

export const { toggleLoginTo } = loginSlice.actions

export const loginState = (state: RootState) => state.login

export default loginSlice.reducer