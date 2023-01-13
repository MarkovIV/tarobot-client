import { LoaderProps } from './Loader.props'
import CircularProgress from '@mui/material/CircularProgress'

export const Loader = ({ className, ...props }: LoaderProps): JSX.Element => {

	return (
		<div className="absolute left-0 top-0 flex flex-col items-center justify-center flex-nowrap w-full h-full min-w-[350px] min-h-[350px]">
			<div className="h-1/6 w-full"></div>
			<div className="h-4/6 w-full md:w-3/4 lg:w-4/12 flex items-center justify-center flex-col pl-3 pr-3">
				<CircularProgress
					size={100}
					sx={{ color: '#e0e0e0'}}
				/>
			</div>
			<div className="h-1/6 w-full"></div>
		</div>
	)
}