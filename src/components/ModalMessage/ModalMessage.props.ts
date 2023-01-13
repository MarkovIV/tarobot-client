import { DetailedHTMLProps, HTMLAttributes } from 'react'

export interface ModalMessageProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>{
	message: string
	close: () => void
}