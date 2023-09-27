import { goto } from '$app/navigation'

export function validateUser(user) {
	if (!user) return false

	if (
		typeof user.created !== 'number' ||
		typeof user.expires_in !== 'string' ||
		typeof user.id !== 'string' ||
		typeof user.last_visit !== 'number' ||
		typeof user.last_visited !== 'string' ||
		!user.session ||
		typeof user.session.domain !== 'string' ||
		typeof user.session.email !== 'string' ||
		typeof user.session.enabled !== 'boolean' ||
		typeof user.session.first_name !== 'string' ||
		!Array.isArray(user.session.group_id) ||
		!Array.isArray(user.session.groups) ||
		typeof user.session.last_login !== 'string' ||
		typeof user.session.last_name !== 'string' ||
		!Array.isArray(user.session.programs) ||
		typeof user.session.superuser !== 'boolean' ||
		typeof user.session.user !== 'string' ||
		typeof user.session.user_id !== 'number' ||
		typeof user.session.username !== 'string' ||
		(user.session.title && typeof user.session.title !== 'string') ||
		typeof user.token !== 'string' ||
		typeof user.token_type !== 'string' ||
		typeof user.username !== 'string'
	) {
		return false
	}

	return true
}

export const handleAuthorization = async () => {
	const sessionEndpoint = 'https://api.dev.navigator.mobileinsight.com/api/v1/user/session'
	// TODO | DONE obtener tipo de token segun respuesta de sesion
	const token = sessionStorage.getItem('token') || localStorage.getItem('token')

	if (token) {
		try {
			const rawSession = await fetch(sessionEndpoint, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				}
			})
			const session = await rawSession.json()
			console.log(session)
			return session
		} catch (error) {
			sessionStorage.clear()
			goto('/login')
		}
	}
	if (!token) {
		await goto('/login')
		sessionStorage.clear()
	}
}

export function handleLogout() {
	const token = sessionStorage.getItem('token')
	// const rawSession = sessionStorage.getItem('session')
	// const session = JSON.parse(rawSession)

	const endpoint = 'https://api.dev.navigator.mobileinsight.com/api/v1/logout'

	try {
		// const { token_type: tokenType } = session
		fetch(endpoint, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `$Bearer ${token}`
			}
		})
	} catch (error) {
		console.log('Error loging out')
	}

	sessionStorage.clear()
	goto('/login')
}

export function copyToken() {
	const token = sessionStorage.getItem('token')
	if (!token) return

	localStorage.setItem('token', token)

	setTimeout(function () {
		localStorage.removeItem('token')
	}, 3000)
}

export function pasteToken() {
	// const token = localStorage.getItem('token')
	// if (!token) return
	//
	// sessionStorage.setItem('token', token)
	//
	// localStorage.removeItem('token')
}

export function handleCloseWindow(e) {
	console.log(e)
	console.log('before unload executed')
}

export function checkLocalStorageForTokenAndCopy() {
	setInterval(function () {
		const token = localStorage.getItem('token')
		if (token) {
			sessionStorage.setItem('token', token)
			localStorage.removeItem('token')
			return
		}
	}, 200)
}
