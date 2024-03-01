import { redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ cookies }) => {
	throw redirect(302, '/')
}

export const actions: Actions = {
	default({ cookies }) {
		console.log('logout')
		cookies.set('_session1', '', {
			path: '/',
			expires: new Date(0)
		})
		cookies.set('_session2', '', {
			path: '/',
			expires: new Date(0)
		})
		cookies.set('_session3', '', {
			path: '/',
			expires: new Date(0)
		})
		cookies.set('_program', '', {
			path: '/',
			expires: new Date(0)
		})

		throw redirect(302, '/login')
	}
}
