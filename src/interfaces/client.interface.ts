import { IDayCard } from './daycard.interface'

export interface IClient {
	id: string
	telegram: string
	firstName: string
	lastName: string
	greating: string
	dateFrom: string
	dateTo: string
	description: string
	daycards: IDayCard[]
	deliverTheCard: boolean
	deliverComments: boolean
}

export interface IClientTable {
	firstName: string
	lastName: string
	dateFrom: string
	dateTo: string
	telegram: string
	id: string
}