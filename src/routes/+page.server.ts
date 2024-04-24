import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user || !locals.user.token) throw redirect(302, '/login')
	if (locals.user.next) throw redirect(302, `/${locals.user.next}`)
	if (import.meta.env.VITE_ADMIN) throw redirect(302, '/admin')
}
