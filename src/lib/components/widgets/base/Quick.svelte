<script lang="ts">
	import { getContext } from 'svelte'

	let widget: any = getContext('widget')

	const data = {}
</script>

<slot {data} />
