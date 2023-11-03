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
				original: {
					type: 'string',
					label: 'Imagen',
					attrs: {
						placeholder: null,
						format: null
					},
					readOnly: false,
					required: true,
					default: ''
				},
				thumbnail: {
					type: 'string',
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
