export const widgets = {
	params: {
		model: {
			meta: 'api/v2/widgets',
			primaryKey: 'widget_id',
			schema: {
				properties: {
					inserted_at: { attrs: { visible: false } },
					inserted_by: { attrs: { visible: false } },
					updated_at: { attrs: { visible: false } },
					updated_by: { attrs: { visible: false } }
				}
			}
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
			primaryKey: 'template_id',
			schema: {
				properties: {
					inserted_at: { attrs: { visible: false } },
					inserted_by: { attrs: { visible: false } },
					updated_at: { attrs: { visible: false } },
					updated_by: { attrs: { visible: false } }
				}
			}
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
			primaryKey: 'widget_type'
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
