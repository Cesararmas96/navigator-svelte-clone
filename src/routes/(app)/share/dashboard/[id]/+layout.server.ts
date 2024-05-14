/* eslint-disable @typescript-eslint/no-explicit-any */
import { getApiData } from '$lib/services/getData'
import { error, redirect } from '@sveltejs/kit'

// export const ssr = false;

export const load = async ({ params, fetch, locals, url }) => {
	if (!locals.user || !locals.user.token) throw redirect(302, '/login')

	const urlBase = import.meta.env.VITE_API_URL

	const headers = locals.user?.token
		? !locals.user?.apikey
			? { authorization: `Bearer ${locals.user?.token}` }
			: { 'x-api-key': locals.user?.token }
		: {}

	try {
		const dashboard = await getApiData(
			`${urlBase}/api/v2/dashboards/${params.id}`,
			'GET',
			{},
			{},
			{ headers },
			fetch
		)
		return { dashboard, user: locals.user }
	} catch (err: any) {
		const origin = `<div class="origin-error hidden mt-2">Origin URL:<br>${url.origin}`
		if (url.origin.includes('teams')) throw redirect(302, 'error/403')
		throw error(err.status, err.body.message + origin)
	}
}
