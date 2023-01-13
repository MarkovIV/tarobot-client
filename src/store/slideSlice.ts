import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './store'

interface ISlideState {
	item: string
}

const initialState: ISlideState = {
	item: "daycard"
}

export const slideSlice = createSlice({
	name: 'slide',
	initialState,
	reducers: {
		toggleSlideTo: (state, action: PayloadAction<string>) => {
			state.item = action.payload
		}
	}
})

export const { toggleSlideTo } = slideSlice.actions

export const slideState = (state: RootState) => state.slide.item

export default slideSlice.reducer