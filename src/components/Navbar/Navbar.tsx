import { NavbarProps } from './Navbar.props'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import LogoutIcon from '@mui/icons-material/Logout'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { toggleMenuTo } from '../../store/menuSlice'
import { toggleLoginTo, ILoginState } from '../../store/loginSlice'
import { authUser } from '../../firebase/firebase'

export const Navbar = ({ className, ...props }: NavbarProps): JSX.Element => {
	const menuOpened = useAppSelector(state => state.menu.open)
	const login = useAppSelector(state => state.login)
	const dispatch = useAppDispatch()

	return (
		<div className="flex fixed justify-center items-center pt-4 z-10 w-full min-w-max flex-wrap">
			<div className="flex justify-end items-center flex-nowrap w-full">
				<div className="flex">
					<IconButton
						size="large"
						edge="start"
						aria-label="null"
						sx={{ mr: 2, alignSelf: 'center', }}
					>
						<MenuIcon sx={{ fill: 'transparent', }}/>
					</IconButton>
				</div>
				{
					!menuOpened && login.logged &&

					<div className="flex">
						<IconButton
							size="large"
							edge="start"
							color="inherit"
							aria-label="logout"
							sx={{ mr: 2, alignSelf: 'center', }}
							onClick={ async () => {
								await authUser.signOut()

								const loginState: ILoginState = {
									logged: false,
									email: ''
								}
								dispatch(toggleLoginTo(loginState))
							}}
						>
							<LogoutIcon sx={{ fill: '#e0e0e0', }}/>
						</IconButton>
					</div>
				}
				{
					!menuOpened && login.logged &&

					<div className="flex">
						<IconButton
							size="large"
							edge="start"
							color="inherit"
							aria-label="menu"
							sx={{ mr: 2, alignSelf: 'center', }}
							onClick={() => dispatch(toggleMenuTo(true))}
						>
							<MenuIcon sx={{ fill: '#e0e0e0', }}/>
						</IconButton>
					</div>
				}
			</div>
		</div>
	)				
}