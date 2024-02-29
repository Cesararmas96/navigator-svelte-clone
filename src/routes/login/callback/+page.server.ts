import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

// export const ssr = false

export const load: PageServerLoad = async ({ locals, cookies }) => {
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
