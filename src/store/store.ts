import { configureStore } from '@reduxjs/toolkit'
import menuReducer from './menuSlice'
import slideReducer from './slideSlice'
import loginReducer from './loginSlice'
import loaderReducer from './loaderSlice'
import clientsReducer from './clientsSlice'

const store = configureStore({
  reducer: {
    menu: menuReducer,
	slide: slideReducer,
	login: loginReducer,
	loader: loaderReducer,
	clients: clientsReducer
  }
})

export default store

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

