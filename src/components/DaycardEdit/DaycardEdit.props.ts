import { DetailedHTMLProps, HTMLAttributes } from 'react'
import { Dayjs } from 'dayjs'

export interface DaycardEditProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>{
	onClose: () => void
	clientId: string
	date: Dayjs | null
	view: boolean
}