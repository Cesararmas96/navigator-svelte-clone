export const schema = {
	properties: {
		// link
		title_link: {
			type: 'string',
			label: null,
			attrs: {
				placeholder: null,
				format: null
			},
			readOnly: false,
			default: ''
		},
		href_link: {
			type: 'string',
			label: 'Link',
			attrs: {
				placeholder: null,
				format: null
			},
			readOnly: false,
			default: ''
		},
		external_link: {
			type: 'boolean',
			label: 'Open External',
			attrs: {
				placeholder: null,
				format: null
			},
			readOnly: false,
			default: false
		},
		icon_link: {
			type: 'string',
			label: null,
			attrs: {
				placeholder: null,
				format: null
			},
			readOnly: false,
			default: ''
		},
		description_link: {
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

// TODO: form builder interprete schema real
export const link = {
	properties: {
		format_definition: {
			$ref: '/schemas/format_definition'
		},
		title_link: {
			type: 'string',
			label: null,
			attrs: {
				placeholder: null,
				format: null
			},
			readOnly: false,
			default: ''
		},
		description_link: {
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
	},
	$defs: {
		format_definition: {
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
}
