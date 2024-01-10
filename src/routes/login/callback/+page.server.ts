import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { encrypt } from '$lib/helpers/auth/auth'

// export const ssr = false

export const load: PageServerLoad = async ({ locals, cookies }) => {
	const half = Math.ceil(locals.user.token.length / 2)
	const token1 = encrypt(locals.user.token.slice(0, half))
	const token2 = encrypt(locals.user.token.slice(half))
	console.log('BEFORE COOKIE 1')
	cookies.set('_session1', token1, {
		path: '/',
		httpOnly: true,
		sameSite: 'none',
		secure: true, //import.meta.env.ENV === 'production',
		maxAge: 60 * 60 * 24 * 30
	})
	console.log('COOKIE 1', token1)
	console.log('BEFORE COOKIE 2')
	cookies.set('_session2', token2, {
		path: '/',
		httpOnly: true,
		sameSite: 'none',
		secure: true, //import.meta.env.ENV === 'production',
		maxAge: 60 * 60 * 24 * 30
	})
	console.log('COOKIE 2', token2)
	console.log('BEFORE PROGRAM')
	cookies.set('_program', locals.user.next, {
		path: '/',
		httpOnly: true,
		sameSite: 'none',
		secure: true, //import.meta.env.ENV === 'production',
		maxAge: 60 * 60
	})
	console.log('PROGRAM', locals.user.next)
	if (locals.user.next) throw redirect(302, `/${locals.user.next}`)
}
