import { decrypt } from '$lib/helpers/auth/auth'
import type { Handle } from '@sveltejs/kit'

export const handle: Handle = async ({ event, resolve }) => {
	let token = event.url.searchParams.get('token') || ''
	const next = event.url.searchParams.get('next') || event.cookies.get('_program')
	console.log('TOKEN', token)
	if (!token) {
		console.log('NOT TOKEN')
		try {
			console.log('NOT TOKEN', event.cookies.get('_session1'), event.cookies.get('_session2'))
			if (!event.cookies.get('_session1') || !event.cookies.get('_session2'))
				return await resolve(event)
			const decoded1 = decrypt(event.cookies.get('_session1'))
			console.log('NOT TOKEN 1', decoded1)
			const decoded2 = decrypt(event.cookies.get('_session2'))
			console.log('NOT TOKEN 2', decoded2)
			if (!decoded1 || !decoded2) return await resolve(event)
			console.log('decoded1', decoded1)
			console.log('decoded2', decoded2)
			token = decoded1 + decoded2
		} catch (error) {
			return await resolve(event)
		}
	}

	try {
		const rawSession = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/user/session`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			}
		})
		const session = await rawSession.json()

		if (session) {
			event.locals.user = session.session
			event.locals.user.aux = session
			delete event.locals.user.aux.session
			event.locals.user.token = token
			if (next) event.locals.user.next = next
		}
	} catch (error) {
		console.log('hooks', error)
		return await resolve(event)
	}
	return await resolve(event)
}
