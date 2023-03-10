import { DaycardEditProps } from './DaycardEdit.props'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Cancel'
import DescriptionIcon from '@mui/icons-material/Description'
import IconButton from '@mui/material/IconButton'
import ForwardIcon from '@mui/icons-material/Forward'
import Badge from '@mui/material/Badge'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import AnnouncementIcon from '@mui/icons-material/Announcement'
import OpenInFullSharpIcon from '@mui/icons-material/OpenInFullSharp'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import Zoom from '@mui/material/Zoom'
import ChatIcon from '@mui/icons-material/Chat'
import CheckIcon from '@mui/icons-material/Check'
import dayjs, { Dayjs } from 'dayjs'
import { useAppSelector } from '../../store/hooks'
import { useState, useRef, useEffect } from 'react'
import { daycardsRef, storage, uploadFile, deleteFilesFromStorage, getClientDayCardKey, uploadBlobAudio } from '../../firebase/firebase'
import AudioPlayer from 'react-h5-audio-player'
import 'react-h5-audio-player/lib/styles.css'
import { IComment, IDayCard, IFileData } from '../../interfaces/daycard.interface'
import Modal from '@mui/material/Modal'
import AddBoxIcon from '@mui/icons-material/AddBox'
import EditIcon from '@mui/icons-material/Edit'
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto'
import AudiotrackIcon from '@mui/icons-material/Audiotrack'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Textarea from '@mui/joy/Textarea'
import { sortFileNames } from '../../helpers/helpers'
import { ref } from "firebase/storage"
import { ModalMessage } from '../ModalMessage/ModalMessage'
import KeyboardVoiceRoundedIcon from '@mui/icons-material/KeyboardVoiceRounded'
import { AudioRecorder } from 'react-audio-voice-recorder'

export const DaycardEdit = ({ onClose, view, clientId, date, className, ...props }: DaycardEditProps): JSX.Element => {
	const [description, setDescription] = useState<string>('')
	const [adminComments, setAdminComments] = useState<string>('')
	const [comments, setComments] = useState<string>('')
	const [photoWindow, setPhotoWindow] = useState<boolean>(false)
	const [recordWindow, setRecordWindow] = useState<boolean>(false)
	const [descriptionEditWindow, setDescriptionEditWindow] = useState<boolean>(false)
	const [adminCommentsEditWindow, setAdminCommentsEditWindow] = useState<boolean>(false)
	const [commentsEditWindow, setCommentsEditWindow] = useState<boolean>(false)
	const [modalMessage, setModalMessage] = useState<string>('')
	const [photoWidth, setPhotoWidth] = useState<number>()
	const [photoHeight, setPhotoHeight] = useState<number>()
	const clients = useAppSelector(state => state.clients.clients)
	const [expanded, setExpanded] = useState<string | false>(false)
	const photoRef = useRef(null)
	const [audioPlayer, setAudioPlayer] = useState<any>()
	const [blobAudio, setBlobAudio] = useState<any>()
	const login = useAppSelector(state => state.login)

	//debug
	useEffect(() => {
		// console.log('clientId', clientId)
		// console.log('date', date?.format('DDMMYYYY'))
	},[clientId, date])

	useEffect(() => {
		if (!login.logged) onClose()
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [login.logged])

	const updatePhotoSizes = () => {
		const photo = photoRef.current as HTMLElement | null
		if (photo) {
			photo.style.width = `${photoWidth}px`
			photo.style.height = `${photoHeight}px`
		}
	}

	const handleOpenPhotoWindow = () => setPhotoWindow(true)

	const handleClosePhotoWindow = () => setPhotoWindow(false)

	const handleOpenRecordWindow = () => setRecordWindow(true)

	const handleCloseRecordWindow = () => {
		setRecordWindow(false)
		setAudioPlayer(undefined)
		setBlobAudio(undefined)
	}

	const handleSaveRecord = () => {
		saveAudioBlob()
		handleCloseRecordWindow()
	}

	const closeModalMessage = () => {
		setModalMessage('')
	}

	const changePhoto = async (event: React.ChangeEvent<HTMLInputElement>) => {
		if (date === null) {
			return
		}
		const fileList = event.target.files
		let newFiles = []
		
		if (fileList) {
			const len = fileList.length

			for (let i = 0; i < len; i++) {
				newFiles.push(fileList[i])
			}
			newFiles.sort((file1, file2) => sortFileNames(file1.name, file2.name))
		}
		const daycardId = getClientDayCardKey(clients, clientId, date)

		if (daycardId !== null) {
			const path = clientId + '/' + daycardId + '/photo/'
			const fileRef = ref(storage, path)

			if (fileRef) {
				await deleteFilesFromStorage(fileRef)
			}
			const filedata = await uploadFile(path, newFiles)

			const photoPath = clientId + '/daycards/' + daycardId + '/photo'
			if (filedata.length > 0) {
				daycardsRef.child(photoPath).child('link').set(filedata[0].link)
				daycardsRef.child(photoPath).child('name').set(filedata[0].name)
			} else {
				daycardsRef.child(photoPath).remove()
			}
		} else {
			const daycard = { date: dayjs(date).format('DD.MM.YYYY') }
			
			const res = await daycardsRef.child(clientId + '/daycards').push(daycard)
			const newDaycardId = res.key

			const path = clientId + '/' + newDaycardId + '/photo/'
			const filedata = await uploadFile(path, newFiles)

			const photoPath = clientId + '/daycards/' + newDaycardId + '/photo'
			if (filedata.length > 0) {
				daycardsRef.child(photoPath).child('link').set(filedata[0].link)
				daycardsRef.child(photoPath).child('name').set(filedata[0].name)
			} else {
				daycardsRef.child(photoPath).remove()
			}
		}
	}

	const changeAudio = async (event: React.ChangeEvent<HTMLInputElement>) => {
		if (date === null) {
			return
		}
		const fileList = event.target.files
		let newFiles = []
		
		if (fileList) {
			const len = fileList.length

			for (let i = 0; i < len; i++) {
				newFiles.push(fileList[i])
			}
			newFiles.sort((file1, file2) => sortFileNames(file1.name, file2.name))
		}
		const daycardId = getClientDayCardKey(clients, clientId, date)

		if (daycardId !== null) {
			const path = clientId + '/' + daycardId + '/audio/'
			const fileRef = ref(storage, path)

			if (fileRef) {
				await deleteFilesFromStorage(fileRef)
			}
			const filedata = await uploadFile(path, newFiles)

			const audioPath = clientId + '/daycards/' + daycardId + '/audio'
			if (filedata.length > 0) {
				daycardsRef.child(audioPath).child('link').set(filedata[0].link)
				daycardsRef.child(audioPath).child('name').set(filedata[0].name)
			} else {
				daycardsRef.child(audioPath).remove()
			}
		} else {
			const daycard = { date: dayjs(date).format('DD.MM.YYYY') }
			
			const res = await daycardsRef.child(clientId + '/daycards').push(daycard)
			const newDaycardId = res.key

			const path = clientId + '/' + newDaycardId + '/audio/'
			const filedata = await uploadFile(path, newFiles)

			const audioPath = clientId + '/daycards/' + newDaycardId + '/audio'
			if (filedata.length > 0) {
				daycardsRef.child(audioPath).child('link').set(filedata[0].link)
				daycardsRef.child(audioPath).child('name').set(filedata[0].name)
			} else {
				daycardsRef.child(audioPath).remove()
			}
		}
	}

	const saveAudioBlob = async () => {
		if (date === null) {
			return
		}
		const daycardId = getClientDayCardKey(clients, clientId, date)
		let filedata: IFileData | undefined

		if (daycardId !== null) {
			const path = clientId + '/' + daycardId + '/audio/'
			const fileRef = ref(storage, path)

			if (fileRef) {
				await deleteFilesFromStorage(fileRef)
			}
			if (blobAudio) {
				filedata = await uploadBlobAudio(path, blobAudio)
			}
			const audioPath = clientId + '/daycards/' + daycardId + '/audio'
			if (filedata) {
				daycardsRef.child(audioPath).child('link').set(filedata.link)
				daycardsRef.child(audioPath).child('name').set(filedata.name)
			} else {
				daycardsRef.child(audioPath).remove()
			}
		} else {
			const daycard = { date: dayjs(date).format('DD.MM.YYYY') }
			
			const res = await daycardsRef.child(clientId + '/daycards').push(daycard)
			const newDaycardId = res.key

			const path = clientId + '/' + newDaycardId + '/audio/'
			if (blobAudio) {
				filedata = await uploadBlobAudio(path, blobAudio)
			}
			const audioPath = clientId + '/daycards/' + newDaycardId + '/audio'
			if (filedata) {
				daycardsRef.child(audioPath).child('link').set(filedata.link)
				daycardsRef.child(audioPath).child('name').set(filedata.name)
			} else {
				daycardsRef.child(audioPath).remove()
			}
		}
	}

	const changeDescription = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		const text = event.target.value

		setDescription(text)
	}

	const handleSaveDescription = () => {
		if (date !== null) {
			const daycardId = getClientDayCardKey(clients, clientId, date)

			if (daycardId !== null) {
				daycardsRef.child(clientId).child('daycards').child(daycardId).child('description').set(description)
			} else {			
				const daycard = {
					date: dayjs(date).format('DD.MM.YYYY'),
					description: description
				}
				daycardsRef.child(clientId + '/daycards').push(daycard)
			}
		}
		handleCloseDescriptionEditWindow()
	}

	const handleSaveAdminComments = () => {
		if (date !== null) {
			const daycardId = getClientDayCardKey(clients, clientId, date)

			if (daycardId !== null) {
				daycardsRef.child(clientId).child('daycards').child(daycardId).child('adminComments').set(adminComments)
			} else {			
				const daycard = {
					date: dayjs(date).format('DD.MM.YYYY'),
					adminComments: adminComments
				}
				daycardsRef.child(clientId + '/daycards').push(daycard)
			}
		}
		handleCloseAdminCommentsEditWindow()
	}

	const handleSaveComments = () => {
		if (date !== null) {
			const daycardId = getClientDayCardKey(clients, clientId, date)
			const newComment = {
				role: "Taronomics",
				text: comments,
				time: dayjs().format('DD.MM.YYYY HH:mm:ss')
			}
			if (daycardId !== null) {
				daycardsRef.child(clientId).child('daycards').child(daycardId + '/comments').push(newComment)

				if (dayjs().isSame(date, 'day')) {
					daycardsRef.child(clientId).child('deliverComments').set(true)
				}
			} else {
				const daycard = {
					date: dayjs(date).format('DD.MM.YYYY')
				}
				daycardsRef.child(clientId + '/daycards').push(daycard)
				.then( res => {
					const newDaycardId = res.key

					daycardsRef.child(clientId).child('daycards').child(newDaycardId + '/comments').push(newComment)

					if (dayjs().isSame(date, 'day')) {
						daycardsRef.child(clientId).child('deliverComments').set(true)
					}
				})
			}
		}
		handleCloseCommentsEditWindow()
	}

	const changeFiles = async (event: React.ChangeEvent<HTMLInputElement>) => {
		if (date === null) {
			return
		}
		const fileList = event.target.files
		let newFiles = []
		
		if (fileList) {
			const len = fileList.length

			for (let i = 0; i < len; i++) {
				newFiles.push(fileList[i])
			}
			newFiles.sort((file1, file2) => sortFileNames(file1.name, file2.name))
		}
		const daycardId = getClientDayCardKey(clients, clientId, date)

		if (daycardId !== null) {
			const path = clientId + '/' + daycardId + '/file/'
			const fileRef = ref(storage, path)

			if (fileRef) {
				await deleteFilesFromStorage(fileRef)
			}
			const filedata = await uploadFile(path, newFiles)

			daycardsRef.child(clientId).child('daycards').child(daycardId + '/file').set(filedata)
		} else {
			const daycard = { date: dayjs(date).format('DD.MM.YYYY') }
			
			const res = await daycardsRef.child(clientId + '/daycards').push(daycard)
			const newDaycardId = res.key

			const path = clientId + '/' + newDaycardId + '/file/'
			const filedata = await uploadFile(path, newFiles)

			daycardsRef.child(clientId).child('daycards').child(newDaycardId + '/file').set(filedata)	
		}
	}

	const changeAdminComments = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		const text = event.target.value

		setAdminComments(text)
	}

	const changeComments = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		const text = event.target.value

		setComments(text)
	}

	const handleOpenDescriptionEditWindow = () => {
		setDescription(getClientDayCardDescription(clientId, date))
		
		setDescriptionEditWindow(true)
	}

	const handleCloseDescriptionEditWindow = () => setDescriptionEditWindow(false)

	const handleOpenAdminCommentsEditWindow = () => {
		setAdminComments(getClientDayCardAdminComments(clientId, date))

		setAdminCommentsEditWindow(true)
	}

	const handleCloseAdminCommentsEditWindow = () => setAdminCommentsEditWindow(false)

	const handleOpenCommentsEditWindow = () => {
		setComments('')

		setCommentsEditWindow(true)
	}

	const handleCloseCommentsEditWindow = () => setCommentsEditWindow(false)

	const getClientDayCard = (clientId: string, date: Dayjs | null): IDayCard | null => {
		if (date === null ) {
			return null
		}

		const daycards = clients.filter(el => el.id === clientId)[0].daycards
		if (daycards !== undefined) {
			for (let key in daycards) {
				if (daycards[key].date === dayjs(date).format('DD.MM.YYYY')) {
					const daycard = daycards[key]
					return daycard
				}
			}
		}
		return null
	}

	const getClientDayCardPhoto = (clientId: string, date: Dayjs | null): string => {
		let photo = ""

		const daycard = getClientDayCard(clientId, date)
		if (daycard !== null) {
			if (daycard.photo !== undefined) {
				if (daycard.photo.link !== undefined) {
					photo = daycard.photo.link
				} 
			}
		} 
		return photo
	}

	const setClientDayCardPhotoSizes = (clientId: string, date: Dayjs | null): void => {
		const daycard = getClientDayCard(clientId, date)
		if (daycard !== null) {
			if (daycard.photo !== undefined) {
				if (daycard.photo.link !== undefined) {
					const img = new Image()
					img.src = daycard.photo.link
					setPhotoWidth(Number(img.width))
					setPhotoHeight(Number(img.height))						
				}
			}
		}
	}

	const getClientDayCardAudio = (clientId: string, date: Dayjs | null): string => {
		let audio = ""

		const daycard = getClientDayCard(clientId, date)
		if (daycard !== null) {
			if (daycard.audio !== undefined) {
				if (daycard.audio.link !== undefined) {
					audio = daycard.audio.link
				}
			}
		}
		return audio
	}

	const getClientDayCardDescription = (clientId: string, date: Dayjs | null): string => {
		let description = ""

		const daycard = getClientDayCard(clientId, date)
		if (daycard !== null) {
			if (daycard.description !== undefined) {
				description = daycard.description	
			}
		}
		return description
	}

	const getClientDayCardAdminComments = (clientId: string, date: Dayjs | null): string => {
		let adminComments = ""

		const daycard = getClientDayCard(clientId, date)
		if (daycard !== null) {
			if (daycard.adminComments !== undefined) {
				adminComments = daycard.adminComments	
			}
		}
		return adminComments
	}

	const getClientDayCardFiles = (clientId: string, date: Dayjs | null): IFileData[] => {
		let filesArray: IFileData[] = []

		const daycard = getClientDayCard(clientId, date)
		if (daycard !== null) {
			const daycardFile = daycard.file
			if (daycardFile !== undefined) {
				for (let key in daycardFile) {
					filesArray.push(daycardFile[key])
				}
			}
		}
		return filesArray
	}

	const getClientDayCardComments = (clientId: string, date: Dayjs | null): IComment[] => {
		let comments: IComment[] = []

		const daycard = getClientDayCard(clientId, date)
		if (daycard !== null) {
			const daycardComments = daycard.comments
			if (daycardComments !== undefined) {
				for (let key in daycardComments) {
					comments.push(daycardComments[key])
				}
			}
		}
		return comments
	}

	const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    	setExpanded(isExpanded ? panel : false)
    }

	const onSend = (event: React.FormEvent) => {
		if (date !== null) {
			const daycardId = getClientDayCardKey(clients, clientId, date)

			if (daycardId !== null) {
				daycardsRef.child(clientId).child('daycards').child(daycardId).child('daycardSent').set(true)

				if (dayjs().isSame(date, 'day')) {
					daycardsRef.child(clientId).child('deliverTheCard').set(true)
				}
				onClose()
			} else {
				setModalMessage('?????????????????? ?????????? ??????')	
			}
		} else {
			onClose()
		}
	}

	const addAudioElement = (blob: any) => {
		const url = URL.createObjectURL(blob)
		const audioElement = 
			<AudioPlayer
				autoPlay = {false}
				src={url}
				onPlay={e => {}}
			/>

		setAudioPlayer(audioElement)
		setBlobAudio(blob)
	}

	return (
		<div className="pt-8 pl-2 pr-2 opacity-80 overflow-auto">
			<div className="relative flex justify-center items-center pb-4 w-full h-[300px]">
				<div className="relative flex w-full h-full rounded-md border-2 border-inherit">
					<div className="absolute left-0 top-0 flex justify-start items-start w-full h-full">	
						<img
							className="object-cover w-full h-full"
							src={getClientDayCardPhoto(clientId, date)}
							alt="Card"
							onLoad={() => setClientDayCardPhotoSizes(clientId, date)}
						/>
					</div>
					<div className="absolute flex w-full bottom-0">
						<AudioPlayer
							autoPlay = {false}
							src={getClientDayCardAudio(clientId, date)}
							onPlay={e => {}}
						/>
					</div>
				</div>
				{
					photoWidth &&

					<div className="absolute right-0 top-0 flex justify-start items-start pt-1 pr-1">
						<IconButton
							size="large"
							disableRipple
							aria-label="expand"
							sx={{
								backgroundColor: 'white',
								color: 'black',
								opacity: '90%'
							}}
							onClick={handleOpenPhotoWindow}
						>
							<OpenInFullSharpIcon />
						</IconButton>
					</div>
				}
				{
					!view &&

					<div className="absolute left-0 top-0 flex justify-start items-start pt-1 pl-1">
						<div className="">
							<IconButton
								size="large"
								disableRipple
								aria-label="photoEdit"
								sx={{
									backgroundColor: 'white',
									color: 'black',
									opacity: '90%',
								}}
							>	
								<label className="flex">
									<AddAPhotoIcon />
									<input
										type="file"
										onChange={changePhoto}
										className="w-[0.1px] h-[0.1px] opacity-0 absolute -z-30"
									/>
								</label>
							</IconButton>
						</div>
						<div className="pl-2">
							<IconButton
								size="large"
								disableRipple
								aria-label="audioEdit"
								sx={{
									backgroundColor: 'white',
									color: 'black',
									opacity: '90%'
								}}
							>
								<label className="flex">
									<AudiotrackIcon />
									<input
										type="file"
										onChange={changeAudio}
										className="w-[0.1px] h-[0.1px] opacity-0 absolute -z-30"
									/>
								</label>
							</IconButton>
						</div>
						<div className="pl-2">
							<IconButton
								size="large"
								disableRipple
								aria-label="audioRecord"
								sx={{
									backgroundColor: 'white',
									color: 'black',
									opacity: '90%'
								}}
								onClick={handleOpenRecordWindow}
							>
								<KeyboardVoiceRoundedIcon />	
							</IconButton>
						</div>
					</div>
				}
			</div>
			<Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
				<AccordionSummary
				expandIcon={<ExpandMoreIcon />}
				aria-controls="panel1bh-content"
				id="panel1bh-header"
				>
				<Typography sx={{ width: '33%', flexShrink: 0, textAlign: 'center' }}>
					{
						getClientDayCardDescription(clientId, date)?
							<Badge badgeContent={1} color="success">
								<DescriptionIcon />
							</Badge>
							:
							<DescriptionIcon />
					}
				</Typography>
				<Typography sx={{ color: 'text.secondary' }}>????????????????</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<div className="overflow-auto">
						{
							!view &&

							<div className="">
								<IconButton
									size="large"
									aria-label="descriptionEdit"
									sx={{
										backgroundColor: 'white',
										color: 'black',
										opacity: '90%'
									}}
									onClick={handleOpenDescriptionEditWindow}
								>
									<EditIcon />
								</IconButton>
							</div>
						}
						<Typography>
							{getClientDayCardDescription(clientId, date)}
						</Typography>
					</div>
				</AccordionDetails>
			</Accordion>
			<Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
				<AccordionSummary
				expandIcon={<ExpandMoreIcon />}
				aria-controls="panel2bh-content"
				id="panel2bh-header"
				>
				<Typography sx={{ width: '33%', flexShrink: 0, textAlign: 'center' }}>
					{
						(getClientDayCardFiles(clientId, date).length > 0)?
							<Badge badgeContent={getClientDayCardFiles(clientId, date).length} color="success">
								<AttachFileIcon />
							</Badge>
							:
							<AttachFileIcon />
					}
				</Typography>
				<Typography sx={{ color: 'text.secondary' }}>
					????????????????????
				</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<div className="overflow-auto">
						{
							!view &&

							<div className="">
								<IconButton
									size="large"
									aria-label="filesEdit"
									sx={{
										backgroundColor: 'white',
										color: 'black',
										opacity: '90%'
									}}
								>
									<label className="flex">
										<EditIcon />
										<input
											type="file"
											multiple
											onChange={changeFiles}
											className="w-[0.1px] h-[0.1px] opacity-0 absolute -z-30"
										/>
									</label>
								</IconButton>
							</div>
						}
						{getClientDayCardFiles(clientId, date).map(el => <div key={el.name}><a href={el.link} target="_blank" rel="noreferrer" className="underline hover:decoration-2">{el.name}</a></div>)}
					</div>
				</AccordionDetails>
			</Accordion>
			<Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
				<AccordionSummary
				expandIcon={<ExpandMoreIcon />}
				aria-controls="panel3bh-content"
				id="panel3bh-header"
				>
				<Typography sx={{ width: '33%', flexShrink: 0, textAlign: 'center' }}>
					{
						getClientDayCardAdminComments(clientId, date)?
							<Badge badgeContent={1} color="success">
								<AnnouncementIcon />
							</Badge>
							:
							<AnnouncementIcon />
					}
				</Typography>
				<Typography sx={{ color: 'text.secondary' }}>
					?????????????? ????????????????????????????
				</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<div className="overflow-auto">
						{
							!view &&

							<div className="">
								<IconButton
									size="large"
									aria-label="adminCommentsEdit"
									sx={{
										backgroundColor: 'white',
										color: 'black',
										opacity: '90%'
									}}
									onClick={handleOpenAdminCommentsEditWindow}
								>
									<EditIcon />
								</IconButton>
							</div>
						}
						<Typography>
							{getClientDayCardAdminComments(clientId, date)}
						</Typography>
					</div>
				</AccordionDetails>
			</Accordion>
			<Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
				<AccordionSummary
				expandIcon={<ExpandMoreIcon />}
				aria-controls="panel4bh-content"
				id="panel4bh-header"
				>
				<Typography sx={{ width: '33%', flexShrink: 0, textAlign: 'center' }}>
					{
						(getClientDayCardComments(clientId, date).length > 0)?
							<Badge badgeContent={getClientDayCardComments(clientId, date).length} color="success">
								<ChatIcon />
							</Badge>
							:
							<ChatIcon />
					}	
				</Typography>
				<Typography sx={{ color: 'text.secondary' }}>
					??????????????????????
				</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<div className="overflow-auto">
						{
							!view &&

							<div className="">
								<IconButton
									size="large"
									aria-label="commentsEdit"
									sx={{
										backgroundColor: 'white',
										color: 'black',
										opacity: '90%'
									}}
									onClick={handleOpenCommentsEditWindow}
								>
									<AddBoxIcon />
								</IconButton>
							</div>
						}
						{getClientDayCardComments(clientId, date).map(el => <div key={el.time}>
							<div className="font-bold">{el.role}</div>
							<div className="italic pb-1">{el.time}</div>
							<div className='pb-8'>{el.text}</div>
						</div>)}
					</div>
				</AccordionDetails>
			</Accordion>
			<div className="grid gap-2 grid-cols-2 grid-rows-1 pt-4">
				<div className="flex w-full"></div>
				<div className="flex w-full justify-end items-center">
					{
						view &&

						<div className="flex p-0">
							<IconButton
								size="large"
								edge="start"
								aria-label="ok"
								sx={{
									alignSelf: 'center',
									color: '#e0e0e0'
								}}
								onClick={onClose}
							>
								<CheckCircleIcon />
							</IconButton>
						</div>
					}
					{
						!view &&

						<div className="flex w-full justify-end items-center">
							<div className="flex p-0">
								<IconButton
									size="large"
									edge="start"
									aria-label="cancel"
									sx={{
										alignSelf: 'center',
										color: '#e0e0e0'
									}}
									onClick={onClose}
								>
									<CancelIcon />
								</IconButton>
							</div>
							<div className="flex p-0 pl-2">
								<IconButton
									size="large"
									edge="start"
									aria-label="send"
									sx={{
										alignSelf: 'center',
										color: '#e0e0e0'
									}}
									onClick={onSend}
								>
									<ForwardIcon />
								</IconButton>
							</div>
						</div>
					}
				</div>
			</div>
			<Modal
				open={photoWindow}
				onClose={handleClosePhotoWindow}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
				sx={{ relative: 'true' }}
			>
				<Zoom in={photoWindow}>
					<div className="flex justify-center items-center w-full h-full overflow-auto">
						<img
							ref={photoRef}
							className="object-contain object-center"
							src={getClientDayCardPhoto(clientId, date)}
							alt="Card"
							// onLoad={updatePhotoSizes}
						/>
						<div className="absolute right-0 bottom-0 pr-6 pb-6">
							<IconButton
								size="large"
								edge="start"
								color="inherit"
								disableRipple	
								aria-label="ok"
								sx={{
									alignSelf: 'center',
									backgroundColor: 'white',
									color: 'black',
									opacity: '90%'
								}}
								onClick={handleClosePhotoWindow}
							>
								<CheckIcon />
							</IconButton>							
						</div>	
					</div>
				</Zoom>
			</Modal>
			<Dialog
				open={descriptionEditWindow}
				onClose={handleCloseDescriptionEditWindow}
				scroll={'paper'}
				aria-labelledby="scroll-dialog-title"
				aria-describedby="scroll-dialog-description"
			>
				<DialogTitle id="scroll-dialog-title">
					???????????????? ????????????????
				</DialogTitle>
				<DialogContent dividers>
					<Textarea
						variant="plain"
						minRows={2}
						size="lg"
						placeholder="?????????????? ???????????????????"
						value={description}
						onChange={changeDescription}
					/>
				</DialogContent>
				<DialogActions>
					<div className="flex p-0">
						<IconButton
							size="large"
							edge="start"
							aria-label="cancel"
							sx={{
								alignSelf: 'center',
								color: 'black'
							}}
							onClick={handleCloseDescriptionEditWindow}
						>
							<CancelIcon />
						</IconButton>
					</div>
					<div className="flex p-0 pl-2">
						<IconButton
							size="large"
							edge="start"
							aria-label="save"
							sx={{
								alignSelf: 'center',
								color: 'black'
							}}
							onClick={handleSaveDescription}
						>
							<SaveIcon />
						</IconButton>
					</div>
				</DialogActions>
			</Dialog>
			<Dialog
				open={adminCommentsEditWindow}
				onClose={handleCloseAdminCommentsEditWindow}
				scroll={'paper'}
				aria-labelledby="scroll-dialog-title"
				aria-describedby="scroll-dialog-description"
			>
				<DialogTitle id="scroll-dialog-title">?????????????? ????????????????????????????</DialogTitle>
				<DialogContent dividers>
					<Textarea
						variant="plain"
						minRows={2}
						size="lg"
						placeholder="?????????????? ?????????????? ???????????????????????????????"
						value={adminComments}
						onChange={changeAdminComments}
					/>
				</DialogContent>
				<DialogActions>
					<div className="flex p-0">
						<IconButton
							size="large"
							edge="start"
							aria-label="cancel"
							sx={{
								alignSelf: 'center',
								color: 'black'
							}}
							onClick={handleCloseAdminCommentsEditWindow}
						>
							<CancelIcon />
						</IconButton>
					</div>
					<div className="flex p-0 pl-2">
						<IconButton
							size="large"
							edge="start"
							aria-label="save"
							sx={{
								alignSelf: 'center',
								color: 'black'
							}}
							onClick={handleSaveAdminComments}
						>
							<SaveIcon />
						</IconButton>
					</div>
				</DialogActions>
			</Dialog>
			<Dialog
				open={commentsEditWindow}
				onClose={handleCloseCommentsEditWindow}
				scroll={'paper'}
				aria-labelledby="scroll-dialog-title"
				aria-describedby="scroll-dialog-description"
			>
				<DialogTitle id="scroll-dialog-title">?????????? ??????????????????????</DialogTitle>
				<DialogContent dividers>
					<Textarea
					variant="plain"
					minRows={2}
					size="lg"
					placeholder="?????????????? ?????????????????????????"
					value={comments}
					onChange={changeComments}
					/>
				</DialogContent>
				<DialogActions>
					<div className="flex p-0">
						<IconButton
							size="large"
							edge="start"
							aria-label="cancel"
							sx={{
								alignSelf: 'center',
								color: 'black'
							}}
							onClick={handleCloseCommentsEditWindow}
						>
							<CancelIcon />
						</IconButton>
					</div>
					<div className="flex p-0 pl-2">
						<IconButton
							size="large"
							edge="start"
							aria-label="save"
							sx={{
								alignSelf: 'center',
								color: 'black'
							}}
							onClick={handleSaveComments}
						>
							<SaveIcon />
						</IconButton>
					</div>
				</DialogActions>
			</Dialog>
			<Dialog
				open={recordWindow}
				onClose={handleCloseRecordWindow}
				scroll={'paper'}
				aria-labelledby="scroll-dialog-title"
				aria-describedby="scroll-dialog-description"
				fullWidth={true}
        		maxWidth={'sm'}
			>
				<DialogTitle id="scroll-dialog-title">
					<div className="w-full text-center">
						??????????????????????
					</div>
				</DialogTitle>
				<DialogContent dividers>
					<div className="flex-col w-full justify-center items-center">
						<div className="flex w-full justify-center items-center pt-2">
							<AudioRecorder onRecordingComplete={addAudioElement} />
						</div>
						<div className="flex w-full pt-6 justify-center items-center pb-2">
							{audioPlayer}
						</div>
					</div>
				</DialogContent>
				<DialogActions>
					<div className="flex p-0">
						<IconButton
							size="large"
							edge="start"
							aria-label="cancel"
							sx={{
								alignSelf: 'center',
								color: 'black'
							}}
							onClick={handleCloseRecordWindow}
						>
							<CancelIcon />
						</IconButton>
					</div>
					<div className="flex p-0 pl-2">
						<IconButton
							size="large"
							edge="start"
							aria-label="save"
							sx={{
								alignSelf: 'center',
								color: 'black'
							}}
							onClick={handleSaveRecord}
						>
							<SaveIcon />
						</IconButton>
					</div>
				</DialogActions>
			</Dialog>
			<ModalMessage message={modalMessage} close={closeModalMessage} />
		</div> 
	)
}