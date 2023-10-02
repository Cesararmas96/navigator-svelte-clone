<script lang="ts">
	import { onMount } from 'svelte'
	import type { Writable } from 'svelte/store'

	export let widget: Writable<any>
	export let data: any

	let Thing: any

	onMount(async () => {
		$widget.data = data
		Thing = (await import(`./type/${$widget.classbase}.svelte`)).default
		if ($widget.temp) {
			$widget.instance_loading = true
		}
		// if ($widget.attributes.explorer === 'v2') {
		// 	$widget.instance_loaded = true
		// 	$widget.attributes.explorer = 'v3'
		// }
	})
</script>

<svelte:component this={Thing} {data} />
