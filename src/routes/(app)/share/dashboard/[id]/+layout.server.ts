/* eslint-disable @typescript-eslint/no-explicit-any */
import { getApiData } from '$lib/services/getData'
import { error, redirect } from '@sveltejs/kit'

// export const ssr = false;

export const load = async ({ params, fetch, locals, url }) => {
	if (!locals.user) throw redirect(302, '/login')

	const urlBase = import.meta.env.VITE_API_URL

	const token = locals.user?.token
	const headers = token ? { authorization: `Bearer ${token}` } : {}

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
