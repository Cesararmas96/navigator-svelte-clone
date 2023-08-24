import modulesJson from '../../../data/modules.json';

export const load = async ({ params, fetch }) => {
	const trocModule = modulesJson.find(item => item.module_slug === params.programs);
	const menu = modulesJson.filter(item => item.program_id === trocModule?.program_id);

	return { trocModule, menu }
}