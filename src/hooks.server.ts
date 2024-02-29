import { decrypt, encrypt } from '$lib/helpers/auth/auth'
import type { Handle } from '@sveltejs/kit'

export const handle: Handle = async ({ event, resolve }) => {
	let token = event.url.searchParams.get('token') || ''
	const troctoken = event.url.searchParams.get('troctoken') || ''
	const next =
		event.url.searchParams.get('next') || event.cookies.get('_program') || event.cookies.get('next')

	if (!token && !troctoken) {
		try {
			if (!event.cookies.get('_session1') || !event.cookies.get('_session2')) {
				if (
					event.url.pathname !== '/login' &&
					event.url.pathname !== '/' &&
					event.url.pathname !== '/logout'
				)
					event.cookies.set('next', event.url.pathname.replace('/', ''))
				return await resolve(event)
			}
			const decoded1 = decrypt(event.cookies.get('_session1'))
			const decoded2 = decrypt(event.cookies.get('_session2'))
			if (!decoded1 || !decoded2) return await resolve(event)
			token = decoded1 + decoded2
		} catch (error) {
			return await resolve(event)
		}
	}

	try {
		let session
		if (token) {
			const rawSession = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/user/session`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				}
			})
			session = await rawSession.json()
			const half = Math.ceil(token.length / 2)
			const token1 = encrypt(token.slice(0, half))
			const token2 = encrypt(token.slice(half))

			event.cookies.set('_session1', token1, {
				path: '/',
				httpOnly: true,
				secure: true, //import.meta.env.ENV === 'production',
				maxAge: 60 * 60 * 24 * 30
			})
			event.cookies.set('_session2', token2, {
				path: '/',
				httpOnly: true,
				secure: true, //import.meta.env.ENV === 'production',
				maxAge: 60 * 60 * 24 * 30
			})
		} else if (troctoken) {
			const rawSession = await fetch(
				`${import.meta.env.VITE_API_URL}/api/v1/login?auth=${troctoken}`,
				{
					method: 'GET',
					headers: {
						'Content-Type': 'application/json'
					}
				}
			)
			session = await rawSession.json()
			const half = Math.ceil(session.token.length / 2)
			const token1 = encrypt(session.token.slice(0, half))
			const token2 = encrypt(session.token.slice(half))

			event.cookies.set('_session1', token1, {
				path: '/',
				httpOnly: true,
				secure: true, //import.meta.env.ENV === 'production',
				maxAge: 60 * 60 * 24 * 30
			})
			event.cookies.set('_session2', token2, {
				path: '/',
				httpOnly: true,
				secure: true, //import.meta.env.ENV === 'production',
				maxAge: 60 * 60 * 24 * 30
			})
		}
		if (session) {
			event.locals.user = { ...session.session }
			event.locals.user.aux = { ...session }
			delete event.locals.user.aux.session
			event.locals.user.token = token || session.token
			if (next) {
				event.locals.user.next = next
				event.cookies.delete('next')
			}
		}
	} catch (error) {
		console.log('hooks', error)
		return await resolve(event)
	}
	return await resolve(event)
}
