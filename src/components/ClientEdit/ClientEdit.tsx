import { ClientEditProps } from './ClientEdit.props'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Cancel'
import IconButton from '@mui/material/IconButton'
import TextField, { TextFieldProps } from '@mui/material/TextField'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'
import dayjs, { Dayjs } from 'dayjs'
import { useAppSelector } from '../../store/hooks'
import { useState, useEffect } from 'react'
import { daycardsRef } from '../../firebase/firebase'
import { IDayCard } from '../../interfaces/daycard.interface'

export const ClientEdit = ({ onClose, clientId, className, ...props }: ClientEditProps): JSX.Element => {
	const [telegram, setTelegram] = useState<string>('')
	const [telegramError, setTelegramError] = useState<boolean>(false)
	const [firstName, setFirstName] = useState<string>('')
	const [firstNameError, setFirstNameError] = useState<boolean>(false)
	const [lastName, setLastName] = useState<string>('')
	const [greating, setGreating] = useState<string>('')
	const [dateTo, setDateTo] = useState<Dayjs | null>(null)
	const [dateToError, setDateToError] = useState<boolean>(false)
	const [dateFrom, setDateFrom] = useState<Dayjs | null>(null)
	const [dateFromError, setDateFromError] = useState<boolean>(false)
	const [description, setDescription] = useState<string>('')
	const [daycards, setDaycards] = useState<IDayCard[]>()
	const clients = useAppSelector(state => state.clients.clients)
	const login = useAppSelector(state => state.login)

	useEffect(() => {
		if (clientId !== undefined) {
			const client = clients.find( el => el.id === clientId )

			if (client !== undefined) {
				setTelegram(client.telegram)
				setFirstName(client.firstName)
				setLastName(client.lastName)
				setGreating(client.greating)
				if (client.dateTo) setDateTo(dayjs(client.dateTo, "DD-MM-YYYY"))
				if (client.dateFrom) setDateFrom(dayjs(client.dateFrom, "DD-MM-YYYY"))
				setDescription(client.description)
				if (client.daycards) setDaycards(client.daycards)
			}
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		if (!login.logged) onClose()
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [login.logged])

	const changeDateTo = (newValue: Dayjs | null) => {
		setDateTo(newValue)
	}

	const changeDateFrom = (newValue: Dayjs | null) => {
		setDateFrom(newValue)
	}

	const changeTelegram = (event: React.ChangeEvent<HTMLInputElement>) => {
		setTelegram(event.target.value)
	}

	const changeFirstName = (event: React.ChangeEvent<HTMLInputElement>) => {
		setFirstName(event.target.value)
	}

	const changeLastName = (event: React.ChangeEvent<HTMLInputElement>) => {
		setLastName(event.target.value)
	}

	const changeDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
		setDescription(event.target.value)
	}

	const changeGreating = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newGreating = event.target.value

		if (newGreating.trim().length !== 0) {
			setGreating(newGreating)
		} else {
			if (firstName.trim().length !== 0) {
				setGreating(`Добрый день, ${firstName}!`)
			} else {
				setGreating('')
			}
		}	
	}

	const submitHandler = (event: React.FormEvent) => {
		if ((telegram.trim().length === 0) ||
			(firstName.trim().length === 0) ||
			((dateTo !== null) && (dateFrom !== null) && dateTo.isBefore(dateFrom))) {
			
			if (telegram.trim().length === 0) {
				setTelegramError(true)
				setTimeout(() => {
					setTelegramError(false)
				}, 1000)
			}

			if (firstName.trim().length === 0) {
				setFirstNameError(true)
				setTimeout(() => {
					setFirstNameError(false)
				}, 1000)
			}

			if ((dateTo !== null) && (dateFrom !== null) && dateTo.isBefore(dateFrom)) {
				setDateToError(true)
				setTimeout(() => {
					setDateToError(false)
				}, 1000)				

				setDateFromError(true)
				setTimeout(() => {
					setDateFromError(false)
				}, 1000)
			}
			return
		}

		let newClient = {
			telegram: telegram,
			firstName: firstName,
			lastName: lastName,
			greating: greating,
			dateFrom: dateFrom === null ? '' : dayjs(dateFrom).format('DD.MM.YYYY'),
			dateTo: dateTo === null ? '' : dayjs(dateTo).format('DD.MM.YYYY'),
			description: description,
			daycards: daycards? daycards : []
		}

		if (clientId === undefined) {
			daycardsRef.push(newClient)
		} else {
			daycardsRef.child(clientId).set(newClient)
		}

		onClose()
	}

	return (
		<div className="pt-8">
			<div className="grid grid-cols-1 grid-rows-1">
				<div className="flex w-full justify-center items-center">
					<TextField label="Telegram" variant="outlined" error={telegramError} autoFocus required sx={{ width: '100%'}} value={telegram} onChange={changeTelegram} />
				</div>
			</div>
			<div className="grid grid-cols-2 grid-rows-2">
				<div className="flex w-full justify-center items-center mt-2">
					<TextField label="Имя" required variant="outlined" error={firstNameError} value={firstName} onChange={changeFirstName} />	
				</div>
				<div className="flex w-full justify-center items-center mt-2">
					<TextField label="Фамилия" variant="outlined" value={lastName} onChange={changeLastName} />
				</div>
				<div className="flex w-full justify-center items-center mt-2">
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<MobileDatePicker
						label="Дата c"
						inputFormat="DD/MM/YYYY"
						value={dateFrom}
						onChange={changeDateFrom}
						renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => <TextField {...params} error={dateFromError} />}
						/>
					</LocalizationProvider>
				</div>
				<div className="flex w-full justify-center items-center mt-2">
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<MobileDatePicker
						label="Дата по"
						inputFormat="DD/MM/YYYY"
						value={dateTo}
						onChange={changeDateTo}
						renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => <TextField {...params} error={dateToError} />}
						/>
					</LocalizationProvider>
				</div>
			</div>
			<div className="grid gap-2 grid-cols-1 grid-rows-1">
				<div className="flex w-full justify-center items-center mt-2">
					<TextField label="Описание" variant="outlined" sx={{ width: '100%'}} value={description} onChange={changeDescription} />
				</div>
			</div>
			<div className="grid gap-2 grid-cols-1 grid-rows-1">
				<div className="flex w-full justify-center items-center mt-2">
					<TextField label="Приветствие" variant="outlined" sx={{ width: '100%'}} value={greating} onChange={changeGreating} />
				</div>
			</div>
			<div className="grid gap-2 grid-cols-2 grid-rows-1">
				<div className="flex w-full"></div>
				<div className="flex w-full justify-end items-center">
					<div className="flex p-0">
							<IconButton
								size="large"
								edge="start"
								color="inherit"
								aria-label="save"
								sx={{
									alignSelf: 'center',
								}}
								onClick={submitHandler}
							>
								<SaveIcon />
							</IconButton>
						</div>
						<div className="flex p-0 pl-2">
							<IconButton
								size="large"
								edge="start"
								color="inherit"
								aria-label="cancel"
								sx={{
									alignSelf: 'center',
								}}
								onClick={onClose}
							>
								<CancelIcon />
							</IconButton>
						</div>
				</div>
			</div>
		</div> 
	)
}