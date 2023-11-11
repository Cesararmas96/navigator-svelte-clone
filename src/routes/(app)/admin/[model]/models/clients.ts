export const clients = {
	params: {
		model: {
			meta: 'api/v1/clients',
			primaryKey: 'client_id'
		},
		btnsActions: {
			top: {
				createModelWithFormBuilder: {
					title: 'New Client'
				}
			}
		}
	},
	query_slug: {
		slug: `{BASE_URL_API}/api/v1/clients`
	},
	format_definition: {
		client: {
			order: 2,
			title: 'Name'
		},
		actions: {
			order: 10,
			title: 'Actions'
		},
		branding: {
			order: 6.3,
			title: 'Branding',
			hidden: true,
			renderz: 'jsonPretty',
			minWidth: '220'
		},
		client_id: {
			align: 'left',
			order: 1,
			title: 'ID',
			format: '####'
		},
		is_active: {
			align: 'center',
			order: 8,
			title: 'Active',
			hidden: true,
			renderz: 'isActive'
		},
		slideshow: {
			order: 6.2,
			title: 'Slideshow',
			renderz: 'jsonPretty',
			minWidth: '220'
		},
		attributes: {
			order: 6,
			title: 'Attributes',
			hidden: true,
			renderz: 'jsonPretty',
			minWidth: '220'
		},
		created_at: {
			hidden: true
		},
		created_by: {
			hidden: true
		},
		updated_at: {
			align: 'center',
			order: 9,
			title: 'Updated At',
			renderz: 'dateAndTime'
		},
		client_slug: {
			order: 3,
			title: 'Client Slug'
		},
		description: {
			order: 4,
			title: 'Description'
		},
		auth_backends: {
			order: 5,
			title: 'Authentications'
		},
		subdomain_prefix: {
			order: 7,
			title: 'Subdomain'
		}
	}
}

export const program_clients = {
	params: {
		model: {
			meta: 'api/v1/program_clients',
			secondKey: 'client_id',
			primaryKey: 'program_id'
		},
		btnsActions: {
			top: {
				createModelWithFormBuilder: {
					title: 'New Program Client'
				}
			}
		}
	},
	query_slug: {
		slug: `{BASE_URL_API}/api/v1/program_clients`
	},
	format_definition: {
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
		client_id: {
			align: 'left',
			order: 3,
			title: 'Client ID',
			format: '####'
		},
		created_at: {
			align: 'center',
			order: 9,
			title: 'Created At',
			render: 'dateAndTime'
		},
		created_by: {
			hidden: true
		},
		program_id: {
			align: 'left',
			order: 1,
			title: 'Program ID',
			format: '####'
		},
		client_slug: {
			order: 4,
			title: 'Client Slug'
		},
		program_slug: {
			order: 2,
			title: 'Program Slug'
		}
	}
}

export const module_clients = {
	params: {
		model: {
			meta: 'api/v1/module_clients',
			secondKey: 'module_id',
			primaryKey: 'client_id'
		},
		btnsActions: {
			top: {
				createModelWithFormBuilder: {
					title: 'New Client Module'
				}
			}
		}
	},
	query_slug: {
		slug: `{BASE_URL_API}/api/v1/module_clients`
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
