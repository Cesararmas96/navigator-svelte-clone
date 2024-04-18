import { redirect } from '@sveltejs/kit'

export const load = async ({ locals, parent, params }) => {
	if (!locals.user || !locals.user.token) throw redirect(302, '/login')

	const { categories } = await parent()
	let model

	if (categories) {
		// model = categories.find((report) => report.id === params.model)

		const foundCategory = categories.find((category) =>
			category.models.some((model) => model.model === params.model)
		)

		if (foundCategory) {
			model = foundCategory.models.find((model) => model.model === params.model)
		}
	}

	return { model }
}
