<script lang="ts">
	import { Tooltip } from 'flowbite-svelte'
	import Icon from './Icon.svelte'

	export let icon: string = 'mdi:help'
	export let size: string = '10px'
	export let placement: any = 'right'
</script>

<Icon
	{icon}
	{size}
	classes="rounded-full bg-gray-300 p-1 ml-2 text-gray-900 dark:bg-gray-700 dark:text-gray-300"
/>
<Tooltip {placement}>
	<slot />
</Tooltip>
