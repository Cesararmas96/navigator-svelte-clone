<script lang="ts">
	import type { Writable } from 'svelte/store'

	export let widget: Writable<any>

	const data = { ...$widget }
</script>

<slot {data} {widget} />
