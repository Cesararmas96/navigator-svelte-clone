<script lang="ts">
	import { onMount } from 'svelte'
	import type { Writable } from 'svelte/store'
    import {capitalizeWord} from "$lib/helpers/common/common";

	export let widget: Writable<any>
	export let data: any

	let classbase = $widget.classbase?.replace('Widget', '')

    if (!classbase){
		classbase = capitalizeWord($widget.widget_type_id)
    }



	let Thing: any

	onMount(async () => {
		if (!$widget.data) $widget.data = data
		Thing = (await import(`./type/${classbase}/${classbase}.svelte`)).default
		if ($widget.temp) {
			$widget.instance_loading = true
		}
	})
</script>

<svelte:component this={Thing} data={$widget.data} />
