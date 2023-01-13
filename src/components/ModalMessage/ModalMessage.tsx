import { ModalMessageProps } from './ModalMessage.props'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

export const ModalMessage = ({ message, close, className, ...props }: ModalMessageProps): JSX.Element => {

	return (
		<div>
			<Modal
				open={message !== ''}
				onClose={close}
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
						{message}
					</Typography>
					<div className="pt-2 flex w-full justify-end items-center">
						<IconButton
							size="large"
							edge="start"
							color="inherit"
							aria-label="save"
							sx={{
								alignSelf: 'center',
							}}
							onClick={close}
						>
							<CheckCircleIcon />
						</IconButton>							
					</div>
				</Box>
			</Modal>
		</div>
	)
}