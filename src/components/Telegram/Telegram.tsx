import { TelegramProps } from './Telegram.props'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import LoginIcon from '@mui/icons-material/Login'
import { useTelegram } from '../../hooks/useTelegram'
import { useEffect } from 'react'

export const Telegram = ({ className, ...props }: TelegramProps): JSX.Element => {
	const { onClose, tg, queryId, user } = useTelegram()

	
	useEffect(() => {
		//debug
		console.log('tg', tg)
		console.log('queryId', queryId)
		console.log('user', user)

		tg.MainButton.setParams({
			text: 'Close',
			color: '#FFFFFF',
			text_color: '#000000',
			is_active: true,
			is_visible: true
		})
		tg.MainButton.showProgress()
		tg.onEvent('mainButtonClicked', onClose)

		return () => {
			tg.offEvent('mainButtonClicked', onClose)
		}
	}, [])

	return (
		<div className="absolute left-0 top-0 flex flex-col items-center justify-center flex-nowrap w-full h-full min-w-[350px] min-h-[350px]">
			<div className="h-1/6 w-full"></div>
			<div className="h-4/6 w-full md:w-3/4 lg:w-4/12 flex items-center justify-start flex-col pl-3 pr-3">
				<div className="flex">
					<IconButton
						size="large"
						edge="start"
						color="inherit"
						aria-label="telegram"
						onClick={onClose}
					>
						<LoginIcon sx={{ fill: '#e0e0e0', }}/>
						<Typography
							variant="h4"
							color="#e0e0e0"
							gutterBottom
							sx={{ margin: '0', paddingLeft: '10px', }}
						>
							Hello, Telegram!
						</Typography>
					</IconButton>
				</div>
			</div>
			<div className="h-1/6 w-full"></div>
		</div>
	)
}