export const schemaGeneral = {
	$schema: 'https://json-schema.org/draft/2020-12/schema',
	$id: '/schemas/settings',
	additionalProperties: true,
	title: 'Settings',
	description: 'Settings',
	type: 'object',
	table: 'settings',
	schema: 'settings',
	properties: {
		// general
		title: {
			type: 'string',
			label: null,
			attrs: {
				placeholder: null,
				format: null
			},
			readOnly: false,
			_group: 'general',
			default: ''
		},
		icon: {
			type: 'string',
			label: null,
			attrs: {
				placeholder: null,
				format: null
			},
			readOnly: false,
			_group: 'general',
			default: ''
		},
		description: {
			type: 'string',
			nullable: true,
			label: null,
			attrs: {
				placeholder: null
			},
			format: 'textarea',
			readOnly: false,
			writeOnly: false,
			_group: 'general',
			default: ''
		}
	},
	groups: [
		{ name: 'general', title: 'General', open: true },
		{ name: 'toolbar', title: 'Toolbar', open: false }
	],
	noHeader: true
}

export const schemaToolbar = {
	$schema: 'https://json-schema.org/draft/2020-12/schema',
	$id: '/schemas/settings',
	additionalProperties: true,
	title: 'Settings',
	description: 'Settings',
	type: 'object',
	table: 'settings',
	schema: 'settings',
	properties: {
		// toolbar
		params_header: {
			$ref: '/schemas/params_header',
			_group: 'toolbar'
		}
	},
	$defs: {
		params_header: {
			id: '/schemas/params_header',
			properties: {
				show: {
					type: 'boolean',
					label: null,
					attrs: {
						placeholder: null,
						format: null
					},
					readOnly: false,
					_group: 'toolbar',
					default: false
				}
				// icon: {
				// 	type: 'boolean',
				// 	label: null,
				// 	attrs: {
				// 		placeholder: null,
				// 		format: null
				// 	},
				// 	readOnly: false,
				// 	_group: 'toolbar',
				// 	default: false
				// },
				// title: {
				// 	type: 'boolean',
				// 	label: null,
				// 	attrs: {
				// 		placeholder: null,
				// 		format: null
				// 	},
				// 	readOnly: false,
				// 	_group: 'toolbar',
				// 	default: false
				// }
			}
		}
	},

	// addGroups: [{ name: 'toolbar', title: 'Toolbar', open: false }],
	noHeader: true
}
