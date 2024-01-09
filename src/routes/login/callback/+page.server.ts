import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { encrypt } from '$lib/helpers/auth/auth'

export const load: PageServerLoad = async ({ locals, cookies }) => {
	const token = encrypt(locals.user.token)

	cookies.set('_session', token, {
		path: '/',
		httpOnly: true,
		sameSite: 'strict',
		secure: true, //import.meta.env.ENV === 'production',
		maxAge: 60 * 60 * 24 * 30
	})

	cookies.set('_program', locals.user.next, {
		path: '/',
		httpOnly: true,
		sameSite: 'strict',
		secure: true, //import.meta.env.ENV === 'production',
		maxAge: 60 * 60 * 24 * 30
	})
	if (locals.user.next) throw redirect(302, `/${locals.user.next}`)
}
