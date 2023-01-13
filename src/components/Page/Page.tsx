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
import { Login } from '../Login/Login'
import { Loader } from '../Loader/Loader'
import { authUser, daycardsRef } from '../../firebase/firebase'
import { IClient } from '../../interfaces/client.interface'

export const Page = ({ item = "daycard", className, ...props }: PageProps): JSX.Element => {
	const slide = useAppSelector(state => state.slide.item)
	const login = useAppSelector(state => state.login)
	const loader = useAppSelector(state => state.loader.loader)
	const dispatch = useAppDispatch()

	useEffect(() => {
		dispatch(toggleSlideTo(item))

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



				{/* <div>
					<div className="absolute left-0 top-0 flex flex-col items-center justify-center flex-nowrap w-full h-full min-w-[350px] min-h-[350px]">
						<div className="h-1/6 w-full"></div>
						<div className="h-4/6 w-full md:w-3/4 lg:w-4/12 flex items-center justify-center flex-col pl-3 pr-3">
							<CardActionArea>
								<div className="h-4/6 w-full flex items-start justify-start flex-col">
									<img className={cn("object-cover w-full h-full rounded-t-md opacity-60", animation)} src={slideData[state].image} alt="Card" />
								</div>
								<div className="h-2/6 w-full flex items-center justify-center flex-col bg-gradient-to-r from-blue-300/80 to-gray-700/80 rounded-b-md">
									<div className="h-1/4 w-full flex items-start justify-start flex-col p-3">
										<Typography gutterBottom variant="h5" component="div" color="#e0e0e0">
											{slideData[state].title}
										</Typography>
									</div>
									<div className="h-2/4 w-full flex items-start justify-start flex-col p-3">
										<Typography variant="body2" color="#e0e0e0">
											{slideData[state].description}
										</Typography>
									</div>
									<div className="h-1/4 w-full flex items-end justify-end flex-col text-gray-300">
										<CardActions>
											<Button
												size="small"
												color='inherit'
												onClick={() => {
													dispatch(openArticle(true))
													dispatch(interestedSet(true))
												}}
											>	
												Подробнее
											</Button>
										</CardActions>
									</div>
								</div>
							</CardActionArea>
						</div>
						<div className="h-1/6 w-full"></div>
					</div>
					<div className="absolute inset-y-1/2 left-0 flex justify-center items-center opacity-70">
						<CardActionArea>
							<NavigateBeforeIcon
								sx={{width: '100px', height: '100px', color: '#c5cae9', }}
								onMouseDown={() => dispatch(toPrevSlide())}
							/>
						</CardActionArea>
					</div>
					<div className="absolute inset-y-1/2 right-0 flex justify-center items-center opacity-70">
						<CardActionArea>
							<NavigateNextIcon
								sx={{width: '100px', height: '100px', color: '#c5cae9', }}
								onMouseDown={() => dispatch(toNextSlide())}
							/>
						</CardActionArea>
					</div>
				</div> */}

			{
				!login.logged && <Login />
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