<script lang="ts">
	import { getContext } from 'svelte'
	import { getWidgetAction } from '$lib/helpers/widget/actions'
	import ItemContent from './ItemContent.svelte'

	export let showInMenu: boolean

	let widgetActions: any = getContext('widgetActions')
	$: reload = getWidgetAction($widgetActions, 'reloadFetchData')
</script>

{#if reload}
	<ItemContent
		{showInMenu}
		name="Reload"
		icon="tabler:refresh"
		callback={() => reload && reload.action()}
	/>
{/if}
