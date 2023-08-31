<script lang="ts">
	import { Tooltip } from 'flowbite-svelte'
	import Icon from '$lib/components/common/Icon.svelte'
	import { getContext } from 'svelte'

	let widgetActions: any = getContext('widgetActions')

	$: reload = $widgetActions.find((action: any) => action.name === 'reloadFetchData')
</script>

{#if reload}
	<button
		class="icon btn hover:bg-light-100 dark:hover:bg-dark-200"
		on:click={() => reload && reload.action()}
	>
		<Icon icon="tabler:refresh" size="18" />
	</button>
	<Tooltip placement="left">Clear cache and reload</Tooltip>
{/if}
