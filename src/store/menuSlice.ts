import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './store'

interface IMenuState {
  open: boolean
}

const initialState: IMenuState = {
  open: false
}

export const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
	toggleMenuTo: (state, action: PayloadAction<boolean>) => {
      state.open = action.payload
    }
  }
})

export const { toggleMenuTo } = menuSlice.actions

export const menuState = (state: RootState) => state.menu.open

export default menuSlice.reducer