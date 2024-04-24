import { decrypt, encrypt } from '$lib/helpers/auth/auth'
import { redirect, type Handle } from '@sveltejs/kit'

export const handle: Handle = async ({ event, resolve }) => {
	let token = event.url.searchParams.get('token') || ''
	const troctoken = event.url.searchParams.get('troctoken') || ''
	const next =
		event.url.searchParams.get('next') || event.cookies.get('_program') || event.cookies.get('next')

	if (token && event.url.pathname !== '/login/callback')
		throw redirect(302, `/login/callback?token=${token}&next=${next}`)

	if (!token && !troctoken) {
		try {
			if (
				!event.cookies.get('_session1') ||
				!event.cookies.get('_session2') ||
				!event.cookies.get('_session3')
			) {
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
			const decoded3 = decrypt(event.cookies.get('_session3'))
			if (!decoded1 || !decoded2 || !decoded3) return await resolve(event)
			token = decoded1 + decoded2 + decoded3
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
			if (rawSession.status !== 401) session = await rawSession.json()
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
			token = session.token
			const length = Math.ceil(session.token.length / 3)
			const token1 = encrypt(session.token.substring(0, length))
			const token2 = encrypt(session.token.substring(length, 2 * length))
			const token3 = encrypt(session.token.substring(2 * length))

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
			event.cookies.set('_session3', token3, {
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
			event.locals.user.token = token
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
