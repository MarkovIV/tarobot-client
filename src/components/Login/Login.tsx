import { LoginProps } from './Login.props'
import Typography from '@mui/material/Typography'
import { useAppDispatch } from '../../store/hooks'
import { toggleLoginTo, ILoginState } from '../../store/loginSlice'
import { toggleLoaderTo } from '../../store/loaderSlice'
import IconButton from '@mui/material/IconButton'
import LoginIcon from '@mui/icons-material/Login'
import firebase from 'firebase/compat/app'
import { authUser } from '../../firebase/firebase'

export const Login = ({ className, ...props }: LoginProps): JSX.Element => {
	const dispatch = useAppDispatch()

	const loginUser = async () => {
		const provider = new firebase.auth.GoogleAuthProvider()

		dispatch(toggleLoaderTo({loader: true}))

		const { user } = await authUser.signInWithPopup(provider)

		dispatch(toggleLoaderTo({loader: false}))

		if (user) {
			const userEmail = user.email
			let email = ''

			if (userEmail) email = userEmail

			const loginState: ILoginState = {
				logged: true,
				email: email
			}
			dispatch(toggleLoginTo(loginState))
		}
	}

	return (
		<div className="absolute left-0 top-0 flex flex-col items-center justify-center flex-nowrap w-full h-full min-w-[350px] min-h-[350px]">
			<div className="h-1/6 w-full"></div>
			<div className="h-4/6 w-full md:w-3/4 lg:w-4/12 flex items-center justify-start flex-col pl-3 pr-3">
				<div className="flex">
					<IconButton
						size="large"
						edge="start"
						color="inherit"
						aria-label="login"
						onClick={loginUser}
					>
						<LoginIcon sx={{ fill: '#e0e0e0', }}/>
						<Typography
							variant="h4"
							color="#e0e0e0"
							gutterBottom
							sx={{ margin: '0', paddingLeft: '10px', }}
						>
							Google login
						</Typography>
					</IconButton>
				</div>
			</div>
			<div className="h-1/6 w-full"></div>
		</div>
	)
}