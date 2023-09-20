<script lang="ts">
	import { Tooltip } from 'flowbite-svelte'
	import Icon from '$lib/components/common/Icon.svelte'
	import { getContext } from 'svelte'
	import type { Writable } from 'svelte/store'

	const widget = getContext<Writable<any>>('widget')

	const handleClick = () => {
		if ($widget.temp) {
			$widget.close_instance = true
		}
	}
</script>

<button class="icon btn hover:bg-light-100 dark:hover:bg-dark-200" on:click={handleClick}>
	<Icon icon="tabler:x" size="18" />
</button>
<Tooltip>Close</Tooltip>
