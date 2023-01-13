import { AdminProps } from './Admin.props'
import { DataGrid, GridColDef, GridRowId } from '@mui/x-data-grid'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import AddBoxIcon from '@mui/icons-material/AddBox'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import { IClientTable, IClient } from '../../interfaces/client.interface'
import { useAppSelector } from '../../store/hooks'
import { strData } from '../../helpers/helpers'
import { useState } from 'react'
import { ClientEdit } from '../ClientEdit/ClientEdit'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Cancel'
import { ModalMessage } from '../ModalMessage/ModalMessage'
import { daycardsRef } from '../../firebase/firebase'

export const Admin = ({ className, ...props }: AdminProps): JSX.Element => {
	const clients = useAppSelector(state => state.clients.clients)
	const [openAddClientWindow, setOpenAddClientWindow] = useState<boolean>(false)
	const [openDeleteWindow, setOpenDeleteWindow] = useState<boolean>(false)
	const [openEditClientWindow, setOpenEditClientWindow] = useState<boolean>(false)
	const [modalMessage, setModalMessage] = useState<string>('')
	const [selectionModelState, setSelectionModelState] = useState<GridRowId[]>([])
	const login = useAppSelector(state => state.login)
	
	const handleOpenAddClientWindow = () => setOpenAddClientWindow(true)

	const handleCloseAddClientWindow = () => setOpenAddClientWindow(false)

	const handleOpenDeleteWindow = () => {
		if (selectionModelState.length === 0) {
			setModalMessage('Выберите клиентов для удаления')
		} else {
			setOpenDeleteWindow(true)
		}
	}

	const handleCloseDeleteWindow = () => setOpenDeleteWindow(false)

	const handleOpenEditClientWindow = () => {
		if (selectionModelState.length !== 1) {
			setModalMessage('Выберите одного клиента для редактирования')
		} else {
			setOpenEditClientWindow(true)
		}
	}

	const handleCloseEditClientWindow = () => setOpenEditClientWindow(false)

	const closeModalMessage = () => setModalMessage('')

	const clientsTableColumns: GridColDef[] = [
		{ field: 'firstName', headerName: 'Имя', flex: 1, minWidth: 100 },
		{ field: 'dateFrom', headerName: 'Дата с', flex: 1, minWidth: 80 },
		{ field: 'dateTo', headerName: 'Дата по', flex: 1, minWidth: 80 },
		{ field: 'lastName', headerName: 'Фамилия', flex: 1, minWidth: 100 },
		{ field: 'telegram', headerName: 'Телеграм', flex: 1, minWidth: 100 },
		{ field: 'id', headerName: 'ID', flex: 1, hide: true }
	]

	const clientsTableUpdate = (clientsData: IClient[]): IClientTable[] => {
		let clientsTable: IClientTable[] = []

		clientsData.forEach(element => clientsTable.push({
			firstName: strData(element.firstName),
			lastName: strData(element.lastName),
			dateFrom: strData(element.dateFrom),
			dateTo: strData(element.dateTo),
			telegram: strData(element.telegram),
			id: strData(element.id)
		}))
		return clientsTable
	}

	const deleteClients = () => {
		selectionModelState.forEach( clientId => {
			daycardsRef.child(String(clientId)).remove()
		})

		handleCloseDeleteWindow()
	}

	return (
		<div>
			{ login.logged &&
			<div className="absolute left-0 top-0 flex flex-col items-center justify-center flex-nowrap w-full h-full min-w-[350px] min-h-[350px]">
				<div className="h-1/6 w-full flex justify-center items-center">
					<Typography
						variant="h6"
						color="#e0e0e0"
						gutterBottom
						sx={{ margin: "0px", paddingTop: "40px" }}
					>
						Администрирование
					</Typography>	
				</div>
				<div className="h-4/6 w-full md:w-3/4 flex items-center justify-start flex-col pl-3 pr-3">
					<div className="flex w-full justify-start items-center">
						<div className="flex">
							<IconButton
								size="large"
								edge="start"
								color="inherit"
								aria-label="add"
								sx={{
									alignSelf: 'center',
									padding: '1rem',
								}}
								onClick={handleOpenAddClientWindow}
							>
								<AddBoxIcon sx={{ fill: '#e0e0e0', }}/>
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
								onClick={handleOpenEditClientWindow}
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
					</div>
					<div className="w-full h-full">
						<DataGrid
							rows={clientsTableUpdate(clients)}
							columns={clientsTableColumns}
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
			<Modal
				open={openAddClientWindow && login.logged}
				onClose={handleCloseAddClientWindow}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={{
					position: 'absolute' as 'absolute',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					width: '80%',
					maxWidth: '500px',
					bgcolor: '#fafafa',
					border: '2px solid #000',
					boxShadow: 24,
					p: 4,
				}}>
					<Typography
						id="modal-modal-title"
						variant="h6"
						component="h2"
						sx={{
							textAlign: 'center',
						}}
					>
						Новый клиент
					</Typography>
					<ClientEdit onClose={handleCloseAddClientWindow} />
				</Box>
			</Modal>
			<Modal
				open={openEditClientWindow && login.logged}
				onClose={handleCloseEditClientWindow}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={{
					position: 'absolute' as 'absolute',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					width: '80%',
					maxWidth: '500px',
					bgcolor: '#fafafa',
					border: '2px solid #000',
					boxShadow: 24,
					p: 4,
				}}>
					<Typography
						id="modal-modal-title"
						variant="h6"
						component="h2"
						sx={{
							textAlign: 'center',
						}}
					>
						Изменение данных клиента
					</Typography>
					<ClientEdit onClose={handleCloseEditClientWindow} clientId={String(selectionModelState[0])} />
				</Box>
			</Modal>
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
						Удалить выделенных клиентов?
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
									onClick={deleteClients}
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
			{	
				login.logged &&
				<ModalMessage message={modalMessage} close={closeModalMessage} />
			}
		</div>
	)
}