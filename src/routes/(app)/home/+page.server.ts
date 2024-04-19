import { getApiData } from '$lib/services/getData'
import { redirect } from '@sveltejs/kit'

export const load = async ({ locals, fetch, url }) => {
	if (!locals.user || !locals.user?.token) throw redirect(302, '/login')
	if (import.meta.env.VITE_ADMIN) throw redirect(302, '/admin')

	// const apikey = locals.user?.apikey && locals.user?.token ? `&apikey=${locals.user?.token}` : ''
	// const headers =
	// 	!locals.user?.apikey && locals.user?.token
	// 		? { authorization: `Bearer ${locals.user?.token}` }
	// 		: {}

	const headers = !locals.user?.apikey
		? { authorization: `Bearer ${locals.user?.token}` }
		: { 'x-api-key': locals.user?.token }

	const tenant = url.hostname.split('.')[0]

	if (!locals.client || locals.client?.client_slug !== tenant) {
		const resp = await getApiData(
			`${import.meta.env.VITE_API_URL}/api/v1/clients?subdomain_prefix=${tenant}`,
			'GET'
		)
		locals.client = resp[0]
	}

	const programs = await getApiData(
		`${import.meta.env.VITE_API_URL}/api/v1/programs_user?client_slug=${locals.client.client_slug}`,
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
