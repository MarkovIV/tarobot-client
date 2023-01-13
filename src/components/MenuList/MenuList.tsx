import { MenuListProps } from './MenuList.props'
import Drawer from '@mui/material/Drawer'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import { useAppSelector, useAppDispatch } from '../../store/hooks'
import { toggleMenuTo } from '../../store/menuSlice'
import { pageData } from '../../data/data.page'
import { toggleSlideTo } from '../../store/slideSlice'

export const MenuList = ({ className, ...props }: MenuListProps): JSX.Element => {
	const state = useAppSelector(state => state.menu.open)
	const dispatch = useAppDispatch()

	return (
		<div>
			<Drawer
				anchor='right'
				open={state}
				onClose={() => dispatch(toggleMenuTo(false))}
				PaperProps={{
					sx: {
							backgroundColor: "#c5cae9",
							opacity: "95%"
						}
				}}
			>
				{
					pageData.map(slide => 
						<ListItem key={slide.item} disablePadding>
							<ListItemButton
								onClick={() => {
										dispatch(toggleMenuTo(false))
										dispatch(toggleSlideTo(slide.item))
									}
								}
							>
								<ListItemText
									primary={slide.menuTitle}
									sx={{
										color: "#fafafa"
									}}
								/>
							</ListItemButton>
						</ListItem>
					)
				}
			</Drawer>	
		</div>
	)
}