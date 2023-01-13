import { DetailedHTMLProps, HTMLAttributes } from 'react'

export interface ClientEditProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>{
	onClose: () => void
	clientId?: string
}