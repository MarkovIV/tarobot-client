import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './store'
import { IClient } from '../interfaces/client.interface'

export interface IClientsState {
  clients: IClient[]
}

const initialState: IClientsState = {
  clients: []
}

export const clientsSlice = createSlice({
	name: 'clients',
	initialState,
	reducers: {
		toggleClientsTo: (state, action: PayloadAction<IClientsState>) => {
			state.clients = action.payload.clients
		}
	}
})

export const { toggleClientsTo } = clientsSlice.actions

export const clientsState = (state: RootState) => state.clients.clients

export default clientsSlice.reducer