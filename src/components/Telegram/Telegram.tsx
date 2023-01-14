import { TelegramProps } from './Telegram.props'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import LoginIcon from '@mui/icons-material/Login'

const tg = window.Telegram.WebApp

export const Telegram = ({ className, ...props }: TelegramProps): JSX.Element => {

	const onTelegram = () => {
		tg.close()
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
						aria-label="telegram"
						onClick={onTelegram}
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