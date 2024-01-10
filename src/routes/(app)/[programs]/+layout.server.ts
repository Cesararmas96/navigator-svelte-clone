/* eslint-disable @typescript-eslint/no-explicit-any */
import { getApiData } from '$lib/services/getData'
import { redirect } from '@sveltejs/kit'

// export const ssr = false;

export const load = async ({ params, fetch, locals, url }) => {
	if (!locals.user) throw redirect(302, '/login')

	const next = locals.user.next
	console.log('LAYOUT NEXT', next)
	if (next && params.programs !== next) throw redirect(302, `/${next}`)

	const urlBase = import.meta.env.VITE_API_URL

	const headers = { authorization: `Bearer ${locals.user.token}` }
	console.log('LAYOUT headers', headers)

	const program = next ? next : params.programs
	console.log('LAYOUT program', program)

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
	console.log('LAYOUT PASO 1')
	const modules = await getApiData(
		`${urlBase}/api/v2/modules?program_slug=${program}`,
		'GET',
		{},
		{},
		{ headers },
		fetch
	)
	console.log('LAYOUT PASO 2')
	const variablesOperational = await getApiData(
		`${urlBase}/api/v2/variables/${program}`,
		'GET',
		{},
		{},
		{ headers },
		fetch
	)
	console.log('LAYOUT PASO 3')
	const moduleName = next ? next : params.dashboard ? params.dashboard : program
	console.log('LAYOUT PASO 4')
	const trocModule =
		modules && modules.length > 0
			? modules.find(
					(item: any) => item.module_name === moduleName || item.module_slug === moduleName
			  )
			: null
	console.log('LAYOUT PASO 5')
	const menu = trocModule
		? modules.filter((item: any) => item.program_id === trocModule?.program_id)
		: []
	console.log('LAYOUT PASO 6')
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
	console.log('LAYOUT PASO 7')
	const tenant = url.hostname.split('.')[0]
	console.log('LAYOUT PASO 8', url.hostname, tenant)
	const [client] = await getApiData(
		`${urlBase}/api/v1/clients?subdomain_prefix=${tenant}`,
		'GET',
		{},
		{},
		{ headers },
		fetch
	)
	console.log('LAYOUT PASO 9')

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
