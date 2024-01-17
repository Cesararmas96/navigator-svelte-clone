import { getApiData } from '$lib/services/getData'
import { redirect } from '@sveltejs/kit'

// export const ssr = false;

export const load = async ({ params, fetch, locals, url }) => {
	if (!locals.user) throw redirect(302, '/login')

	const urlBase = import.meta.env.VITE_API_URL

	const token = url.searchParams.get('token') || locals.user?.token
	const headers = token ? { authorization: `Bearer ${token}` } : {}

	const dashboard = await getApiData(
		`${urlBase}/api/v2/dashboards/${params.id}`,
		'GET',
		{},
		{},
		{ headers },
		fetch
	)

	return { dashboard, user: locals.user }
}
