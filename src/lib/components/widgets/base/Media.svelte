<script lang="ts">
	import { getContext } from 'svelte'

	let widget: any = getContext('widget')

	const data = $widget?.url
</script>

<slot {data} />
