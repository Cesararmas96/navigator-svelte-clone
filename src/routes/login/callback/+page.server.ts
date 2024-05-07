import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { encrypt } from '$lib/helpers/auth/auth'

// export const ssr = false

export const load: PageServerLoad = async ({ locals, cookies }) => {
	const length = Math.ceil(locals.user.token.length / 3)
	const token1 = encrypt(locals.user.token.substring(0, length))
	const token2 = encrypt(locals.user.token.substring(length, 2 * length))
	const token3 = encrypt(locals.user.token.substring(2 * length))

	cookies.set('_session1', token1, {
		path: '/',
		httpOnly: true,
		sameSite: 'none',
		secure: true, //import.meta.env.ENV === 'production',
		maxAge: 60 * 60 * 24 * 30
	})
	cookies.set('_session2', token2, {
		path: '/',
		httpOnly: true,
		sameSite: 'none',
		secure: true, //import.meta.env.ENV === 'production',
		maxAge: 60 * 60 * 24 * 30
	})
	cookies.set('_session3', token3, {
		path: '/',
		httpOnly: true,
		sameSite: 'none',
		secure: true, //import.meta.env.ENV === 'production',
		maxAge: 60 * 60 * 24 * 30
	})

	if (locals.user?.next) {
		cookies.set('_program', locals.user.next, {
			path: '/',
			httpOnly: true,
			sameSite: 'none',
			secure: true, //import.meta.env.ENV === 'production',
			maxAge: 60 * 60
		})
		const url = `/${locals.user.next}${locals.user.apikey ? '?apikey=' + locals.user.token : ''}`
		throw redirect(302, url)
	}
	throw redirect(302, '/')
}
