import { DayCardProps } from './DayCard.props'
import { DataGrid, GridColDef, GridRowId } from '@mui/x-data-grid'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import { IClient } from '../../interfaces/client.interface'
import { useAppSelector } from '../../store/hooks'
import { strData } from '../../helpers/helpers'
import { forwardRef, useState } from 'react'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Cancel'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import { ModalMessage } from '../ModalMessage/ModalMessage'
import { IDayCardTable } from '../../interfaces/daycard.interface'
import dayjs, { Dayjs } from 'dayjs'
import 'dayjs/locale/ru'
import TextField from '@mui/material/TextField'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker'
import TodayIcon from '@mui/icons-material/Today'
import { DaycardEdit } from '../DaycardEdit/DaycardEdit'
import Dialog from '@mui/material/Dialog'
import Slide from '@mui/material/Slide'
import { TransitionProps } from '@mui/material/transitions'
import { daycardsRef, storage, deleteFilesFromStorage, getClientDayCardKey } from '../../firebase/firebase'
import { ref } from "firebase/storage"

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />
})

export const DayCard = ({ className, ...props }: DayCardProps): JSX.Element => {
	const clients = useAppSelector(state => state.clients.clients)
	const [openDeleteWindow, setOpenDeleteWindow] = useState<boolean>(false)
	const [openEditDaycardWindow, setOpenEditDaycardWindow] = useState<boolean>(false)
	const [openViewDaycardWindow, setOpenViewDaycardWindow] = useState<boolean>(false)
	const [openEditDateWindow, setOpenEditDateWindow] = useState<boolean>(false)
	const [modalMessage, setModalMessage] = useState<string>('')
	const [selectionModelState, setSelectionModelState] = useState<GridRowId[]>([])
	const [date, setDate] = useState<Dayjs | null>(dayjs())
	const login = useAppSelector(state => state.login)

	const handleOpenDeleteWindow = () => {
		if (selectionModelState.length === 0) {
			setModalMessage('Выберите клиентов для удаления карт дня')
		} else {
			setOpenDeleteWindow(true)
		}
	}

	const handleCloseDeleteWindow = () => setOpenDeleteWindow(false)

	const handleOpenEditDaycardWindow = () => {
		if (selectionModelState.length !== 1) {
			setModalMessage('Выберите одного клиента для редактирования карты дня')
		} else {
			setOpenEditDaycardWindow(true)
		}
	}

	const handleOpenViewDaycardWindow = () => {
		if (selectionModelState.length !== 1) {
			setModalMessage('Выберите одного клиента для просмотра карты дня')
		} else {
			setOpenViewDaycardWindow(true)
		}
	}

	const handleCloseEditDaycardWindow = () => setOpenEditDaycardWindow(false)

	const handleCloseViewDaycardWindow = () => setOpenViewDaycardWindow(false)

	const handleOpenChangeDateWindow = () => setOpenEditDateWindow(true)

	const handleCloseChangeDateWindow = () => setOpenEditDateWindow(false)

	const closeModalMessage = () => setModalMessage('')

	const daycardsTableColumns: GridColDef[] = [
		{ field: 'firstName', headerName: 'Имя', flex: 1, minWidth: 100 },
		{ field: 'daycardSent', headerName: 'Карта', flex: 1, width: 30 },
		{ field: 'newComments', headerName: 'Комм', flex: 1, width: 30 },
		{ field: 'adminComments', headerName: 'Aдмин комм', flex: 1, minWidth: 100 },
		{ field: 'lastName', headerName: 'Фамилия', flex: 1, minWidth: 100 },
		{ field: 'id', headerName: 'ID', flex: 1, hide: true }
	]

	const isClientValidForDate = (client: IClient, day: Dayjs | null): boolean => {
		if (day === null) return false

		if (client.dateFrom === '') {
			if (client.dateTo === '') {
				return true
			} else {
				return day.isBefore(dayjs(client.dateTo, "DD-MM-YYYY")) || day.isSame(dayjs(client.dateTo, "DD-MM-YYYY"), 'day')
			}
		} else {
			if (client.dateTo === '') {
				return day.isAfter(dayjs(client.dateFrom, "DD-MM-YYYY")) || day.isSame(dayjs(client.dateFrom, "DD-MM-YYYY"), 'day')
			} else {
				return	(day.isBefore(dayjs(client.dateTo, "DD-MM-YYYY")) || day.isSame(dayjs(client.dateTo, "DD-MM-YYYY"), 'day')) &&
						(day.isAfter(dayjs(client.dateFrom, "DD-MM-YYYY")) || day.isSame(dayjs(client.dateFrom, "DD-MM-YYYY"), 'day'))
			}
		}
	}

	const daycardForClientTable = (client: IClient, day: Dayjs | null): IDayCardTable | null => {
		let daycardTable: IDayCardTable | null = null
		const clientDaycards = client.daycards

		if (clientDaycards === undefined) {
			return null
		} else {
			for (let key in clientDaycards) {
				if (clientDaycards[key].date === dayjs(date).format('DD.MM.YYYY')) {
					daycardTable = {
						firstName: strData(client.firstName),
						lastName: strData(client.lastName),
						daycardSent: clientDaycards[key].daycardSent? 'Да' : 'Нет',
						newComments: clientDaycards[key].newComments? 'Да' : 'Нет',
						adminComments: clientDaycards[key].adminComments,
						id: strData(client.id)
					}
				}
			}
		}
		return daycardTable
	}

	const daycardsTableUpdate = (clientsData: IClient[]): IDayCardTable[] => {
		let daycardsTable: IDayCardTable[] = []

		const clientsValidated = clientsData.filter(clientData => isClientValidForDate(clientData, date))

		clientsValidated.forEach(element => {
			const daycardClientTab = daycardForClientTable(element, date)
			if (daycardClientTab === null) {
				daycardsTable.push({
					firstName: strData(element.firstName),
					lastName: strData(element.lastName),
					daycardSent: "Нет",
					newComments: "Нет",
					adminComments: "",
					id: strData(element.id)
				})
			} else {
				daycardsTable.push(daycardClientTab)
			}
		})
		return daycardsTable
	}

	const deleteDaycards = () => {
		selectionModelState.forEach( async clientId => {
			const clientIdStr = String(clientId)
			const daycardId = getClientDayCardKey(clients, clientIdStr, date)

			if (daycardId !== null) {
				const path = clientIdStr + '/daycards/' + daycardId
				try {
					await daycardsRef.child(path).remove()
					const pathStorage = clientId + '/' + daycardId
					const fileRef = ref(storage, pathStorage)

					if (fileRef) {
						await deleteFilesFromStorage(fileRef)
					}
				} catch (e) {
					console.log(e)
				}
			}
		})
		handleCloseDeleteWindow()
	}

	return (
		<div>
			{login.logged &&
			<div className="absolute left-0 top-0 flex flex-col items-center justify-center flex-nowrap w-full h-full min-w-[350px] min-h-[350px]">
				<div className="h-1/6 w-full flex-col justify-center items-center">
					<div className="flex w-full justify-center items-center pt-[40px]">
						<Typography
							variant="h6"
							color="#e0e0e0"
							gutterBottom
							sx={{ }}
						>
							Карта дня
						</Typography>
					</div>
					<div className="flex w-full justify-center items-center">
						<Typography
							variant="subtitle1"
							color="#e0e0e0"
							gutterBottom
							sx={{ }}
						>
							{dayjs(date).locale('ru').format('dd DD MMMM YYYY г.')}
						</Typography>	
					</div>
				</div>
				<div className="h-4/6 w-full md:w-3/4 flex items-center justify-start flex-col pl-3 pr-3">
					<div className="flex w-full justify-start items-center">
						<div className="flex">
							<IconButton
								size="large"
								edge="start"
								color="inherit"
								aria-label="view"
								sx={{
									alignSelf: 'center',
									padding: '1rem',
								}}
								onClick={handleOpenViewDaycardWindow}
							>
								<RemoveRedEyeIcon sx={{ fill: '#e0e0e0', }}/>
							</IconButton>
						</div>
						<div className="flex">
							<IconButton
								size="large"
								edge="start"
								color="inherit"
								aria-label="edit"
								sx={{
									alignSelf: 'center',
									padding: '1rem',
								}}
								onClick={handleOpenEditDaycardWindow}
							>
								<EditIcon sx={{ fill: '#e0e0e0', }}/>
							</IconButton>
						</div>
						<div className="flex">
							<IconButton
								size="large"
								edge="start"
								color="inherit"
								aria-label="delete"
								sx={{
									alignSelf: 'center',
									padding: '1rem',
								}}
								onClick={handleOpenDeleteWindow}
							>
								<DeleteIcon sx={{ fill: '#e0e0e0', }}/>
							</IconButton>
						</div>
						<div className="flex">
							<IconButton
								size="large"
								edge="start"
								color="inherit"
								aria-label="day"
								sx={{
									alignSelf: 'center',
									padding: '1rem',
								}}
								onClick={handleOpenChangeDateWindow}
							>
								<TodayIcon sx={{ fill: '#e0e0e0', }}/>
							</IconButton>
						</div>
					</div>
					<div className="w-full h-full">
						<DataGrid
							rows={daycardsTableUpdate(clients)}
							columns={daycardsTableColumns}
							pageSize={9}
							rowsPerPageOptions={[9]}
							checkboxSelection
							autoHeight
							onSelectionModelChange={ selectionModel => setSelectionModelState(selectionModel) }
							autoPageSize
							disableColumnFilter
							// loading
							density='compact'
							sx={{
								backgroundColor: "#fafafa",
								fontSize: '0.7rem',	
							}}
						/>
					</div>
				</div>
				<div className="h-1/6 w-full"></div>
			</div>
			}
			<Dialog
				fullScreen
				open={openEditDaycardWindow && login.logged}
				onClose={handleCloseEditDaycardWindow}
				TransitionComponent={Transition}
			>
				<div className="absolute left-0 top-0 flex justify-start items-start w-full h-full min-w-[350px] min-h-[350px]">	
					<img className="object-cover w-full h-full" src={"../../pics/backgroundstars.jpg"} alt="Background" />
				</div>
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
					Изменение карты дня
				</Typography>
				<div className="flex w-full justify-center items-center">
					<Typography
						variant="subtitle1"
						gutterBottom
						color="#e0e0e0"
						sx={{ zIndex: '10' }}
					>
						{clients.find(e => e.id === selectionModelState[0])?.firstName}
					</Typography>	
				</div>
				<div className="flex w-full justify-center items-center">
					<Typography
						variant="subtitle1"
						gutterBottom
						color="#e0e0e0"
						sx={{ zIndex: '10 '}}
					>
						{dayjs(date).locale('ru').format('dd DD MMMM YYYY г.')}
					</Typography>	
				</div>
				<DaycardEdit onClose={handleCloseEditDaycardWindow} clientId={String(selectionModelState[0])} date={date} view={openViewDaycardWindow} />
			</Dialog>
			<Dialog
				fullScreen
				open={openViewDaycardWindow && login.logged}
				onClose={handleCloseViewDaycardWindow}
				TransitionComponent={Transition}
			>
				<div className="absolute left-0 top-0 flex justify-start items-start w-full h-full min-w-[350px] min-h-[350px]">	
					<img className="object-cover w-full h-full" src={"../../pics/backgroundstars.jpg"} alt="Background" />
				</div>
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
						{clients.find(e => e.id === selectionModelState[0])?.firstName}
					</Typography>	
				</div>
				<div className="flex w-full justify-center items-center">
					<Typography
						variant="subtitle1"
						gutterBottom
						color="#e0e0e0"
						sx={{ zIndex: '10 '}}
					>
						{dayjs(date).locale('ru').format('dd DD MMMM YYYY г.')}
					</Typography>	
				</div>
				<DaycardEdit onClose={handleCloseViewDaycardWindow} clientId={String(selectionModelState[0])} date={date} view={openViewDaycardWindow} />
			</Dialog>
			<Modal
				open={openDeleteWindow && login.logged}
				onClose={handleCloseDeleteWindow}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={{
					position: 'absolute' as 'absolute',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					width: '250px',
					bgcolor: '#fafafa',
					border: '2px solid #000',
					boxShadow: 24,
					p: 4,
				}}>
					<Typography
						id="modal-modal-title"
						variant="subtitle1"
						component="h2"
						sx={{
							textAlign: 'center',
						}}
					>
						Удалить карты дня для выделенных клиентов?
					</Typography>
					<div className="pt-2">
						<div className="grid grid-cols-4 grid-rows-1">
							<div className="flex w-full"></div>
							<div className="flex w-full"></div>
							<div className="flex w-full justify-center items-center">
								<IconButton
									size="large"
									edge="start"
									color="inherit"
									aria-label="save"
									sx={{
										alignSelf: 'center',
									}}
									onClick={deleteDaycards}
								>
									<SaveIcon />
								</IconButton>							
							</div>
							<div className="flex w-full justify-center items-center">
								<IconButton
									size="large"
									edge="start"
									color="inherit"
									aria-label="cancel"
									sx={{
										alignSelf: 'center',
									}}
									onClick={handleCloseDeleteWindow}
								>
									<CancelIcon />
								</IconButton>							
							</div>
						</div>
					</div>
				</Box>
			</Modal>
			<Modal
				open={openEditDateWindow && login.logged}
				onClose={handleCloseChangeDateWindow}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={{
					position: 'absolute' as 'absolute',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					bgcolor: '#fafafa',
					border: '2px solid #000',
					boxShadow: 24
				}}>
					<LocalizationProvider dateAdapter={AdapterDayjs}>
					<StaticDatePicker
						displayStaticWrapperAs="desktop"
						openTo="day"
						value={date}
						onChange={(newValue) => {
							setDate(newValue)
							setTimeout(() => {
								handleCloseChangeDateWindow()
							}, 200)
						}}
						renderInput={(params) => <TextField {...params} />}
					/>
					</LocalizationProvider>
				</Box>
			</Modal>
			{	login.logged &&
				<ModalMessage message={modalMessage} close={closeModalMessage} />
			}
		</div>
	)
}