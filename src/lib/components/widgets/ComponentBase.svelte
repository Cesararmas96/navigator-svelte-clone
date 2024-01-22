<script lang="ts">
	import { capitalizeWord } from '$lib/helpers/common/common'
	import type { Writable } from 'svelte/store'

	export let widget: Writable<any>

	let Thing: any

	let widgetBase: string

	// $: if ($widget && $widget.widget_type_id) {
	widgetBase =
		$widget.widget_type_id === 'business-card'
			? 'Api'
			: $widget.widget_type_id.includes('-')
			? capitalizeWord($widget.widget_type_id.split('-')[0])
			: capitalizeWord($widget.widget_type_id)

	widgetBase = widgetBase === 'Api' || widgetBase === 'Rest' ? widgetBase : 'Media'

	if (widgetBase === 'Media') {
		$widget.params.settings.toolbar.reload = true
		$widget.params.settings.toolbar.filtering = true
		$widget.params.settings.toolbar.export = true
	}

	import(`./base/${widgetBase}.svelte`).then((value: any) => {
		Thing = value.default
	})
	// }
</script>

<svelte:component this={Thing} {widget} let:data>
	<slot {data} />
</svelte:component>
