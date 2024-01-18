<script lang="ts">
	import { getContext, onMount } from 'svelte'
	import type { Writable } from 'svelte/store'
	import Grid from 'tui-grid'
	import { loadGridOptions } from '$lib/helpers/widget/tui-grid'

	export let data: any

	const widget: Writable<any> = getContext('widget')

	onMount(() => {
		new Grid(loadGridOptions($widget, data))
		Grid.applyTheme('striped')
	})
</script>

<div id="grid-{$widget.widget_id}" />
