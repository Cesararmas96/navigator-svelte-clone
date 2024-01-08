import { getApiData } from '$lib/services/getData'
import { redirect } from '@sveltejs/kit'

export const load = async ({ locals, fetch, url }) => {
	if (!locals.user) throw redirect(302, '/')
	if (import.meta.env.VITE_ADMIN) throw redirect(302, '/admin')
	console.log('locals.user', locals.user)

	const headers = { authorization: `Bearer ${locals.user.token}` }

	const programs = await getApiData(
		`programs`,
		'POST',
		{
			where_cond: {
				program_slug: locals.user.programs,
				is_active: true
			}
		},
		{},
		{ headers },
		fetch
	)

	const programType = await getApiData(`program_type`, 'POST', {}, {}, { headers }, fetch)

	if (programs.length === 1) throw redirect(302, `/${programs[0].program_slug}`)
	if (locals.user.next) throw redirect(302, `/${locals.user.next}`)

	const tenant = url.hostname.split('.')[0]

	return { programs, programType, user: locals.user, tenant }
}
