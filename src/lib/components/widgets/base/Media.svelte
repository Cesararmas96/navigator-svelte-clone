<script lang="ts">
	import { getContext } from 'svelte'

	let widget: any = getContext('widget')

	const data = $widget.data.url
</script>

<slot {data} />
