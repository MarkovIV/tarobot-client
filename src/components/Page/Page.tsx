import { useEffect } from 'react'
import { PageProps } from './Page.props'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { toggleSlideTo } from '../../store/slideSlice'
import { toggleClientsTo } from '../../store/clientsSlice'
import { toggleLoginTo, ILoginState } from '../../store/loginSlice'
import { pageData } from '../../data/data.page'
import { indexOfItem } from '../../helpers/helpers'
import { Admin } from '../Admin/Admin'
import { DayCard } from '../DayCard/DayCard'
import { Telegram } from '../Telegram/Telegram'
import { Login } from '../Login/Login'
import { Loader } from '../Loader/Loader'
import { authUser, daycardsRef } from '../../firebase/firebase'
import { IClient } from '../../interfaces/client.interface'
import { useTelegram } from '../../hooks/useTelegram'

export const Page = ({ item = "daycard", className, ...props }: PageProps): JSX.Element => {
	const slide = useAppSelector(state => state.slide.item)
	const login = useAppSelector(state => state.login)
	const loader = useAppSelector(state => state.loader.loader)
	const dispatch = useAppDispatch()
	const { tg, queryId } = useTelegram()

	useEffect(() => {
		dispatch(toggleSlideTo(item))

		//debug
		console.log('TG', tg)
		console.log('QUERY_ID', queryId)

		tg.ready()

		authUser.onAuthStateChanged( user => {
			if (user) {
				const userEmail = user.email
				let email = ''

				if (userEmail) email = userEmail

				const loginState: ILoginState = {
					logged: true,
					email: email
				}
				dispatch(toggleLoginTo(loginState))
				// window.location.reload()

			} else {
				const loginState: ILoginState = {
					logged: false,
					email: ''
				}
				dispatch(toggleLoginTo(loginState))
			}
		})

		daycardsRef.on('value', snapshot => {
			let items = snapshot.val()
			let newState: IClient[] = []

			for (let item in items) {
				const newClient = {
					id: item,
					telegram: items[item].telegram,
					type: items[item].type,
					firstName: items[item].firstName,
					lastName: items[item].lastName,
					greating: items[item].greating,
					dateFrom: items[item].dateFrom,
					dateTo: items[item].dateTo,
					description: items[item].description,
					daycards: items[item].daycards,
					groups: items[item].groups
				}	
				newState.push(newClient)		
			}
			dispatch(toggleClientsTo({
				clients: newState
			}))
		})
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<div>
			<div className="absolute left-0 top-0 flex justify-start items-start flex-nowrap w-full h-full min-w-[350px] min-h-[350px]">
				<img className="object-cover w-full h-full" src={pageData[indexOfItem(slide)].background} alt="Background" />
			</div>
			{
				!login.logged && tg.initData && <Telegram />
			}
			{
				!login.logged && !tg.initData && <Login />
			}
			{
				!login.logged && loader && <Loader />
			}
			{
				(login.logged && pageData[indexOfItem(slide)].item === "daycard") && <DayCard />
			}
			{
				(login.logged && pageData[indexOfItem(slide)].item === "admin") && <Admin />
			}
		</div>
	)		
}