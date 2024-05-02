import { redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ cookies }) => {
	cookies.delete('_session1')
	cookies.delete('_session2')
	cookies.delete('_session3')
	cookies.delete('_apikey')
	cookies.delete('_program')

	throw redirect(302, '/login')
}

export const actions: Actions = {
	default({ cookies }) {
		cookies.delete('_session1')
		cookies.delete('_session2')
		cookies.delete('_session3')
		cookies.delete('_apikey')
		cookies.delete('_program')

		throw redirect(302, '/login')
	}
}
