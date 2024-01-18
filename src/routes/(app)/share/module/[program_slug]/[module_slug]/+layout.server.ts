/* eslint-disable @typescript-eslint/no-explicit-any */
import { getApiData } from '$lib/services/getData'
import { redirect } from '@sveltejs/kit'

export const load = async ({ params, fetch, locals, url }) => {
	if (!locals.user) throw redirect(302, '/login')
	const urlBase = import.meta.env.VITE_API_URL

	const token = url.searchParams.get('token') || locals.user?.token
	const headers = token ? { authorization: `Bearer ${token}` } : {}

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
	const program = programs.find((item: any) => item.program_slug == params.program_slug)
	const variablesOperational = await getApiData(
		`${urlBase}/api/v2/variables/${program.program_slug}`,
		'GET',
		{},
		{},
		{ headers },
		fetch
	)
	const modules = await getApiData(
		`${urlBase}/api/v2/modules?program_slug=${params.program_slug}`,
		'GET',
		{},
		{},
		{ headers },
		fetch
	)
	const trocModule =
		modules && modules.length > 0
			? modules.find((item: any) => item.module_slug === params.module_slug)
			: null
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
		program,
		programs,
		trocModule,
		dashboards,
		user: locals.user,
		tenant,
		client,
		variablesOperational
	}
}
