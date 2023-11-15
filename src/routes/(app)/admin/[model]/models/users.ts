export const users = {
	params: {
		model: {
			meta: 'api/v1/users',
			primaryKey: 'user_id',
			schema: {
				properties: {
					user_id: { attrs: { visible: false } },
					display_name: { attrs: { visible: false } },
					alt_email: { attrs: { visible: false } },
					password: { attrs: { visible: false } },
					last_login: { attrs: { visible: false } },
					is_staff: { attrs: { visible: false } },
					title: { attrs: { visible: false } },
					avatar: { attrs: { visible: false } },
					associate_id: { attrs: { visible: false } },
					associate_oid: { attrs: { visible: false } },
					department_code: { attrs: { visible: false } },
					position_id: { attrs: { visible: false } },
					group_id: { attrs: { visible: false } },
					groups: { attrs: { visible: false } },
					program_id: { attrs: { visible: false } },
					programs: { attrs: { visible: false } },
					created_at: { type: 'datetime', attrs: { visible: false } }
				},
				required: ['is_superuser', 'is_active', 'is_new']
			}
		},
		btnsActions: {
			top: {
				createModelWithFormBuilder: {
					title: 'New User'
				}
			}
		}
	},
	query_slug: {
		slug: `{BASE_URL_API}/api/v1/users`
	},
	format_definition: {
		email: {
			order: 4,
			title: 'Email'
		},
		title: {
			hidden: true
		},
		avatar: {
			hidden: true
		},
		groups: {
			align: 'center',
			order: 6,
			title: 'Groups'
		},
		is_new: {
			id: 'user_id',
			align: 'center',
			model: 'users',
			order: 9,
			title: 'Is New',
			render: 'isActiveYesOrNo',
			maxWidth: '100',
			postRender: 'postRenderChangeYesOrNo'
		},
		actions: {
			order: 10,
			title: 'Actions'
		},
		company: {
			hidden: true
		},
		user_id: {
			align: 'left',
			order: 1,
			title: 'ID',
			format: '####',
			maxWidth: '100'
		},
		group_id: {
			hidden: true
		},
		is_staff: {
			hidden: true
		},
		password: {
			hidden: true
		},
		programs: {
			hidden: true
		},
		username: {
			hidden: true
		},
		alt_email: {
			hidden: true
		},
		is_active: {
			id: 'user_id',
			align: 'center',
			model: 'users',
			order: 8,
			title: 'Active',
			render: 'isActiveYesOrNo',
			maxWidth: '100',
			postRender: 'postRenderChangeYesOrNo'
		},
		last_name: {
			hidden: true
		},
		created_at: {
			hidden: true
		},
		created_by: {
			hidden: true
		},
		department: {
			hidden: true
		},
		first_name: {
			hidden: true
		},
		last_login: {
			align: 'center',
			order: 7,
			title: 'Last login',
			render: 'dateAndTime'
		},
		program_id: {
			hidden: true
		},
		date_joined: {
			hidden: true
		},
		position_id: {
			hidden: true
		},
		associate_id: {
			hidden: true
		},
		display_name: {
			order: 2,
			title: 'Name'
		},
		is_superuser: {
			hidden: true
		},
		associate_oid: {
			hidden: true
		},
		department_code: {
			hidden: true
		}
	}
}

export const usergroups = {
	params: {
		model: {
			meta: 'api/v1/usergroups',
			keys: ['user_id', 'group_id'],
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
					title: 'New User Group'
				}
			}
		}
	},
	query_slug: {
		slug: `{BASE_URL_API}/api/v1/usergroups`
	},
	format_definition: {
		actions: {
			order: 10,
			title: 'Actions'
		},
		user_id: {
			align: 'left',
			order: 1,
			title: 'User ID',
			format: '####'
		},
		group_id: {
			align: 'left',
			order: 2,
			title: 'Group ID',
			format: '####'
		},
		created_at: {
			align: 'center',
			order: 3,
			title: 'Created At',
			render: 'dateAndTime'
		},
		created_by: {
			hidden: true
		}
	}
}
