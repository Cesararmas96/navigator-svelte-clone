import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user || !locals.user.token) throw redirect(302, '/login')
	console.log('page', locals.user.next)
	if (locals.user.next) {
		console.log('ENTRO', locals.user.next)
		const url = `/${locals.user.next}${locals.user.apikey ? '?apikey=' + locals.user.token : ''}`
		throw redirect(302, url)
	}
	if (import.meta.env.VITE_ADMIN) throw redirect(302, '/admin')
}
