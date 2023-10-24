<script lang="ts">
	import type { Writable } from 'svelte/store'

	export let widget: Writable<any>
</script>

<div id={`widget-content-top-${$widget.widget_id}`} />
