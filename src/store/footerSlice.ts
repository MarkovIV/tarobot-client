import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './store'

export interface IFooterState {
  footer: boolean
}

const initialState: IFooterState = {
  footer: true
}

export const footerSlice = createSlice({
  name: 'footer',
  initialState,
  reducers: {
	toggleFooterTo: (state, action: PayloadAction<IFooterState>) => {
      state.footer = action.payload.footer
    }
  }
})

export const { toggleFooterTo } = footerSlice.actions

export const footerState = (state: RootState) => state.footer

export default footerSlice.reducer