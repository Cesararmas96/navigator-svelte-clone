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

	const tenant = url.hostname.split('.')[0]

	try {
		if (!locals.client || locals.client?.client_slug !== tenant) {
			const resp = await getApiData(
				`${urlBase}/api/v1/clients?subdomain_prefix=${tenant}`,
				'GET',
				{},
				{},
				{ 'no-auth': true },
				fetch,
				false
			)
			locals.client = resp[0]
		}

		const dashboard = await getApiData(
			`${urlBase}/api/v2/dashboards/${params.id}`,
			'GET',
			{},
			{},
			{ headers },
			fetch
		)

		const programs = await getApiData(
			`${urlBase}/api/v1/programs_user?client_slug=${locals.client.client_slug}`,
			'GET',
			{},
			{},
			{ headers },
			fetch,
			false
		)
		const program = programs.find((item: any) => item.program_id == dashboard.program_id)

		const modules = await getApiData(
			`${urlBase}/api/v2/modules?program_slug=${program.program_slug}`,
			'GET',
			{},
			{},
			{ headers },
			fetch,
			false
		)
		const trocModule = modules.find((item: any) => item.module_id === dashboard.module_id)

		return { dashboard, trocModule, programs, program, user: locals.user }
	} catch (err: any) {
		const origin = `<div class="origin-error hidden mt-2">Origin URL:<br>${url.origin}`
		if (url.origin.includes('teams')) throw redirect(302, 'error/403')
		console.log(err)
		throw error(err.status, err?.body?.message + origin)
	}
}
