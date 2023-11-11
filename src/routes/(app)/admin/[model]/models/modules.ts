export const modules = {
	params: {
		model: {
			meta: 'api/v3/modules',
			primaryKey: 'module_id'
		},
		btnsActions: {
			top: {
				createModelWithFormBuilder: {
					title: 'New Module'
				}
			}
		}
	},
	query_slug: {
		slug: `{BASE_URL_API}/api/v3/modules`
	},
	format_definition: {
		id: {
			hidden: true
		},
		active: {
			align: 'center',
			order: 8,
			title: 'Active',
			render: 'isActive'
		},
		actions: {
			order: 10,
			title: 'Actions'
		},
		classname: {
			hidden: true
		},
		module_id: {
			align: 'left',
			order: 1,
			title: 'ID',
			format: '####'
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
			order: 5,
			title: 'Program ID',
			format: '####'
		},
		updated_at: {
			align: 'center',
			order: 9,
			title: 'Updated At',
			render: 'dateAndTime'
		},
		description: {
			order: 4,
			title: 'Description'
		},
		module_name: {
			order: 2,
			title: 'Name'
		},
		module_slug: {
			order: 3,
			title: 'Module Slug'
		},
		filtering_show: {
			hidden: true
		},
		allow_filtering: {
			hidden: true
		},
		parent_module_id: {
			hidden: true
		}
	}
}

export const module_groups = {
	params: {
		model: {
			meta: 'api/v1/module_groups',
			secondKey: 'module_id',
			primaryKey: 'client_id'
		},
		btnsActions: {
			top: {
				createModelWithFormBuilder: {
					title: 'New Module Group'
				}
			}
		}
	},
	query_slug: {
		slug: `{BASE_URL_API}/api/v1/module_groups`
	},
	format_definition: {
		active: {
			align: 'center',
			order: 8,
			title: 'Active',
			hidden: true,
			renderz: 'isActive'
		},
		actions: {
			order: 10,
			title: 'Actions'
		},
		group_id: {
			align: 'left',
			order: 4,
			title: 'Group ID',
			format: '####'
		},
		client_id: {
			align: 'left',
			order: 1,
			title: 'Client ID',
			format: '####'
		},
		module_id: {
			align: 'left',
			order: 3,
			title: 'Module ID',
			format: '####'
		},
		created_at: {
			hidden: true
		},
		program_id: {
			align: 'left',
			order: 2,
			title: 'Program ID',
			format: '####'
		}
	}
}
