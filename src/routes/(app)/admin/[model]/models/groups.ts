export const groups = {
	params: {
		model: {
			meta: 'api/v1/groups',
			primaryKey: 'id'
		},
		btnsActions: {
			top: {
				createModelWithFormBuilder: {
					title: 'New Group'
				}
			}
		}
	},
	query_slug: {
		slug: `{BASE_URL_API}/api/v1/groups`
	},
	format_definition: {
		actions: {
			order: 10,
			title: 'Actions'
		},
		group_id: {
			align: 'left',
			order: 1,
			title: 'Group ID',
			format: '####'
		},
		client_id: {
			order: 3,
			title: 'Client ID',
			hidden: true
		},
		is_active: {
			align: 'center',
			order: 8,
			title: 'Active',
			hidden: true,
			render: 'isActive'
		},
		created_at: {
			hidden: true
		},
		created_by: {
			hidden: true
		},
		group_name: {
			order: 2,
			title: 'Name'
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
			title: 'Description',
			hidden: true
		}
	}
}
