import { getApiData } from '$lib/services/getData'
import { variablesOperationalProgram } from '$lib/stores/programs'
import modulesJson from '../../../data/modules.json'

export const load = async ({ params }) => {
	const trocModule = modulesJson.find((item) => item.module_slug === params.programs)
	const menu = modulesJson.filter((item) => item.program_id === trocModule?.program_id)

	const urlBase = import.meta.env.VITE_API_URL
	// const data = await getApiData(`${urlBase}/api/v2/modules?program_slug=${params.programs}`, 'GET')
	const variablesOperational = await getApiData(
		`${urlBase}/api/v2/variables/${params.programs}`,
		'GET'
	)

	if (variablesOperational) {
		variablesOperationalProgram.set(variablesOperational)
	}

	return { trocModule, menu }
}
