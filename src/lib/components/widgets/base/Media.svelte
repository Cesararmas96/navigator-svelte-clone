<script lang="ts">
	import type { Writable } from 'svelte/store'

	export let widget: Writable<any>

	$widget.params.settings.toolbar.reload = false
	$widget.params.settings.toolbar.filtering = false
	$widget.params.settings.toolbar.export = false

	const data = { ...$widget }
</script>

<slot {data} {widget} />
