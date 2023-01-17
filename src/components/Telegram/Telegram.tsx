import { TelegramProps } from './Telegram.props'
import Typography from '@mui/material/Typography'
import { useTelegram } from '../../hooks/useTelegram'
import { useEffect } from 'react'
import dayjs from 'dayjs'
import { DaycardEdit } from '../DaycardEdit/DaycardEdit'
import { Navigate, useParams } from 'react-router-dom'

export const Telegram = ({ className, ...props }: TelegramProps): JSX.Element => {
	const { onClose, tg, user } = useTelegram()
	const params = useParams()
	const daycardParams = params.daycardParams

	let decodedDayCardParams = {}
	if (daycardParams) {
		decodedDayCardParams = JSON.parse(decodeURIComponent(daycardParams))
	}

	//debug
	useEffect(() => {
		console.log('params', params)
		console.log('daycardParams', daycardParams)
		console.log('decodedDayCardParams', decodedDayCardParams)
	}, [])

	useEffect(() => {
		tg.ready()
	}, [tg])

	useEffect(() => {
		tg.MainButton.hide()
		tg.MainButton.disable()
		tg.MainButton.hideProgress()
		tg.expand()
	}, [tg])

	return (
		<div>
			{
				(tg.platform !== 'unknown') &&

				<div>
					<div className="absolute left-0 top-0 flex justify-start items-start w-full h-full min-w-[350px] min-h-[350px]">	
						<img className="object-cover w-full h-full" src={"../../pics/backgroundstars.jpg"} alt="Background" />
					</div>
					{/* {	getClientDataByTgName(user.username).id &&
						<div>
							<Typography
								id="modal-modal-title"
								variant="h6"
								component="h2"
								color="#e0e0e0"
								sx={{
									textAlign: 'center',
									paddingTop: '30px',
									zIndex: '10'
								}}
							>
								Карта дня
							</Typography>
							<div className="flex w-full justify-center items-center">
								<Typography
									variant="subtitle1"
									gutterBottom
									color="#e0e0e0"
									sx={{ zIndex: '10' }}
								>
									{getClientDataByTgName(user.username).firstName}
								</Typography>	
							</div>
							<div className="flex w-full justify-center items-center">
								<Typography
									variant="subtitle1"
									gutterBottom
									color="#e0e0e0"
									sx={{ zIndex: '10 '}}
								>
									{dayjs().locale('ru').format('dd DD MMMM YYYY г.')}
								</Typography>	
							</div>
							<DaycardEdit onClose={onClose} clientId={getClientDataByTgName(user.username).id} date={dayjs()} view />
						</div>
					} */}
				</div>
			}
			{
				(tg.platform === 'unknown') &&

				<Navigate to={"/"} />
			}
		</div>
	)
}