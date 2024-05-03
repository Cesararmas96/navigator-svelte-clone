/* eslint-disable @typescript-eslint/no-explicit-any */
import { getApiData } from '$lib/services/getData'
import { redirect, error } from '@sveltejs/kit'

// export const ssr = false;

export const load = async ({ params, fetch, locals, url }) => {
	if (!locals.user || !locals.user.token) throw redirect(302, '/login')

	const next = locals.user.next
	if (next && params.programs !== next) {
		throw redirect(302, `/${next}`)
	}

	const urlBase = import.meta.env.VITE_API_URL

	const headers = !locals.user?.apikey
		? { authorization: `Bearer ${locals.user?.token}` }
		: { 'x-api-key': locals.user?.token }

	const program_slug = next ? next : params.programs
	const tenant = url.hostname.split('.')[0]

	const variablesOperational = await getApiData(
		`${urlBase}/api/v2/variables/${program_slug}`,
		'GET',
		{},
		{},
		{ headers },
		fetch,
		false
	)
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
		const programs = await getApiData(
			`${import.meta.env.VITE_API_URL}/api/v1/programs_user?client_slug=${
				locals.client.client_slug
			}`,
			'GET',
			{},
			{},
			{ headers },
			fetch,
			false
		)
		const program = programs.find((item: any) => item.program_slug == program_slug)
		if (!program) throw error(404, 'No program found')

		const modules = await getApiData(
			`${urlBase}/api/v2/modules?program_slug=${program_slug}`,
			'GET',
			{},
			{},
			{ headers },
			fetch,
			false
		)
		const moduleName = next ? next : params.dashboard ? params.dashboard : program_slug
		const trocModule =
			modules && modules.length > 0
				? modules.find(
						(item: any) => item.module_name === moduleName || item.module_slug === moduleName
				  )
				: null
		const menu = trocModule
			? modules.filter((item: any) => item.program_id === trocModule?.program_id)
			: []

		const dashboards = await getApiData(
			`${urlBase}/api/v2/dashboards?program_id=${trocModule?.program_id}&module_id=${
				trocModule?.module_id
			}&explorer=${trocModule?.module_slug?.includes('explorer') ? true : false}`,
			'GET',
			{},
			{},
			{ headers },
			fetch,
			false
		)

		return {
			program,
			programs,
			trocModule,
			dashboards,
			menu,
			user: locals.user,
			tenant,
			variablesOperational
		}
	} catch (err: any) {
		console.log(err.status, err)
		const origin = `<div class="origin-error hidden mt-2">Origin URL:<br>${url.origin}`
		if (url.origin.includes('teams')) throw redirect(302, 'error/403')
		throw error(err.status, err.body?.message + origin)
		// if (url.origin.includes('teams')) throw redirect(302, 'error/403')
		// else throw redirect(302, 'home')
	}
}
