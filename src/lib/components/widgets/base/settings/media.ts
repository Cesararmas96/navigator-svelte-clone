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
			default: ''
		}
	}
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createMediaSettings(widget: Writable<any>) {
	widget.update((widgetBD) => {
		schema.properties.url.default = widgetBD?.url
		widgetBD.schema = schema
		return widgetBD
	})
}
