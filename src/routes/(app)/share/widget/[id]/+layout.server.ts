import { getApiData } from '$lib/services/getData'

export const load = async ({ params, url, locals, fetch }) => {
	const urlBase = import.meta.env.VITE_API_URL
	try {
		const token = url.searchParams.get('token') || locals.user?.token
		const headers = token
			? !locals.user?.apikey
				? { authorization: `Bearer ${token}` }
				: { 'x-api-key': token }
			: {}
		const widget = await getApiData(
			`${urlBase}/api/v2/widgets/${params.id}`,
			'GET',
			{},
			{},
			{ headers },
			fetch
		)
		return { widget, user: locals.user }
	} catch (error) {
		throw new Error(`Request error: ${error}`)
	}
}
