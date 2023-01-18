import { TelegramProps } from './Telegram.props'
import Typography from '@mui/material/Typography'
import { useTelegram } from '../../hooks/useTelegram'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { DaycardEdit } from '../DaycardEdit/DaycardEdit'
import { Navigate, useParams } from 'react-router-dom'
import axios from 'axios'

//debug
const testURL = 'https://firebasestorage.googleapis.com/v0/b/tarobot-a9b31.appspot.com/o/package.json?alt=media&token=1f1a3387-f1b7-49e1-9189-3b6df11aa5f6'

export const Telegram = ({ className, ...props }: TelegramProps): JSX.Element => {
	const [daycardURL, setDayCardURL] = useState<string>('')
	const {onClose, tg, user} = useTelegram()
	const params = useParams()
	const daycardParams = params.daycardParams

	let decodedDayCardParams = {}
	if (daycardParams) {
		decodedDayCardParams = JSON.parse(decodeURIComponent(daycardParams))
	}

	useEffect(() => {
		async function fetchData() {
			const res = await axios.get(testURL)
			setDayCardURL(res.data)
		}
		fetchData()

		//debug
		console.log('daycardURL', daycardURL)
		
		tg.MainButton.hide()
		tg.MainButton.disable()
		tg.MainButton.hideProgress()
		tg.expand()
		tg.ready()
	}, [tg, daycardURL])

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