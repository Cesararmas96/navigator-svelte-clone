import { getApiData } from '$lib/services/getData'
import { redirect } from '@sveltejs/kit'

export const load = async ({ locals, fetch, url }) => {
	if (!locals.user) throw redirect(302, '/')
	if (import.meta.env.VITE_ADMIN) throw redirect(302, '/admin')
	const headers = { authorization: `Bearer ${locals.user.token}` }

	const tenant = url.hostname.split('.')[0]
	const programs = await getApiData(
		`${import.meta.env.VITE_API_URL}/api/v1/programs_user`,
		'GET',
		{},
		{},
		{ headers },
		fetch,
		false
	)

	if (programs.length === 1) throw redirect(302, `/${programs[0].program_slug}`)

	const programType = await getApiData(`program_type`, 'POST', {}, {}, { headers }, fetch)

	return { programs, programType, user: locals.user, tenant }
}
