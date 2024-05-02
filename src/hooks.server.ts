import { decrypt, encrypt } from '$lib/helpers/auth/auth'
import { redirect, type Handle } from '@sveltejs/kit'

export const handle: Handle = async ({ event, resolve }) => {
	let token: string = event.url.searchParams.get('token') || ''
	let apikey: undefined | string = event.url.searchParams.get('apikey') || ''
	const troctoken = event.url.searchParams.get('auth') || ''
	const next =
		event.url.searchParams.get('next') || event.cookies.get('_program') || event.cookies.get('next')

	if (token && event.url.pathname !== '/login/callback')
		throw redirect(302, `/login/callback?token=${token}&next=${next}`)

	if (!token && !apikey && !troctoken) {
		try {
			const haveCookieSession =
				event.cookies.get('_session1') ||
				event.cookies.get('_session2') ||
				event.cookies.get('_session3')
			const haveCookieApiKey = Boolean(event.cookies.get('_apikey'))
			if (!haveCookieApiKey && !haveCookieSession) {
				if (
					event.url.pathname !== '/login' &&
					event.url.pathname !== '/' &&
					event.url.pathname !== '/logout'
				)
					event.cookies.set('next', event.url.pathname.replace('/', ''))
				return await resolve(event)
			}
			if (haveCookieSession) {
				const decoded1 = decrypt(event.cookies.get('_session1'))
				const decoded2 = decrypt(event.cookies.get('_session2'))
				const decoded3 = decrypt(event.cookies.get('_session3'))
				if (!decoded1 || !decoded2 || !decoded3) return await resolve(event)
				token = decoded1 + decoded2 + decoded3
			} else if (haveCookieApiKey) {
				apikey = event.cookies.get('_apikey')
			}
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
			if (rawSession.status !== 401) {
				session = await rawSession.json()
				apikey = undefined
			}
		}
		if (!session && (troctoken || apikey)) {
			const rawSession = apikey
				? await fetch(`${import.meta.env.VITE_API_URL}/api/v1/login?apikey=${apikey}`, {
						method: 'GET',
						headers: {
							'Content-Type': 'application/json',
							'x-auth-method': 'APIKeyAuth'
						}
				  })
				: await fetch(`${import.meta.env.VITE_API_URL}/api/v1/login?auth=${troctoken}`, {
						method: 'GET',
						headers: {
							'Content-Type': 'application/json'
						}
				  })
			session = await rawSession.json()

			token = apikey ? apikey : session.token

			if (!apikey) {
				const length = Math.ceil(token.length / 3)
				const token1 = encrypt(token.substring(0, length))
				const token2 = encrypt(token.substring(length, 2 * length))
				const token3 = encrypt(token.substring(2 * length))

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
			} else {
				event.cookies.set('_apikey', apikey, {
					path: '/',
					httpOnly: true,
					secure: true, //import.meta.env.ENV === 'production',
					maxAge: 60 * 60 * 24 * 30
				})
			}
		}
		if (session) {
			event.locals.user = { ...session.session }
			event.locals.user.aux = { ...session }
			delete event.locals.user.aux.session
			event.locals.user.token = token
			event.locals.user.apikey = apikey ? true : false
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
