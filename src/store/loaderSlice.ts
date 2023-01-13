import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './store'

export interface ILoaderState {
  loader: boolean
}

const initialState: ILoaderState = {
  loader: false
}

export const loaderSlice = createSlice({
  name: 'loader',
  initialState,
  reducers: {
	toggleLoaderTo: (state, action: PayloadAction<ILoaderState>) => {
      state.loader = action.payload.loader
    }
  }
})

export const { toggleLoaderTo } = loaderSlice.actions

export const loaderState = (state: RootState) => state.loader

export default loaderSlice.reducer