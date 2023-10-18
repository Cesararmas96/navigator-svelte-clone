<script lang="ts">
	import { getContext } from 'svelte'
	import type { Writable } from 'svelte/store'

	export let widget: Writable<any>

	const data = { ...$widget }
</script>

<slot {data} {widget} />
