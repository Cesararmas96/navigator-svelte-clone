import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user || !locals.user.token) throw redirect(302, '/login')
	if (import.meta.env.VITE_ADMIN) throw redirect(302, '/admin')
}
