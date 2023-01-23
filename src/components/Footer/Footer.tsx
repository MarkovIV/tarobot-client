import { FooterProps } from './Footer.props'
import Typography from '@mui/material/Typography'
import CopyrightIcon from '@mui/icons-material/Copyright'
import { useAppSelector } from '../../store/hooks'

export const Footer = ({ className, ...props }: FooterProps): JSX.Element => {
	const footer = useAppSelector(state => state.footer.footer)

	return (
		<div>
			{	footer &&

				<div className="fixed z-20 bottom-5 left-3 flex flex-nowrap h-10 min-w-max bg-inherit w-full text-gray-300">
					<div className="mr-1">
						<CopyrightIcon />
					</div>
					<Typography variant="subtitle1" gutterBottom>
					Маркова Евгения
					</Typography>		
				</div>
			}
		</div>
	)			
}