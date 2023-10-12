<script lang="ts">
	import { onMount } from 'svelte'
	import type { Writable } from 'svelte/store'

	export let widget: Writable<any>
	export let data: any

	const classbase = $widget.classbase.replace('Widget', '')

	let Thing: any

	onMount(async () => {
		$widget.data = data
		Thing = (await import(`./type/${classbase}/${classbase}.svelte`)).default
		if ($widget.temp) {
			$widget.instance_loading = true
		}
	})
</script>

<svelte:component this={Thing} {data} />
