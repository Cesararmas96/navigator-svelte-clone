import type { Writable } from 'svelte/store'

const schema = {
	properties: {
		url: {
			type: 'string',
			label: null,
			attrs: {
				placeholder: null,
				format: null
			},
			readOnly: false,
			_group: 'media',
			default: ''
		}
	},
	addGroups: [{ name: 'media', title: 'Media', open: true }]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createMediaSettings(widget: Writable<any>) {
	const schemaUrl = structuredClone(schema)

	widget.update((widgetBD) => {
		schemaUrl.properties.url.default = widgetBD?.url
		widgetBD.schema = schemaUrl
		return widgetBD
	})
}
