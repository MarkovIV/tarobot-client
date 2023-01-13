/**
 * Данные по файлу, приложенному к карте дня, необходимые для отображения в интерфейсе
 * @param {string} name - Имя файла
 * @param {string | undefined} link - Ссылка для открытия файла
 */
export interface IFileData {
	name: string
	link: string | undefined
}

export interface IDayCard {
	id: string
	title: string
	description: string
	date: string
	audio: IFileData
	photo: IFileData
	file: IFileData[]
	adminComments: string
	comments: IComment[]
	newComments: boolean
	daycardSent: boolean
}

export interface IComment {
	role: string
	time: string
	text: string
}

export interface IDayCardTable {
	firstName: string
	lastName: string
	newComments: string
	daycardSent: string
	adminComments: string
	id: string
}