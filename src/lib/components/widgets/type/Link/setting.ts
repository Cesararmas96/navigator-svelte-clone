export const schema = {
	properties: {
		format_definition: {
			$ref: '/schemas/format_definition'
			// _group: 'design'
		}
	},
	$defs: {
		format_definition: {
			id: '/schemas/format_definition',
			title: 'Link',
			type: 'object',
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
				},
				icon: {
					type: 'string',
					label: null,
					attrs: {
						placeholder: null,
						format: null
					},
					readOnly: false,
					default: ''
				},
				description: {
					type: 'string',
					label: null,
					attrs: {
						placeholder: null,
						format: null
					},
					format: 'textarea',
					readOnly: false,
					default: ''
				}
			}
		}
	}
	// groups: [{ name: 'design', title: 'Design' }]
}
