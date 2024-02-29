import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { encrypt } from '$lib/helpers/auth/auth'

// export const ssr = false

export const load: PageServerLoad = async ({ locals, cookies }) => {
	const half = Math.ceil(locals.user.token.length / 2)
	const token1 = encrypt(locals.user.token.slice(0, half))
	const token2 = encrypt(locals.user.token.slice(half))

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

	if (locals.user?.next) {
		cookies.set('_program', locals.user.next, {
			path: '/',
			httpOnly: true,
			sameSite: 'none',
			secure: true, //import.meta.env.ENV === 'production',
			maxAge: 60 * 60
		})
		throw redirect(302, `/${locals.user.next}`)
	}
	throw redirect(302, '/')
}
