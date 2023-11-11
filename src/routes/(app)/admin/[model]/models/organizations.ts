export const organizations = {
	params: {
		model: {
			meta: 'api/v1/organizations',
			primaryKey: 'org_id',
			schema: {
				properties: {
					created_at: {
						attrs: {
							visible: false
						}
					},
					updated_at: {
						attrs: {
							visible: false
						}
					},
					attributes: {
						type: 'dict'
					},
					created_by: {
						attrs: {
							visible: false
						}
					}
				},
				required: ['organization', 'org_slug', 'is_active']
			}
		},
		btnsActions: {
			top: {
				createModelWithFormBuilder: {
					title: 'New Organization'
				}
			}
		}
	},
	query_slug: {
		slug: `{BASE_URL_API}/api/v1/organizations`
	},
	format_definition: {
		oid: {
			hidden: true
		},
		org_id: {
			align: 'left',
			order: 1,
			title: 'ID',
			format: '####'
		},
		actions: {
			order: 10,
			title: 'Actions'
		},
		org_slug: {
			order: 3,
			title: 'Organization Slug'
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
			render: 'dateAndTime'
		},
		description: {
			order: 4,
			title: 'Description'
		},
		organization: {
			order: 2,
			title: 'Name'
		}
	}
}
