import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import '@fontsource/public-sans'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Footer } from './components/Footer/Footer'
import { MenuList } from './components/MenuList/MenuList'
import { Navbar } from './components/Navbar/Navbar'
import { Page } from './components/Page/Page'

export default function App() {
  return (
	<>
		<Navbar />
		<MenuList />
		<Routes>
			<Route path="/admin" element={ <Page item="admin" /> } />
			<Route path="/daycard" element={ <Page item="daycard" /> } />
			<Route path="/" element={ <Page /> } />
			<Route path="*" element={ <Navigate to={"/"} /> } />
		</Routes>
		<Footer />
	</>
  )
}