import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import '@fontsource/public-sans'
import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import { Footer } from './components/Footer/Footer'
import { MenuList } from './components/MenuList/MenuList'
import { Navbar } from './components/Navbar/Navbar'
import { Page } from './components/Page/Page'
import { Telegram } from './components/Telegram/Telegram'
import { useEffect } from 'react'

export default function App() {
	const params = useParams()
	const daycardParams = params.daycardParams

	useEffect(() => {
		//debug
		console.log('router params', params)
		console.log('router daycardParams', daycardParams)

	}, [daycardParams, params])

	return (
	<>
		<Navbar />
		<MenuList />
		<Routes>
			<Route path="/admin" element={ <Page item="admin" /> } />
			<Route path="/daycard/:daycardParams" element={ <Telegram daycard={daycardParams} /> } />
			<Route path="/" element={ <Page /> } />
			<Route path="*" element={ <Navigate to={"/"} /> } />
		</Routes>
		<Footer />
	</>
	)
}