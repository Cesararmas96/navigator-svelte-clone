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

	const program_slug = next ? next : params.programs
	const tenant = url.hostname.split('.')[0]

	let programs, program, modules, moduleName, trocModule, menu

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
			const resp = await getApiData(`${urlBase}/api/v1/clients?subdomain_prefix=${tenant}`, 'GET')
			locals.client = resp[0]
		}
		programs = await getApiData(
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
		program = programs.find((item: any) => item.program_slug == program_slug)
		if (!program) throw new Error('No program found')
	} catch (error) {
		console.log('error programs', url.origin)
		if (url.origin.includes('teams')) throw redirect(302, 'error/403')
		else throw redirect(302, 'home')
	}
	try {
		modules = await getApiData(
			`${urlBase}/api/v2/modules?program_slug=${program_slug}`,
			'GET',
			{},
			{},
			{ headers },
			fetch,
			false
		)
		moduleName = next ? next : params.dashboard ? params.dashboard : program_slug
		trocModule =
			modules && modules.length > 0
				? modules.find(
						(item: any) => item.module_name === moduleName || item.module_slug === moduleName
				  )
				: null
		menu = trocModule
			? modules.filter((item: any) => item.program_id === trocModule?.program_id)
			: []
	} catch (error) {
		console.log('error modules', url.origin)
		if (url.origin.includes('teams')) throw redirect(302, 'error/403')
		else throw redirect(302, 'home')
	}

	try {
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
	} catch (error) {
		return { error }
	}
}
