import { TelegramProps } from './Telegram.props'
import Typography from '@mui/material/Typography'
import { useTelegram } from '../../hooks/useTelegram'
import { useEffect } from 'react'
import dayjs from 'dayjs'
import { useAppSelector } from '../../store/hooks'
import { DaycardEdit } from '../DaycardEdit/DaycardEdit'

export const Telegram = ({ className, ...props }: TelegramProps): JSX.Element => {
	const { onClose, tg, user } = useTelegram()
	const clients = useAppSelector(state => state.clients.clients)

	useEffect(() => {
		//debug
		console.log('user.username', user.username)
		
		tg.MainButton.hide()
		tg.MainButton.disable()
		tg.MainButton.hideProgress()
		tg.expand()
	}, [tg, user.username])

	const getClientDataByTgName = (tgName: string) => {
		let clientData = {
			id: '',
			firstName: ''
		}

		//debug
		clients.forEach(el => {
			console.log(el)
			console.log(String(el.telegram))
		})

		const tgClient = clients.find(cl => String(cl.telegram) === tgName)
		if (tgClient) {
			clientData.id = String(tgClient.id)
			clientData.firstName = String(tgClient.firstName)
		}

		//debug
		console.log(clientData)

		return clientData
	}

	return (
		<div>
			<div className="absolute left-0 top-0 flex justify-start items-start w-full h-full min-w-[350px] min-h-[350px]">	
				<img className="object-cover w-full h-full" src={"../../pics/backgroundstars.jpg"} alt="Background" />
			</div>
			{	getClientDataByTgName(user.username).id &&
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
			}
		</div>
	)
}