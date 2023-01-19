import { TelegramProps } from './Telegram.props'
import Typography from '@mui/material/Typography'
import { useTelegram } from '../../hooks/useTelegram'
import { useEffect, useRef, useState } from 'react'
import dayjs from 'dayjs'
import AudioPlayer from 'react-h5-audio-player'
import 'react-h5-audio-player/lib/styles.css'
import DescriptionIcon from '@mui/icons-material/Description'
import IconButton from '@mui/material/IconButton'
import Badge from '@mui/material/Badge'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import OpenInFullSharpIcon from '@mui/icons-material/OpenInFullSharp'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import Zoom from '@mui/material/Zoom'
import ChatIcon from '@mui/icons-material/Chat'
import CheckIcon from '@mui/icons-material/Check'
import { Navigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { IComment, IDayCard, IFileData } from '../../interfaces/daycard.interface'
import Modal from '@mui/material/Modal'
import styles from './Telegram.module.css'

export const Telegram = ({ className, ...props }: TelegramProps): JSX.Element => {
	const [daycard, setDayCard] = useState<IDayCard>()
	const [photoWidth, setPhotoWidth] = useState<number>()
	const [photoHeight, setPhotoHeight] = useState<number>()
	const [photoWindow, setPhotoWindow] = useState<boolean>(false)
	const [expanded, setExpanded] = useState<string | false>(false)
	const photoRef = useRef(null)
	const {onClose, tg} = useTelegram()
	const params = useParams()
	const daycardLink = params.daycardLink

	useEffect(() => {
		async function fetchData() {
			if (daycardLink) {
				const res = await axios.get(daycardLink)
				if (res) {
					setDayCard(res.data)
				}
			}
		}
		fetchData()

		tg.MainButton.hide()
		tg.MainButton.disable()
		tg.MainButton.hideProgress()
		tg.expand()
		tg.ready()
	}, [daycardLink, tg])

	const handleOpenPhotoWindow = () => setPhotoWindow(true)

	const handleClosePhotoWindow = () => setPhotoWindow(false)

	const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    	setExpanded(isExpanded ? panel : false)
    }

	const updatePhotoSizes = () => {
		const photo = photoRef.current as HTMLElement | null
		if (photo) {
			photo.style.width = `${photoWidth}px`
			photo.style.height = `${photoHeight}px`
		}
	}

	const getClientDayCardPhoto = () => {
		let photo = ""

		if (daycard) {
			if (daycard.photo) {
				if (daycard.photo.link) {
					photo = daycard.photo.link
				} 
			}
		} 
		return photo
	}

	const setClientDayCardPhotoSizes = () => {
		if (daycard) {
			if (daycard.photo) {
				if (daycard.photo.link) {
					const img = new Image()
					img.src = daycard.photo.link
					setPhotoWidth(Number(img.width))
					setPhotoHeight(Number(img.height))						
				}
			}
		}
	}

	const getClientDayCardAudio = () => {
		let audio = ""

		if (daycard) {
			if (daycard.audio) {
				if (daycard.audio.link) {
					audio = daycard.audio.link
				}
			}
		}
		return audio
	}

	const getClientDayCardDescription = () => {
		let description = ""

		if (daycard) {
			if (daycard.description) {
				description = daycard.description	
			}
		}
		return description
	}

	const getClientDayCardFiles = () => {
		let filesArray: IFileData[] = []

		if (daycard) {
			const daycardFile = daycard.file
			if (daycardFile) {
				for (let key in daycardFile) {
					filesArray.push(daycardFile[key])
				}
			}
		}
		return filesArray
	}

	const getClientDayCardComments = () => {
		let comments: IComment[] = []

		if (daycard) {
			const daycardComments = daycard.comments
			if (daycardComments) {
				for (let key in daycardComments) {
					comments.push(daycardComments[key])
				}
			}
		}
		return comments
	}

	return (
		<div className="bg-black">
			{
				(tg.platform !== 'unknown') &&

				<div className="">

					<div className="flex justify-start items-start w-full h-full min-w-[350px] min-h-[350px]">
					{	daycard &&
						<div>
							<div className="flex w-full justify-center items-center">
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
							<div className="pt-8 pl-2 pr-2 opacity-80 overflow-auto">
										<div className="relative flex justify-center items-center pb-4 w-full h-[300px]">
											<div className="relative flex w-full h-full rounded-md border-2 border-inherit">
												<div className="absolute left-0 top-0 flex justify-start items-start w-full h-full">	
													<img
														className="object-cover w-full h-full"
														src={getClientDayCardPhoto()}
														alt="Card"
														onLoad={() => setClientDayCardPhotoSizes()}
													/>
												</div>
												<div className="absolute flex w-full bottom-0">
													<AudioPlayer
														autoPlay = {false}
														src={getClientDayCardAudio()}
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
										</div>
										<Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
											<AccordionSummary
											expandIcon={<ExpandMoreIcon />}
											aria-controls="panel1bh-content"
											id="panel1bh-header"
											>
											<Typography sx={{ width: '33%', flexShrink: 0, textAlign: 'center' }}>
												{
													getClientDayCardDescription()?
														<Badge badgeContent={1} color="success">
															<DescriptionIcon />
														</Badge>
														:
														<DescriptionIcon />
												}
											</Typography>
											<Typography sx={{ color: 'text.secondary' }}>Описание</Typography>
											</AccordionSummary>
											<AccordionDetails>
												<div className="overflow-auto">
													<Typography>
														{getClientDayCardDescription()}
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
													(getClientDayCardFiles().length > 0)?
														<Badge badgeContent={getClientDayCardFiles().length} color="success">
															<AttachFileIcon />
														</Badge>
														:
														<AttachFileIcon />
												}
											</Typography>
											<Typography sx={{ color: 'text.secondary' }}>
												Приложения
											</Typography>
											</AccordionSummary>
											<AccordionDetails>
												<div className="overflow-auto">
													{getClientDayCardFiles().map(el => <div key={el.name}><a href={el.link} target="_blank" rel="noreferrer" className="underline hover:decoration-2">{el.name}</a></div>)}
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
													(getClientDayCardComments().length > 0)?
														<Badge badgeContent={getClientDayCardComments().length} color="success">
															<ChatIcon />
														</Badge>
														:
														<ChatIcon />
												}	
											</Typography>
											<Typography sx={{ color: 'text.secondary' }}>
												Комментарии
											</Typography>
											</AccordionSummary>
											<AccordionDetails>
												<div className="overflow-auto">
													{getClientDayCardComments().map(el => <div key={el.time}>
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
												<div className="flex justify-start items-start w-full h-full overflow-auto">
													<img
														ref={photoRef}
														className="object-none object-left-top max-w-none"
														src={getClientDayCardPhoto()}
														alt="Card"
														onLoad={updatePhotoSizes}
													/>
													<div className="absolute right-0 bottom-0 pr-2 pb-2">
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
									</div> 
						</div>
					}
					</div>
				</div>
			}
			{
				(tg.platform === 'unknown') &&

				<Navigate to={"/"} />
			}
		</div>
	)
}