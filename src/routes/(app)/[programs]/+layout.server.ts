import { getApiData } from '$lib/services/getData'

// export const ssr = false;

export const load = async ({ params, fetch }) => {
	const urlBase = import.meta.env.VITE_API_URL
	const programs = await getApiData(`programs`, 'GET', {}, {}, {}, fetch)
	const modules = await getApiData(
		`${urlBase}/api/v2/modules?program_slug=${params.programs}`,
		'GET',
		{},
		{},
		{},
		fetch
	)
	const moduleName = params.dashboard ? params.dashboard : params.programs
	const trocModule = modules.find(
		(item: any) => item.module_name === moduleName || item.module_slug === moduleName
	)
	const menu = modules.filter((item: any) => item.program_id === trocModule?.program_id)
	const dashboards = await getApiData(
		`${urlBase}/api/v2/dashboards?program_id=${trocModule?.program_id}&module_id=${
			trocModule?.module_id
		}&explorer=${trocModule?.module_slug?.includes('explorer') ? true : false}`,
		'GET',
		{},
		{},
		{},
		fetch
	)
	return { programs, trocModule, dashboards, menu }
}
