import { redirect } from '@sveltejs/kit'

export const load = async ({ locals, parent, params }) => {
	if (!locals.user) throw redirect(302, '/login')

	const { reports } = await parent()
	let report

	if (reports) {
		report = reports.find((report) => report.id === params.report)
	}

	return { report }
}
