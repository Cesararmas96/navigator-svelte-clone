<script lang="ts">
	import { Tooltip } from 'flowbite-svelte'
	import Icon from '$lib/components/common/Icon.svelte'

	let isPin = false
</script>

<button
	class="icon btn hover:bg-light-100 dark:hover:bg-dark-200"
	on:click={(event) => (isPin = !isPin)}
>
	<Icon icon={isPin ? 'tabler:pinned-off' : 'tabler:pinned'} size="18" />
</button>
<Tooltip placement="left">{isPin ? 'Unpinned' : 'Pin'}</Tooltip>
