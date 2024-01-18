<script lang="ts">
	import { Tooltip } from 'flowbite-svelte'
	import Icon from '$lib/components/common/Icon.svelte'
	import { getContext } from 'svelte'

	export let isMobileDevice: boolean = false

	let widgetActions: any = getContext('widgetActions')

	$: filter = $widgetActions.find((action: any) => action.name === 'exportData')
</script>

{#if filter}
	<button class="icon btn hover:bg-light-100 dark:hover:bg-dark-200">
		<Icon icon="tabler:filter" size="18" />
	</button>
	<Tooltip placement="bottom" class={`z-10 ${isMobileDevice ? 'hidden' : ''}`}>Filter</Tooltip>
{/if}
