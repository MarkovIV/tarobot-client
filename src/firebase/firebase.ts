import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/database'
import { getDownloadURL, getStorage, listAll, ref, uploadBytes, deleteObject, StorageReference } from "firebase/storage"
import { sortFileNames } from '../helpers/helpers'
import { IFileData } from '../interfaces/daycard.interface'
import { IClient } from '../interfaces/client.interface'
import dayjs, { Dayjs } from 'dayjs'

/**
 * Параметры проекта в Firebase
 */
const firebaseConfig = {
	apiKey: process.env.REACT_APP_APIKEY,
	authDomain: process.env.REACT_APP_AUTHDOMAIN,
	databaseURL: process.env.REACT_APP_DB,
	projectId: process.env.REACT_APP_PID,
	storageBucket: process.env.REACT_APP_SB,
	messagingSenderId: process.env.REACT_APP_SID,
	appId: process.env.REACT_APP_APPID
}

/**
 * Инициализируем приложение в Firebase и базу данных Realtime Database Firebase
 */
const app = firebase.initializeApp(firebaseConfig)
export const authUser = firebase.auth()
const databaseRef = firebase.database().ref()

/**
 * Определяем ссылки на хранилище Storage Firebase и
 * базу данных Realtime Database Firebase
 */
export const storage = getStorage(app)
export const daycardsRef = databaseRef.child('clients')

/**
 * Функция возвращает массив объектов, содержащих имена и ссылки для файлов, прикрепленных
 * к заданному пути
 * @param {string} path - Идентификатор карты дня
 * @returns {IFileData[]} - Массив объектов с именами и ссылками для файлов
 */
export const updateDayCardFiles = async (path: string) => {
	const filesListRef = ref(storage, path)
	
	let filesData: IFileData[] = []

	const response = await listAll(filesListRef)
				
	response.items.forEach( async file => {
		const url = await getDownloadURL(file)
		
		filesData.push({name: file.name, link: url})
	})

	filesData.sort((fileData1, fileData2) => sortFileNames(fileData1.name, fileData2.name))

	return filesData
}

/**
 * Функция сохраняет в хранилище Storage Firebase файлы из указанного массива,
 * прикрепляя файлы к папке, созданной для заданного пути. Функция возвращает
 * массив объектов, содержащих имена и ссылки для файлов, прикрепленных
 * к заданному пути
 * @param {string} path - Путь
 * @param {File[]} filesArray - Массив файлов
 * @returns {IFileData[]} - Массив объектов с именами и ссылками для файлов
 */
export const uploadFile = async (path: string, filesArray: File[]) => {		
	let filesData: IFileData[] = []

	for (let i = 0; i < filesArray.length; i++) {
		const fileRef = ref(storage, `${path}/${filesArray[i].name}`)
		
		try {
			await uploadBytes(fileRef, filesArray[i])

			const url = await getDownloadURL(fileRef)

			filesData.push({name: filesArray[i].name, link: url})
		} catch (e) {
			console.log(e)
		}
	}	
	return filesData
}

export const uploadBlobAudio = async (path: string, blob: any) => {		
	let fileData: IFileData | undefined

	const fileRef = ref(storage, `${path}/audio.wav`)
	
	try {
		await uploadBytes(fileRef, blob)

		const url = await getDownloadURL(fileRef)

		fileData = {
			name: 'audio.mp3',
			link: url
		}
	} catch (e) {
		console.log(e)
	}	
	return fileData
}

export const deleteFilesFromStorage = (fileReference: StorageReference): Promise<void> => {
	return listAll(fileReference)
		.then(res => {
			res.items.forEach(itemRef => {
				deleteObject(itemRef)
			})
		}) 
}

export const getClientDayCardKey = (clients: IClient[], clientId: string, date: Dayjs | null): string | null => {
		let id = null

		if (date === null ) {
			return id
		}

		const daycards = clients.filter(el => el.id === clientId)[0].daycards
		if (daycards !== undefined) {
			for (let key in daycards) {
				if (daycards[key].date === dayjs(date).format('DD.MM.YYYY')) {
					id = key
					return id
				}
			}
		}
		return id
}

