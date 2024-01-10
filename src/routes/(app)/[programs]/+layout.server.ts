/* eslint-disable @typescript-eslint/no-explicit-any */
import { getApiData } from '$lib/services/getData'
import { redirect } from '@sveltejs/kit'

// export const ssr = false;

export const load = async ({ params, fetch, locals, url }) => {
	if (!locals.user) throw redirect(302, '/login')

	const next = locals.user.next
	if (next && params.programs !== next) {
		throw redirect(302, `/${next}`)
	}

	const urlBase = import.meta.env.VITE_API_URL

	const headers = { authorization: `Bearer ${locals.user.token}` }

	const program = next ? next : params.programs

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
	const modules = await getApiData(
		`${urlBase}/api/v2/modules?program_slug=${program}`,
		'GET',
		{},
		{},
		{ headers },
		fetch
	)
	const variablesOperational = await getApiData(
		`${urlBase}/api/v2/variables/${program}`,
		'GET',
		{},
		{},
		{ headers },
		fetch
	)
	const moduleName = next ? next : params.dashboard ? params.dashboard : program
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
		fetch
	)
	const tenant = url.hostname.split('.')[0]
	const [client] = await getApiData(
		`${urlBase}/api/v1/clients?subdomain_prefix=${tenant}`,
		'GET',
		{},
		{},
		{ headers },
		fetch
	)

	return {
		programs,
		trocModule,
		dashboards,
		menu,
		user: locals.user,
		tenant,
		client,
		variablesOperational
	}
}
