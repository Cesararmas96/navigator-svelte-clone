import { decrypt } from '$lib/helpers/auth/auth'
import type { Handle } from '@sveltejs/kit'

export const handle: Handle = async ({ event, resolve }) => {
	if (event.url.pathname.startsWith('/js') || event.url.pathname.startsWith('/_app/fonts'))
		return await resolve(event)
	let token = event.url.searchParams.get('token') || ''
	const next = event.url.searchParams.get('next') || event.cookies.get('_program')
	console.log('HOOKS URL', event.url)
	if (!token) {
		try {
			if (!event.cookies.get('_session1') || !event.cookies.get('_session2'))
				return await resolve(event)
			const decoded1 = decrypt(event.cookies.get('_session1'))
			const decoded2 = decrypt(event.cookies.get('_session2'))
			if (!decoded1 || !decoded2) return await resolve(event)
			token = decoded1 + decoded2
			console.log('HOOKS TOKEN', token)
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
		console.log('HOOKS SESSIOM', session)

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
	console.log('HOOKS PASO')
	return await resolve(event)
}
