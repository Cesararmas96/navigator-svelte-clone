export const dashboards = {
	params: {
		model: {
			meta: 'api/v2/dashboards',
			primaryKey: 'dashboard_id'
		},
		btnsActions: {
			top: {
				createModelWithFormBuilder: {
					title: 'New Dashboard'
				}
			}
		}
	},
	query_slug: {
		slug: `{BASE_URL_API}/api/v2/dashboards`
	},
	format_definition: {}
}
