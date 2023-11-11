export const widgets = {
	params: {
		model: {
			meta: 'api/v2/widgets',
			primaryKey: 'id'
		},
		btnsActions: {
			top: {
				createModelWithFormBuilder: {
					title: 'New Widget'
				}
			}
		}
	},
	query_slug: {
		slug: '{BASE_URL_API}/api/v2/widgets'
	},
	format_definition: {}
}

export const widgets_template = {
	params: {
		model: {
			meta: 'api/v2/widgets-template',
			primaryKey: 'uid'
		},
		btnsActions: {
			top: {
				createModelWithFormBuilder: {
					title: 'New Template Widget'
				}
			}
		}
	},
	query_slug: {
		slug: '{BASE_URL_API}/api/v2/widgets-template'
	},
	format_definition: {}
}

export const widgets_types = {
	params: {
		model: {
			meta: 'api/v2/widget-types',
			primaryKey: 'name'
		},
		btnsActions: {
			top: {
				createModelWithFormBuilder: {
					title: 'New Widget Type'
				}
			}
		}
	},
	query_slug: {
		slug: '{BASE_URL_API}/api/v2/widget-types'
	},
	format_definition: {}
}
