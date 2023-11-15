export const programs = {
	params: {
		model: {
			meta: 'api/v1/programs',
			primaryKey: 'program_id'
		},
		btnsActions: {
			top: {
				createModelWithFormBuilder: {
					title: 'New Program'
				}
			}
		}
	},
	query_slug: {
		slug: `{BASE_URL_API}/api/v1/programs`
	},
	format_definition: {
		abbrv: {
			hidden: true
		},
		actions: {
			order: 10,
			title: 'Actions'
		},
		visible: {
			hidden: true
		},
		image_url: {
			hidden: true
		},
		is_active: {
			align: 'center',
			order: 8,
			title: 'Active',
			render: 'isActive'
		},
		attributes: {
			order: 6,
			title: 'Attributes',
			render: 'jsonPretty',
			minWidth: '220'
		},
		conditions: {
			hidden: true
		},
		created_at: {
			hidden: true
		},
		created_by: {
			hidden: true
		},
		program_id: {
			align: 'left',
			order: 1,
			title: 'ID',
			format: '####'
		},
		updated_at: {
			align: 'center',
			order: 9,
			title: 'Updated At',
			hidden: true,
			render: 'dateAndTime'
		},
		description: {
			order: 4,
			title: 'Description'
		},
		program_name: {
			order: 2,
			title: 'Name'
		},
		program_slug: {
			order: 3,
			title: 'Program Slug'
		},
		filtering_show: {
			order: 6,
			title: 'Filtering',
			render: 'jsonPretty',
			minWidth: '220'
		},
		program_cat_id: {
			order: 5,
			title: 'Category',
			format: '####'
		},
		allow_filtering: {
			hidden: true
		}
	}
}

export const program_groups = {
	params: {
		model: {
			meta: 'api/v1/program_groups',
			keys: ['program_id', 'group_id'],
			schema: {
				properties: {
					created_at: { attrs: { visible: false } },
					created_by: { attrs: { visible: false } }
				}
			}
		},
		btnsActions: {
			top: {
				createModelWithFormBuilder: {
					title: 'New Program Group'
				}
			}
		}
	},
	query_slug: {
		slug: `{BASE_URL_API}/api/v1/program_groups`
	},
	format_definition: {}
}

export const program_categories = {
	params: {
		model: {
			meta: 'api/v1/program_categories',
			primaryKey: 'program_cat_id'
		},
		btnsActions: {
			top: {
				createModelWithFormBuilder: {
					title: 'New Category'
				}
			}
		}
	},
	query_slug: {
		slug: `{BASE_URL_API}/api/v1/program_categories`
	},
	format_definition: {
		actions: {
			order: 3,
			title: 'Actions'
		},
		category: {
			order: 2,
			title: 'Name'
		},
		program_cat_id: {
			align: 'left',
			order: 1,
			title: 'ID',
			format: '####'
		}
	}
}
