export const schema = {
	properties: {
		format_definition: {
			type: 'recursive',
			$ref: '/schemas/format_definition',
			_group: 'design'
		}
	},
	$defs: {
		format_definition: {
			id: '/schemas/format_definition',
			properties: {
				title: {
					type: 'string',
					label: null,
					attrs: {
						placeholder: null,
						format: null
					},
					readOnly: false,
					default: ''
				},
				href: {
					type: 'string',
					label: 'Link',
					attrs: {
						placeholder: null,
						format: null
					},
					readOnly: false,
					required: true,
					default: ''
				},
				external: {
					type: 'boolean',
					label: 'Open External',
					attrs: {
						placeholder: null,
						format: null
					},
					readOnly: false,
					default: false
				}
			},
			default: []
		}
	},
	addGroups: [{ name: 'design', title: 'Design' }]
}
