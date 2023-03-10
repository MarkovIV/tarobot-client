const tg: any = window.Telegram.WebApp

export const useTelegram = () => {
	const onClose = (): void => {
		tg.close()
	}

	const onToggleButton = () => {
		if (tg.MainButton.isVisible) {
			tg.MainButton.hide()
		} else {
			tg.MainButton.show()
		}
	}

	return {
		onClose,
		tg,
		queryId: tg.initDataUnsafe?.query_id,
		user: tg.initDataUnsafe?.user,
		onToggleButton
	}
}